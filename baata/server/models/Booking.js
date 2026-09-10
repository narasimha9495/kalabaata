import mongoose from "mongoose";
const bookingSchema = new mongoose.Schema(
  { place: { type: mongoose.Schema.Types.ObjectId, ref: "Place", required: true },
    touristName: { type: String, required: true },
    touristPhone: { type: String, required: true },
    requestedDate: { type: String, required: true },
    partySize: { type: Number, default: 1 }, note: String,
    status: { type: String, enum: ["requested", "confirmed", "declined"], default: "requested" } },
  { timestamps: true }
);
export default mongoose.model("Booking", bookingSchema);
