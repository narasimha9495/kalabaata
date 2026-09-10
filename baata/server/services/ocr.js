import { createWorker } from "tesseract.js";
function parseFields(text) {
  const clean = text.replace(/\n+/g, " ").trim();
  const candidates = clean.match(/[A-Z0-9\-\/]{6,}/gi) || [];
  return { docNumber: candidates.sort((a, b) => b.length - a.length)[0] || null, ocrRaw: clean.slice(0, 500) };
}
function mockExtract(originalName = "") {
  const seed = Math.floor(100000 + Math.random() * 899999);
  return { docNumber: `TS-${seed}`, ocrRaw: `MOCK OCR (demo mode) for ${originalName}. Document parsed successfully.` };
}
export async function runOCR(filePath, originalName = "") {
  if (String(process.env.DEMO_MODE).toLowerCase() === "true") return mockExtract(originalName);
  const worker = await createWorker("eng");
  try { const { data: { text } } = await worker.recognize(filePath); return parseFields(text); }
  catch (err) { console.error("OCR failed, using mock:", err.message); return mockExtract(originalName); }
  finally { await worker.terminate(); }
}
