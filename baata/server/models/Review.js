import mongoose from "mongoose";
const reviewSchema = new mongoose.Schema(
  { place: { type: mongoose.Schema.Types.ObjectId, ref: "Place", required: true },
    booking: { type: mongoose.Schema.Types.ObjectId, ref: "Booking" },
    rating: { type: Number, min: 1, max: 5, required: true },
    photoUrl: String, comment: String },
  { timestamps: true }
);
export default mongoose.model("Review", reviewSchema);
