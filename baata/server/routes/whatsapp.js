import { Router } from "express";
import Place from "../models/Place.js";
import AvailabilityLog from "../models/AvailabilityLog.js";

const router = Router();
function interpret(body = "") {
  const t = body.trim().toLowerCase();
  if (["yes", "y", "haan", "avunu", "ok"].includes(t)) return "available";
  if (["no", "n", "kaadu", "ledu"].includes(t)) return "unavailable";
  return null;
}
async function flip(place, state, source, message) {
  place.availabilityState = state; await place.save();
  await AvailabilityLog.create({ place: place._id, source, state, message });
}

router.post("/webhook", async (req, res) => {
  const from = (req.body.From || "").replace("whatsapp:", "").trim();
  const state = interpret(req.body.Body || "");
  const place = await Place.findOne({ phone: from, bookable: true });
  if (place && state) await flip(place, state, "whatsapp", req.body.Body);
  res.set("Content-Type", "text/xml");
  res.send(`<Response><Message>${place && state ? `Thanks — your status is now "${state}".` : "Reply YES to welcome visitors, or NO to pause."}</Message></Response>`);
});

router.post("/simulate", async (req, res) => {
  const { placeId, reply } = req.body;
  const place = await Place.findById(placeId);
  if (!place || !place.bookable) return res.status(404).json({ error: "Bookable place not found" });
  const state = interpret(reply);
  if (!state) return res.status(400).json({ error: 'Send "YES" or "NO"' });
  await flip(place, state, "whatsapp", `Simulated reply: ${reply}`);
  res.json({ placeId, availabilityState: state });
});

export default router;
