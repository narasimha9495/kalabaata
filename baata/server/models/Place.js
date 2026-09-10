import mongoose from "mongoose";

const pointSchema = new mongoose.Schema(
  { type: { type: String, enum: ["Point"], default: "Point" },
    coordinates: { type: [Number], required: true } }, // [lng, lat]
  { _id: false }
);

// Only bookable places (crafts vertical) carry credentials.
const credentialSchema = new mongoose.Schema(
  { docType: { type: String, enum: ["pehchan", "gi", "udyam"] },
    docNumber: String, declaredCraft: String, ocrRaw: String,
    formatValid: { type: Boolean, default: false },
    giDistrictMatch: { type: Boolean, default: false },
    tier1Score: { type: Number, default: 0 },
    uploadedAt: { type: Date, default: Date.now } },
  { _id: true }
);

const placeSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    category: {
      type: String,
      enum: ["heritage", "temple", "nature", "crafts", "food"],
      required: true,
    },
    district: { type: String, required: true },
    location: { type: pointSchema, required: true },
    tagline: String,          // one-line hook
    description: String,      // longer blurb
    highlight: String,        // badge, e.g. "UNESCO World Heritage Site"
    bestTime: String,         // e.g. "Oct – Feb"

    // Discovery-only sights set bookable:false and stop here.
    bookable: { type: Boolean, default: false },

    // Bookable providers (the crafts vertical) add these:
    craft: String,
    phone: String,
    bio: String,
    credentials: [credentialSchema],
    trustScore: { type: Number, default: 0 },
    verified: { type: Boolean, default: false },
    availabilityState: {
      type: String,
      enum: ["available", "request_confirm", "unavailable"],
      default: "request_confirm",
    },
  },
  { timestamps: true }
);

placeSchema.index({ location: "2dsphere" });

export default mongoose.model("Place", placeSchema);
