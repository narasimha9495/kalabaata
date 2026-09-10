import { useEffect, useState } from "react";
import { getNearby, getCategories } from "../api.js";
import MapView from "../components/MapView.jsx";
import PlaceCard from "../components/PlaceCard.jsx";
import { CATEGORIES } from "../categories.js";

const HYD = { lat: 17.385, lng: 78.4867 };

export default function Discover() {
  const [places, setPlaces] = useState([]);
  const [counts, setCounts] = useState({});
  const [cat, setCat] = useState("all");
  const [maxKm, setMaxKm] = useState(400);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getCategories().then((rows) =>
      setCounts(Object.fromEntries(rows.map((r) => [r.category, r.count])))
    );
  }, []);

  useEffect(() => {
    setLoading(true);
    getNearby({ lat: HYD.lat, lng: HYD.lng, maxKm, category: cat })
      .then(setPlaces).finally(() => setLoading(false));
  }, [cat, maxKm]);

  const total = Object.values(counts).reduce((a, b) => a + b, 0);

  return (
    <>
      <header className="hero">
        <div className="hero-inner">
          <div className="eyebrow">Proximity discovery · verified access</div>
          <h1>Telangana, the <em>trail</em> you didn't know was there.</h1>
          <p>
            A tourist at Charminar rarely learns that a UNESCO temple, the state's highest
            waterfall, or a GI-craft village sits a short drive away. Baata surfaces it all by
            proximity — heritage, temples, nature, food, and bookable craft workshops.
          </p>
          <div className="hero-stats">
            <div className="s"><div className="n">{total || "—"}</div><div className="l">Places mapped</div></div>
            <div className="s"><div className="n">17</div><div className="l">GI crafts</div></div>
            <div className="s"><div className="n">1</div><div className="l">UNESCO site</div></div>
          </div>
        </div>
      </header>

      <div className="wrap">
        <div className="tabs">
          {CATEGORIES.map((c) => (
            <button key={c.key} className={`tab ${cat === c.key ? "active" : ""}`} onClick={() => setCat(c.key)}>
              {c.label}{c.key !== "all" && counts[c.key] ? <span className="ct">{counts[c.key]}</span> : null}
            </button>
          ))}
        </div>

        <div className="discover-grid">
          <section>
            <div className="results-meta" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span>{loading ? "searching…" : `${places.length} places · nearest first from Hyderabad`}</span>
              <span className="filters">
                <label>Within</label>
                <select value={maxKm} onChange={(e) => setMaxKm(Number(e.target.value))}>
                  <option value={150}>150 km</option><option value={250}>250 km</option>
                  <option value={400}>400 km</option><option value={600}>600 km</option>
                </select>
              </span>
            </div>
            {places.map((p) => <PlaceCard key={p._id} place={p} />)}
            {!loading && places.length === 0 && (
              <p className="mono" style={{ color: "var(--ink-faint)" }}>No places match. Widen the radius or pick another category.</p>
            )}
          </section>
          <aside className="map-panel"><MapView places={places} /></aside>
        </div>
      </div>
    </>
  );
}
