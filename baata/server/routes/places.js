import { Router } from "express";
import Place from "../models/Place.js";
import Review from "../models/Review.js";
import { computeTrustScore } from "../services/trust.js";

const router = Router();

// GET /api/places/categories — counts per category (for the filter tabs)
router.get("/categories", async (req, res) => {
  const agg = await Place.aggregate([
    { $group: { _id: "$category", count: { $sum: 1 } } },
    { $sort: { _id: 1 } },
  ]);
  res.json(agg.map((a) => ({ category: a._id, count: a.count })));
});

// GET /api/places/nearby?lat=&lng=&maxKm=&category=
router.get("/nearby", async (req, res) => {
  const { lat, lng, maxKm = 400, category } = req.query;
  const query = {};
  if (category && category !== "all") query.category = category;
  if (lat && lng) {
    query.location = {
      $near: {
        $geometry: { type: "Point", coordinates: [parseFloat(lng), parseFloat(lat)] },
        $maxDistance: parseFloat(maxKm) * 1000,
      },
    };
  }
  const places = await Place.find(query).limit(80);
  res.json(places);
});

// GET /api/places/:id — detail (+ trust & reviews for bookable places)
router.get("/:id", async (req, res) => {
  const place = await Place.findById(req.params.id);
  if (!place) return res.status(404).json({ error: "Place not found" });
  if (!place.bookable) return res.json({ place, reviews: [], trust: null });
  const reviews = await Review.find({ place: place._id }).sort({ createdAt: -1 });
  const trust = await computeTrustScore(place);
  res.json({ place, reviews, trust });
});

export default router;
