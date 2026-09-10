import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const uploadDir = path.join(__dirname, "..", "uploads");
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => cb(null, `cred-${Date.now()}${path.extname(file.originalname)}`),
});
export const upload = multer({
  storage, limits: { fileSize: 8 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const ok = /jpeg|jpg|png|pdf/.test(file.mimetype);
    cb(ok ? null : new Error("Only JPG, PNG, or PDF accepted"), ok);
  },
});
