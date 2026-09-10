const LABEL = { available: "Available this week", request_confirm: "Request & confirm", unavailable: "Not hosting now" };
export default function AvailabilityPill({ state }) {
  return <span className={`pill ${state}`}>{LABEL[state] || state}</span>;
}
