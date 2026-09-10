import { Router } from "express";
import { upload } from "../middleware/upload.js";
import Place from "../models/Place.js";
import { runOCR } from "../services/ocr.js";
import { giDistrictCheck } from "../services/giCheck.js";
import { tier1Score, computeTrustScore } from "../services/trust.js";

const router = Router();

router.post("/:placeId", upload.single("document"), async (req, res) => {
  try {
    const place = await Place.findById(req.params.placeId);
    if (!place) return res.status(404).json({ error: "Place not found" });
    if (!place.bookable) return res.status(400).json({ error: "Only bookable providers (crafts) can be verified" });
    if (!req.file) return res.status(400).json({ error: "Upload a document to verify" });

    const { docType = "pehchan", declaredCraft = place.craft } = req.body;
    const { docNumber, ocrRaw } = await runOCR(req.file.path, req.file.originalname);
    const formatValid = Boolean(docNumber && docNumber.length >= 5);
    const { matched, expectedDistrict } = giDistrictCheck(declaredCraft, place.district);
    const t1 = tier1Score({ formatValid, giDistrictMatch: matched });

    place.credentials.push({ docType, docNumber, declaredCraft, ocrRaw, formatValid, giDistrictMatch: matched, tier1Score: t1 });
    const { score } = await computeTrustScore(place);
    place.trustScore = score;
    place.verified = score >= 50;
    await place.save();

    res.json({
      ocr: { docNumber, ocrRaw }, formatValid, giDistrictMatch: matched,
      expectedDistrict, placeDistrict: place.district, tier1Score: t1,
      trustScore: place.trustScore, verified: place.verified,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Verification failed. Try another document." });
  }
});

export default router;
