import Review from "../models/Review.js";
import AuditLog from "../models/AuditLog.js";
const WEIGHTS = { tier1: 0.45, tier2: 0.30, tier3: 0.25 };
export async function computeTrustScore(place) {
  const tier1 = (place.credentials || []).reduce((m, c) => Math.max(m, c.tier1Score || 0), 0);
  const auditCount = await AuditLog.countDocuments({ place: place._id });
  const tier2 = Math.min(100, auditCount * 50);
  const reviews = await Review.find({ place: place._id }).select("rating");
  const tier3 = reviews.length === 0 ? 0 : (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length) * 20;
  const score = Math.round(tier1 * WEIGHTS.tier1 + tier2 * WEIGHTS.tier2 + tier3 * WEIGHTS.tier3);
  return { score, breakdown: { tier1, tier2, tier3 } };
}
export function tier1Score({ formatValid, giDistrictMatch }) {
  let s = 0; if (formatValid) s += 50; if (giDistrictMatch) s += 50; return s;
}
