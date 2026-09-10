import mongoose from "mongoose";
const auditLogSchema = new mongoose.Schema(
  { verifier: { type: mongoose.Schema.Types.ObjectId, ref: "Verifier" },
    place: { type: mongoose.Schema.Types.ObjectId, ref: "Place", required: true },
    action: { type: String, required: true }, notes: String },
  { timestamps: true }
);
export default mongoose.model("AuditLog", auditLogSchema);
