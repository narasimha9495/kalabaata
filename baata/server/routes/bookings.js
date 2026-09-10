import { Router } from "express";
import Booking from "../models/Booking.js";
import Place from "../models/Place.js";

const router = Router();

router.post("/", async (req, res) => {
  const { placeId, touristName, touristPhone, requestedDate, partySize, note } = req.body;
  const place = await Place.findById(placeId);
  if (!place) return res.status(404).json({ error: "Place not found" });
  if (!place.bookable) return res.status(400).json({ error: "This place is discovery-only and can't be booked" });
  const booking = await Booking.create({
    place: placeId, touristName, touristPhone, requestedDate, partySize, note,
    status: place.availabilityState === "available" ? "confirmed" : "requested",
  });
  res.status(201).json(booking);
});

router.get("/", async (req, res) => {
  const filter = req.query.placeId ? { place: req.query.placeId } : {};
  const bookings = await Booking.find(filter).populate("place", "name craft district category").sort({ createdAt: -1 });
  res.json(bookings);
});

router.patch("/:id", async (req, res) => {
  const booking = await Booking.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true });
  res.json(booking);
});

export default router;
