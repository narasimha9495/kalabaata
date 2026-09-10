import mongoose from "mongoose";
const verifierSchema = new mongoose.Schema(
  { name: { type: String, required: true },
    type: { type: String, enum: ["shg", "coop", "csc", "cluster_officer"], required: true },
    phone: String, rating: { type: Number, default: 4.5 },
    place: { type: mongoose.Schema.Types.ObjectId, ref: "Place" } },
  { timestamps: true }
);
export default mongoose.model("Verifier", verifierSchema);
