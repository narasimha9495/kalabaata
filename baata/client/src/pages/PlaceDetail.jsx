import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getPlace, simulateWhatsApp } from "../api.js";
import { MapContainer, TileLayer, CircleMarker } from "react-leaflet";
import { CAT_COLOR } from "../categories.js";
import CategoryChip from "../components/CategoryChip.jsx";
import AvailabilityPill from "../components/AvailabilityPill.jsx";
import TrustSeal from "../components/TrustSeal.jsx";
import BookingModal from "../components/BookingModal.jsx";

export default function PlaceDetail() {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [toast, setToast] = useState("");
  const load = () => getPlace(id).then(setData);
  useEffect(() => { load(); }, [id]);
  const flash = (m) => { setToast(m); setTimeout(() => setToast(""), 2600); };
  const simulate = async (reply) => { await simulateWhatsApp(id, reply); await load(); flash(`WhatsApp "${reply}" received — availability updated`); };

  if (!data) return <div className="wrap" style={{ padding: 60 }}><span className="mono">Loading…</span></div>;
  const { place, reviews, trust } = data;
  const [lng, lat] = place.location.coordinates;

  return (
    <div className="wrap detail">
      <div className="detail-grid">
        <div>
          <div style={{ display: "flex", gap: 12, alignItems: "center", marginTop: 24 }}>
            <CategoryChip category={place.category} />
            {place.highlight && <span className="mono" style={{ fontSize: 11, color: "var(--gold-deep)", letterSpacing: "0.08em", textTransform: "uppercase" }}>{place.highlight}</span>}
          </div>
          <h1>{place.name}</h1>
          <div className="meta-row">
            <span className="mono" style={{ fontSize: 13, color: "var(--ink-soft)" }}>{place.district} district</span>
            {place.bookable && <AvailabilityPill state={place.availabilityState} />}
          </div>
          <p className="lede">{place.description || place.tagline}</p>

          {place.bookable && place.credentials?.length > 0 && (
            <>
              <div className="section-label">Credentials on file</div>
              {place.credentials.map((c, i) => (
                <div className="cred" key={i}>
                  <span><span className="k">{c.docType}</span> &nbsp; {c.docNumber || "—"}</span>
                  <span className="mono" style={{ fontSize: 12 }}>
                    <span className={c.formatValid ? "ok" : "bad"}>format {c.formatValid ? "✓" : "✗"}</span>&nbsp;&nbsp;
                    <span className={c.giDistrictMatch ? "ok" : "bad"}>GI-district {c.giDistrictMatch ? "✓" : "✗"}</span>
                  </span>
                </div>
              ))}
            </>
          )}

          {place.bookable && (
            <>
              <div className="section-label">Tourist reviews</div>
              {reviews?.length ? reviews.map((r) => (
                <div className="review" key={r._id}>
                  <div className="stars">{"★".repeat(r.rating)}{"☆".repeat(5 - r.rating)}</div>
                  <div style={{ fontSize: 15, color: "var(--ink-soft)" }}>{r.comment}</div>
                </div>
              )) : <p className="mono" style={{ color: "var(--ink-faint)", fontSize: 13 }}>No reviews yet.</p>}
            </>
          )}

          <div className="section-label">On the map</div>
          <div className="mini-map">
            <MapContainer center={[lat, lng]} zoom={11} scrollWheelZoom={false} style={{ height: "100%", width: "100%" }}>
              <TileLayer attribution='&copy; OpenStreetMap contributors' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
              <CircleMarker center={[lat, lng]} radius={10} pathOptions={{ color: "#1a1511", weight: 1.5, fillColor: CAT_COLOR[place.category], fillOpacity: 0.92 }} />
            </MapContainer>
          </div>
        </div>

        <aside>
          {place.bookable ? (
            <>
              <TrustSeal score={trust.score} breakdown={trust.breakdown} verified={place.verified} />
              <button className="btn" style={{ width: "100%", marginTop: 18 }} onClick={() => setShowModal(true)}>Request a visit</button>
              <div className="section-label" style={{ marginTop: 34 }}>Availability demo</div>
              <p style={{ fontSize: 14, color: "var(--ink-soft)" }}>Hosts never touch a dashboard — they reply to a WhatsApp prompt and the live badge flips. Simulate a reply:</p>
              <div style={{ display: "flex", gap: 10 }}>
                <button className="btn btn-ghost" onClick={() => simulate("YES")}>Reply "YES"</button>
                <button className="btn btn-ghost" onClick={() => simulate("NO")}>Reply "NO"</button>
              </div>
            </>
          ) : (
            <div className="panel">
              <div className="eyebrow">Plan your visit</div>
              <div className="factline"><span className="k">Category</span><span>{place.category}</span></div>
              <div className="factline"><span className="k">District</span><span>{place.district}</span></div>
              {place.bestTime && <div className="factline"><span className="k">Best time</span><span>{place.bestTime}</span></div>}
              {place.highlight && <div className="factline"><span className="k">Known for</span><span style={{ textAlign: "right", maxWidth: "60%" }}>{place.highlight}</span></div>}
              <p style={{ fontSize: 14, color: "var(--ink-faint)", marginTop: 16 }}>Discovery listing — a sight to visit directly. Bookable workshops are shown with a trust score and a request-to-book flow.</p>
            </div>
          )}
        </aside>
      </div>

      {showModal && <BookingModal place={place} onClose={() => setShowModal(false)}
        onDone={(b) => { setShowModal(false); flash(b.status === "confirmed" ? "Visit confirmed" : "Request sent — confirmation within 24h"); }} />}
      {toast && <div className="toast">{toast}</div>}
    </div>
  );
}
