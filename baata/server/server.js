import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import { connectDB } from "./config/db.js";
import placesRoute from "./routes/places.js";
import verifyRoute from "./routes/verify.js";
import bookingsRoute from "./routes/bookings.js";
import whatsappRoute from "./routes/whatsapp.js";

dotenv.config();
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
app.use(cors({ origin: process.env.CLIENT_ORIGIN || "*" }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.get("/api/health", (req, res) => res.json({ ok: true, service: "Baata" }));
app.use("/api/places", placesRoute);
app.use("/api/verify", verifyRoute);
app.use("/api/bookings", bookingsRoute);
app.use("/api/whatsapp", whatsappRoute);

const PORT = process.env.PORT || 5000;
connectDB()
  .then(() => app.listen(PORT, () => console.log(`Baata API running on :${PORT}`)))
  .catch((err) => { console.error("Failed to start:", err.message); process.exit(1); });
