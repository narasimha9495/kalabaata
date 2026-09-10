import { Link } from "react-router-dom";
import CategoryChip from "./CategoryChip.jsx";
import AvailabilityPill from "./AvailabilityPill.jsx";

export default function PlaceCard({ place }) {
  return (
    <article className={`card ${place.category}`}>
      <div className="card-top">
        <CategoryChip category={place.category} />
        {place.bookable && (
          <div style={{ textAlign: "right" }}>
            <div className="eyebrow">Trust</div>
            <div style={{ fontFamily: "var(--serif)", fontWeight: 600, fontSize: 28, lineHeight: 1 }}>{place.trustScore}</div>
          </div>
        )}
      </div>
      <h3>{place.name}</h3>
      <div className="place">{place.district}</div>
      {place.tagline && <p className="tagline">{place.tagline}</p>}
      {place.highlight && <span className="hl">{place.highlight}</span>}
      <div className="card-foot">
        {place.bookable ? <AvailabilityPill state={place.availabilityState} />
          : <span className="mono" style={{ fontSize: 11, color: "var(--ink-faint)", letterSpacing: "0.06em" }}>
              {place.bestTime ? `Best: ${place.bestTime}` : "Discovery"}</span>}
        <Link to={`/place/${place._id}`} className="btn btn-ghost">{place.bookable ? "View & book" : "Explore"}</Link>
      </div>
    </article>
  );
}
