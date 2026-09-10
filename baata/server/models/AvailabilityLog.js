import mongoose from "mongoose";
const availabilityLogSchema = new mongoose.Schema(
  { place: { type: mongoose.Schema.Types.ObjectId, ref: "Place", required: true },
    source: { type: String, enum: ["whatsapp", "proxy", "default"], required: true },
    state: { type: String, enum: ["available", "request_confirm", "unavailable"], required: true },
    message: String },
  { timestamps: true }
);
export default mongoose.model("AvailabilityLog", availabilityLogSchema);
