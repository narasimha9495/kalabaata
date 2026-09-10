export default function About() {
  return (
    <div className="wrap">
      <div className="prose">
        <div className="eyebrow">The idea</div>
        <h2 style={{ marginTop: 12 }}>A discovery layer for all of Telangana.</h2>
        <p className="lead">
          Telangana holds a UNESCO temple, the state's highest waterfall, Kakatiya forts, riverside
          pilgrimages, and seventeen GI-tagged crafts — yet a visitor at Charminar has no single
          place to see what's around them. This isn't a search problem. It's a
          "you don't know what you don't know" problem.
        </p>

        <h2>One map, five ways in</h2>
        <p>
          Baata ranks everything nearby by proximity and sorts it into heritage, temples, nature,
          food, and crafts. Golconda and Ramappa sit beside Kuntala Falls, Bhadrachalam, the Old City
          biryani trail, and the weaving villages — so discovery feels like turning over a map you
          didn't know you had.
        </p>

        <h2>Broad discovery, one deep vertical</h2>
        <p>
          Sights are discovery listings — location, best season, what they're known for. Crafts go
          all the way down: a three-tier trust score, credential verification, and real visit
          booking. A monument doesn't upload a Pehchan card, but a weaver can — so the trust-and-book
          machinery lives exactly where it matters and the rest of the map stays fast and open.
        </p>

        <h2>Trust in three tiers</h2>
        <p>
          Tier 1 is a document-first check — OCR on a Pehchan, GI, or Udyam document with a
          GI-to-district cross-check that works on day one. Tier 2 routes corroboration through
          institutions already embedded in the clusters. Tier 3 accumulates tourist reviews. No
          single forged document or bribed verifier earns a badge alone.
        </p>

        <h2>Availability without a dashboard</h2>
        <p>
          Craft hosts never log into anything. A WhatsApp prompt — "reply YES to welcome visitors
          this week" — flips their live badge. Where that isn't active, a cluster coordinator manages
          it by proxy, and the fallback is request-and-confirm within 24 hours.
        </p>
      </div>
    </div>
  );
}
