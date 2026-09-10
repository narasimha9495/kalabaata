import { useEffect, useState } from "react";
import { getNearby, verifyPlace } from "../api.js";
const HYD = { lat: 17.385, lng: 78.4867 };

export default function Verify() {
  const [providers, setProviders] = useState([]);
  const [placeId, setPlaceId] = useState("");
  const [docType, setDocType] = useState("pehchan");
  const [declaredCraft, setDeclaredCraft] = useState("");
  const [file, setFile] = useState(null);
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    getNearby({ lat: HYD.lat, lng: HYD.lng, maxKm: 600, category: "crafts" }).then((list) => {
      setProviders(list);
      if (list[0]) { setPlaceId(list[0]._id); setDeclaredCraft(list[0].craft || ""); }
    });
  }, []);

  const onPick = (e) => {
    const id = e.target.value; setPlaceId(id);
    const p = providers.find((x) => x._id === id); if (p) setDeclaredCraft(p.craft || "");
  };

  const submit = async () => {
    setError(""); setResult(null);
    if (!placeId || !file) { setError("Pick a provider and choose a document."); return; }
    setBusy(true);
    try {
      const fd = new FormData();
      fd.append("document", file); fd.append("docType", docType); fd.append("declaredCraft", declaredCraft);
      setResult(await verifyPlace(placeId, fd));
    } catch (err) { setError(err?.response?.data?.error || "Verification failed."); }
    finally { setBusy(false); }
  };

  return (
    <>
      <header className="hero">
        <div className="hero-inner">
          <div className="eyebrow">Tier 1 · document-first check</div>
          <h1 style={{ fontSize: "clamp(36px,5vw,60px)" }}>Verify a craft host.</h1>
          <p>Upload a Pehchan card, GI certificate, or Udyam registration. OCR extracts the number, the format is validated, and the GI product is cross-checked against the host's district — live on day one.</p>
        </div>
      </header>
      <div className="wrap">
        <div className="discover-grid" style={{ paddingTop: 34 }}>
          <div className="panel">
            <div className="field"><label>Craft host</label>
              <select value={placeId} onChange={onPick}>{providers.map((p) => <option key={p._id} value={p._id}>{p.name} — {p.district}</option>)}</select>
            </div>
            <div className="field"><label>Document type</label>
              <select value={docType} onChange={(e) => setDocType(e.target.value)}>
                <option value="pehchan">Pehchan (Artisan ID) card</option>
                <option value="gi">GI certificate</option>
                <option value="udyam">Udyam registration</option>
              </select>
            </div>
            <div className="field"><label>Declared craft</label><input type="text" value={declaredCraft} onChange={(e) => setDeclaredCraft(e.target.value)} /></div>
            <div className="field"><label>Document (JPG / PNG / PDF)</label><input type="file" accept=".jpg,.jpeg,.png,.pdf" onChange={(e) => setFile(e.target.files[0])} /></div>
            <button className="btn" onClick={submit} disabled={busy}>{busy ? "Running OCR…" : "Run verification"}</button>
            {error && <p className="bad" style={{ marginTop: 14 }}>{error}</p>}
          </div>
          <div className="panel">
            <div className="eyebrow">Result</div>
            {!result ? (
              <p className="mono" style={{ color: "var(--ink-faint)", fontSize: 13, marginTop: 12 }}>Submit a document to see the extracted number, the GI-district cross-check, and the updated trust score.</p>
            ) : (
              <div style={{ marginTop: 12 }}>
                <div className="result-row"><span className="k">Doc number</span><span className="mono">{result.ocr.docNumber || "—"}</span></div>
                <div className="result-row"><span className="k">Format valid</span><span className={result.formatValid ? "ok" : "bad"}>{result.formatValid ? "✓ valid" : "✗ invalid"}</span></div>
                <div className="result-row"><span className="k">Expected district</span><span className="mono">{result.expectedDistrict || "unknown craft"}</span></div>
                <div className="result-row"><span className="k">Host district</span><span className="mono">{result.placeDistrict}</span></div>
                <div className="result-row"><span className="k">GI-district match</span><span className={result.giDistrictMatch ? "ok" : "bad"}>{result.giDistrictMatch ? "✓ match" : "✗ mismatch"}</span></div>
                <div className="result-row"><span className="k">Tier-1 score</span><span className="mono">{result.tier1Score} / 100</span></div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginTop: 18 }}>
                  <span className="eyebrow">New trust score</span><span style={{ fontFamily: "var(--serif)", fontWeight: 600, fontSize: 40 }}>{result.trustScore}</span>
                </div>
                <div className={result.verified ? "verified" : "unverified"} style={{ textAlign: "right" }}>{result.verified ? "◆ Verified host" : "◇ Baseline"}</div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
