import { useEffect, useState } from "react";
import { getBookings, updateBooking } from "../api.js";

export default function Bookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const load = () => { setLoading(true); getBookings().then(setBookings).finally(() => setLoading(false)); };
  useEffect(() => { load(); }, []);
  const act = async (id, status) => { await updateBooking(id, status); load(); };

  return (
    <>
      <header className="hero">
        <div className="hero-inner">
          <div className="eyebrow">Request-to-book · host side</div>
          <h1 style={{ fontSize: "clamp(36px,5vw,60px)" }}>Visit requests.</h1>
          <p>Available hosts auto-confirm; everyone else runs on request-and-confirm, so no visit is shown as confirmed before the host or their coordinator says yes.</p>
        </div>
      </header>
      <div className="wrap" style={{ paddingBottom: 72 }}>
        {loading ? <p className="mono" style={{ color: "var(--ink-faint)", marginTop: 30 }}>Loading…</p>
          : bookings.length === 0 ? <p className="mono" style={{ color: "var(--ink-faint)", marginTop: 30 }}>No requests yet. Open a craft host and request a visit.</p>
          : (
          <table className="table">
            <thead><tr><th>Host</th><th>Tourist</th><th>Date</th><th>Party</th><th>Status</th><th style={{ textAlign: "right" }}>Action</th></tr></thead>
            <tbody>
              {bookings.map((b) => (
                <tr key={b._id}>
                  <td><strong>{b.place?.name || "—"}</strong><br /><span className="mono" style={{ fontSize: 11, color: "var(--ink-faint)" }}>{b.place?.craft}</span></td>
                  <td>{b.touristName}<br /><span className="mono" style={{ fontSize: 11, color: "var(--ink-faint)" }}>{b.touristPhone}</span></td>
                  <td className="mono" style={{ fontSize: 13 }}>{b.requestedDate}</td>
                  <td className="mono" style={{ fontSize: 13 }}>{b.partySize}</td>
                  <td><span className={`status ${b.status}`}>{b.status}</span></td>
                  <td style={{ textAlign: "right" }}>
                    {b.status === "requested" ? (
                      <span style={{ display: "inline-flex", gap: 8 }}>
                        <button className="btn btn-ghost" style={{ padding: "7px 12px" }} onClick={() => act(b._id, "confirmed")}>Confirm</button>
                        <button className="btn btn-ghost" style={{ padding: "7px 12px" }} onClick={() => act(b._id, "declined")}>Decline</button>
                      </span>
                    ) : <span className="mono" style={{ fontSize: 11, color: "var(--ink-faint)" }}>—</span>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </>
  );
}
