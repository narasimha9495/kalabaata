export default function TrustSeal({ score, breakdown, verified }) {
  const b = breakdown || { tier1: 0, tier2: 0, tier3: 0 };
  const bands = [
    { key: "t1", label: "Tier 1 · Document", val: b.tier1 },
    { key: "t2", label: "Tier 2 · Institution", val: b.tier2 },
    { key: "t3", label: "Tier 3 · Community", val: b.tier3 },
  ];
  return (
    <div className="seal">
      <div className="seal-head">
        <div className="eyebrow">Authenticity</div>
        <div className={verified ? "verified" : "unverified"}>{verified ? "◆ Verified" : "◇ Baseline"}</div>
      </div>
      <div style={{ marginTop: 10 }}>
        <span className="seal-score">{score}</span><span className="seal-score"><small> / 100 trust</small></span>
      </div>
      <div className="tri">
        {bands.map((band) => (
          <div key={band.key} className={`tri-band ${band.key}`}>
            <div className="t">{band.label}</div>
            <div className="v">{Math.round(band.val)}</div>
            <div className="meter"><i style={{ width: `${Math.min(100, band.val)}%` }} /></div>
          </div>
        ))}
      </div>
    </div>
  );
}
