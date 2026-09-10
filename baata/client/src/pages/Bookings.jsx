import { useEffect, useMemo, useState } from "react";
import { getBookings, updateBooking } from "../api.js";

const FILTERS = [
  { key: "all", label: "All" },
  { key: "requested", label: "Pending" },
  { key: "confirmed", label: "Confirmed" },
  { key: "declined", label: "Declined" },
];

export default function Bookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  const load = () => { setLoading(true); getBookings().then(setBookings).finally(() => setLoading(false)); };
  useEffect(() => { load(); }, []);
  const act = async (id, status) => { await updateBooking(id, status); load(); };

  const counts = useMemo(() => ({
    all: bookings.length,
    requested: bookings.filter((b) => b.status === "requested").length,
    confirmed: bookings.filter((b) => b.status === "confirmed").length,
    declined: bookings.filter((b) => b.status === "declined").length,
  }), [bookings]);

  const visible = useMemo(
    () => (filter === "all" ? bookings : bookings.filter((b) => b.status === filter)),
    [bookings, filter]
  );

  return (
    <>
      <header className="hero">
        <div className="hero-inner">
          <div className="eyebrow">Request-to-book · host side</div>
          <h1 style={{ fontSize: "clamp(36px,5vw,60px)" }}>Visit requests.</h1>
          <p>Available hosts auto-confirm; everyone else runs on request-and-confirm, so no visit is shown as confirmed before the host or their coordinator says yes.</p>
          <div className="hero-stats">
            <div className="s"><div className="n">{counts.all}</div><div className="l">Total</div></div>
            <div className="s"><div className="n">{counts.requested}</div><div className="l">Pending</div></div>
            <div className="s"><div className="n">{counts.confirmed}</div><div className="l">Confirmed</div></div>
            <div className="s"><div className="n">{counts.declined}</div><div className="l">Declined</div></div>
          </div>
        </div>
      </header>

      <div className="wrap" style={{ paddingBottom: 72 }}>
        <div className="tabs">
          {FILTERS.map((f) => (
            <button key={f.key} className={`tab ${filter === f.key ? "active" : ""}`} onClick={() => setFilter(f.key)}>
              {f.label}{counts[f.key] ? <span className="ct">{counts[f.key]}</span> : null}
            </button>
          ))}
        </div>

        {loading ? (
          <p className="mono" style={{ color: "var(--ink-faint)", marginTop: 30 }}>Loading…</p>
        ) : visible.length === 0 ? (
          <div className="panel" style={{ marginTop: 8, textAlign: "center", padding: "48px 32px" }}>
            <div className="eyebrow" style={{ justifyContent: "center" }}>No requests</div>
            <p style={{ color: "var(--ink-soft)", fontSize: 16, marginTop: 10 }}>
              {filter === "all"
                ? "No visit requests yet. Open a craft host and request a visit to see one appear here."
                : `No ${filter} requests right now.`}
            </p>
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(330px, 1fr))", gap: 16, marginTop: 4 }}>
            {visible.map((b) => (
              <article key={b._id} className={`card ${b.place?.category || "crafts"}`} style={{ marginBottom: 0 }}>
                <div className="card-top">
                  <div>
                    <div className="mono" style={{ fontSize: 10.5, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--ink-faint)" }}>
                      {b.place?.craft || b.place?.category || "Visit"}
                    </div>
                    <h3 style={{ fontSize: 22, marginTop: 6 }}>{b.place?.name || "—"}</h3>
                  </div>
                  <span className={`status ${b.status}`}>{b.status === "requested" ? "pending" : b.status}</span>
                </div>

                <div style={{ marginTop: 14, display: "grid", gap: 10 }}>
                  <Row k="Tourist" v={b.touristName} sub={b.touristPhone} />
                  <Row k="Date" v={b.requestedDate} />
                  <Row k="Party" v={`${b.partySize} ${b.partySize > 1 ? "people" : "person"}`} />
                </div>

                {b.status === "requested" ? (
                  <div style={{ display: "flex", gap: 10, marginTop: 18 }}>
                    <button className="btn" style={{ flex: 1, padding: "9px 12px" }} onClick={() => act(b._id, "confirmed")}>Confirm</button>
                    <button className="btn btn-ghost" style={{ flex: 1, padding: "9px 12px" }} onClick={() => act(b._id, "declined")}>Decline</button>
                  </div>
                ) : (
                  <div className="mono" style={{ fontSize: 11, color: "var(--ink-faint)", marginTop: 18, letterSpacing: "0.06em" }}>
                    {b.status === "confirmed" ? "◆ Visit confirmed" : "◇ Request declined"}
                  </div>
                )}
              </article>
            ))}
          </div>
        )}
      </div>
    </>
  );
}

function Row({ k, v, sub }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 12, borderBottom: "1px solid var(--line-soft)", paddingBottom: 8 }}>
      <span className="mono" style={{ fontSize: 11, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--ink-faint)" }}>{k}</span>
      <span style={{ textAlign: "right", fontSize: 15 }}>
        {v}{sub && <><br /><span className="mono" style={{ fontSize: 11, color: "var(--ink-faint)" }}>{sub}</span></>}
      </span>
    </div>
  );
}