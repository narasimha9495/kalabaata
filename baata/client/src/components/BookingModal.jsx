import { useState } from "react";
import { createBooking } from "../api.js";
export default function BookingModal({ place, onClose, onDone }) {
  const [form, setForm] = useState({ touristName: "", touristPhone: "", requestedDate: "", partySize: 1, note: "" });
  const [busy, setBusy] = useState(false);
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });
  const willConfirm = place.availabilityState === "available";
  const submit = async () => {
    if (!form.touristName || !form.touristPhone || !form.requestedDate) return;
    setBusy(true);
    try { const b = await createBooking({ placeId: place._id, ...form }); onDone(b); }
    catch { setBusy(false); }
  };
  return (
    <div className="modal-back" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="eyebrow">Request a visit</div>
        <h3>{place.name}</h3>
        <p style={{ color: "var(--ink-soft)", fontSize: 15, marginTop: 4 }}>
          {willConfirm ? "This host is available — your visit confirms instantly." : "Request-and-confirm: confirmed within 24 hours."}
        </p>
        {["touristName:Your name", "touristPhone:Phone", "requestedDate:Preferred date", "partySize:Party size"].map((f) => {
          const [k, label] = f.split(":");
          return (<div className="field" key={k}><label>{label}</label>
            <input type="text" value={form[k]} onChange={set(k)} placeholder={k === "requestedDate" ? "e.g. 24 Aug 2026" : ""} /></div>);
        })}
        <div style={{ display: "flex", gap: 12, marginTop: 8 }}>
          <button className="btn" onClick={submit} disabled={busy}>{busy ? "Sending…" : willConfirm ? "Confirm visit" : "Send request"}</button>
          <button className="btn btn-ghost" onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
}
