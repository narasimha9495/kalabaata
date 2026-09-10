import dotenv from "dotenv";
import mongoose from "mongoose";
import { connectDB } from "./config/db.js";
import Place from "./models/Place.js";
import Verifier from "./models/Verifier.js";
import AuditLog from "./models/AuditLog.js";
import Review from "./models/Review.js";
import { computeTrustScore } from "./services/trust.js";
dotenv.config();

// Coordinates are approximate [lng, lat] for the demo map.
function pt(lng, lat) { return { type: "Point", coordinates: [lng, lat] }; }

// --- Discovery-only sights (bookable:false) -------------------------------
const sights = [
  // ---------------- Heritage ----------------
  { name: "Charminar", category: "heritage", district: "Hyderabad", location: pt(78.4747, 17.3616),
    tagline: "The 1591 monument at the heart of the old city.", highlight: "Icon of Hyderabad",
    bestTime: "Oct – Feb", description: "The four-minaret gateway that anchors the old city, ringed by the Laad Bazaar bangle lanes and Mecca Masjid." },
  { name: "Golconda Fort", category: "heritage", district: "Hyderabad", location: pt(78.4011, 17.3833),
    tagline: "A hilltop citadel famed for its acoustics and diamonds.", highlight: "Qutb Shahi capital",
    bestTime: "Oct – Feb", description: "A granite fortress whose clap-echo signalling once carried alarms to the summit; the evening sound-and-light show narrates its history." },
  { name: "Qutb Shahi Tombs", category: "heritage", district: "Hyderabad", location: pt(78.3969, 17.3949),
    tagline: "Domed necropolis of the Golconda sultans.", highlight: "Heritage park",
    bestTime: "Oct – Feb", description: "A restored garden-necropolis of grand Qutb Shahi mausoleums, one of the largest such clusters in the world." },
  { name: "Chowmahalla Palace", category: "heritage", district: "Hyderabad", location: pt(78.4712, 17.3578),
    tagline: "The Nizams' ceremonial palace and courtyards.", highlight: "Nizam heritage",
    bestTime: "Oct – Feb", description: "Seat of the Asaf Jahi Nizams, known for its Khilwat courtyard, vintage car collection and chandeliered durbar hall." },
  { name: "Salar Jung Museum", category: "heritage", district: "Hyderabad", location: pt(78.4803, 17.3713),
    tagline: "One of India's largest one-man art collections.", highlight: "National museum",
    bestTime: "Year-round", description: "A vast museum of sculpture, textiles, arms and clocks amassed by the Salar Jung family — the Veiled Rebecca and musical clock are crowd favourites." },
  { name: "Mecca Masjid", category: "heritage", district: "Hyderabad", location: pt(78.4736, 17.3604),
    tagline: "One of India's oldest and largest mosques.", highlight: "Historic mosque",
    bestTime: "Year-round", description: "A grand 17th-century mosque beside Charminar, built partly with bricks brought from Mecca, with room for thousands of worshippers." },
  { name: "Ramoji Film City", category: "heritage", district: "Hyderabad", location: pt(78.6820, 17.2543),
    tagline: "The world's largest film-studio complex.", highlight: "Guinness World Record",
    bestTime: "Oct – Feb", description: "A sprawling film city on the city's outskirts with themed sets, gardens, shows and rides — certified by Guinness as the world's largest." },
  { name: "Warangal Fort", category: "heritage", district: "Warangal", location: pt(79.5650, 17.9509),
    tagline: "The Kakatiya capital's carved stone gateways.", highlight: "Kakatiya architecture",
    bestTime: "Oct – Feb", description: "Ruins of the 13th-century Kakatiya capital, celebrated for its ornately carved kirti-toranas (victory gateways)." },
  { name: "Ramappa Temple", category: "heritage", district: "Mulugu", location: pt(79.9447, 18.2612),
    tagline: "800-year-old Kakatiya temple built on floating bricks.", highlight: "UNESCO World Heritage Site",
    bestTime: "Oct – Feb", description: "Telangana's only UNESCO World Heritage Site (2021) at Palampet — a Kakatiya masterpiece of sculpted basalt and famously light 'floating' bricks." },
  { name: "Bhongir Fort", category: "heritage", district: "Yadadri Bhuvanagiri", location: pt(78.8853, 17.5145),
    tagline: "A single-rock hill fort with panoramic climbs.", highlight: "Monolithic hill fort",
    bestTime: "Oct – Feb", description: "An egg-shaped monolithic fort rising sharply from the plains, popular for its short climb and rock-climbing routes." },
  { name: "Medak Cathedral", category: "heritage", district: "Medak", location: pt(78.2662, 18.0453),
    tagline: "One of Asia's largest churches, in Gothic stone.", highlight: "Gothic landmark",
    bestTime: "Oct – Feb", description: "A soaring early-20th-century Gothic cathedral with stained-glass windows depicting the life of Christ." },

  // ---------------- Temples ----------------
  { name: "Yadagirigutta (Yadadri)", category: "temple", district: "Yadadri Bhuvanagiri", location: pt(78.9503, 17.5806),
    tagline: "Hilltop Narasimha shrine, grandly rebuilt in stone.", highlight: "Major pilgrimage",
    bestTime: "Year-round", description: "A hill temple to Lakshmi Narasimha, recently reconstructed entirely in black granite as a vast temple complex." },
  { name: "Bhadrachalam Temple", category: "temple", district: "Bhadradri Kothagudem", location: pt(80.8877, 17.6688),
    tagline: "Sita Ramachandra Swamy temple on the Godavari.", highlight: "Rama pilgrimage",
    bestTime: "Year-round (Sri Rama Navami)", description: "One of the country's most revered Rama temples, set on the banks of the Godavari and thronged during Sri Rama Navami." },
  { name: "Sammakka Saralamma Temple (Medaram)", category: "temple", district: "Mulugu", location: pt(80.1300, 18.2700),
    tagline: "Tribal shrine and site of the Medaram Jatara.", highlight: "One of the world's largest gatherings",
    bestTime: "Medaram Jatara (Feb, biennial)", description: "A 12th-century Koya-tribe shrine to the warrior mother-daughter Sammakka and Saralamma, deep in the Eturnagaram forest; its biennial jatara draws close to a crore of devotees." },
  { name: "Thousand Pillar Temple", category: "temple", district: "Hanamkonda", location: pt(79.5610, 18.0057),
    tagline: "Star-shaped Kakatiya temple to Shiva, Vishnu, Surya.", highlight: "Kakatiya architecture",
    bestTime: "Oct – Feb", description: "A 12th-century Kakatiya temple on a star-shaped plan, famed for its intricately carved pillars and monolithic Nandi." },
  { name: "Bhadrakali Temple", category: "temple", district: "Warangal", location: pt(79.5828, 17.9949),
    tagline: "Ancient hilltop shrine beside Bhadrakali Lake.", highlight: "One of India's oldest Bhadrakali temples",
    bestTime: "Year-round", description: "A hill temple to the eight-armed Goddess Bhadrakali, traced to 625 CE, set among natural rock formations overlooking Bhadrakali Lake between Warangal and Hanamkonda." },
  { name: "Kaleshwaram Temple", category: "temple", district: "Jayashankar Bhupalpally", location: pt(79.9000, 18.8100),
    tagline: "Twin-lingam Shiva shrine at a river confluence.", highlight: "Trilinga Kshetra",
    bestTime: "Year-round", description: "The Kaleshwara Mukteswara Swamy temple at the meeting of the Godavari and Pranahita, rare for its two lingams on a single pedestal." },
  { name: "Basara Saraswati Temple", category: "temple", district: "Nirmal", location: pt(77.9531, 18.8790),
    tagline: "Rare Saraswati shrine on the Godavari.", highlight: "Aksharabhyasam rituals",
    bestTime: "Year-round", description: "One of very few temples to Goddess Saraswati, where families bring children for the first-learning aksharabhyasam ritual." },
  { name: "Vemulawada Temple", category: "temple", district: "Rajanna Sircilla", location: pt(78.8672, 18.4667),
    tagline: "The 'Dakshina Kashi' Rajarajeswara shrine.", highlight: "Shaiva pilgrimage",
    bestTime: "Year-round", description: "A major Shiva temple known as Dakshina Kashi, where devotees perform the kode mokku offering with bulls." },
  { name: "Birla Mandir", category: "temple", district: "Hyderabad", location: pt(78.4691, 17.4062),
    tagline: "White-marble hilltop temple over Hussain Sagar.", highlight: "City landmark",
    bestTime: "Year-round", description: "A serene Venkateswara temple carved from white marble on Naubath Pahad, with sweeping views over the lake and city skyline." },

  // ---------------- Nature ----------------
  { name: "Kuntala Waterfall", category: "nature", district: "Adilabad", location: pt(78.4386, 19.2760),
    tagline: "Telangana's highest waterfall, best in monsoon.", highlight: "Highest falls in Telangana",
    bestTime: "Jul – Oct", description: "The state's tallest waterfall on the Kadem river at Neredigonda, roaring through the monsoon and wrapped in teak forest." },
  { name: "Bogatha Waterfall", category: "nature", district: "Bhadradri Kothagudem", location: pt(80.6300, 17.9300),
    tagline: "The 'Niagara of Telangana' in tribal country.", highlight: "Monsoon cascade",
    bestTime: "Jul – Oct", description: "A wide multi-tier waterfall near Koyaveerapuram, often called the Niagara of Telangana, spectacular through the monsoon." },
  { name: "Nagarjuna Sagar Dam", category: "nature", district: "Nalgonda", location: pt(79.3122, 16.5747),
    tagline: "One of the world's largest masonry dams.", highlight: "Reservoir & boating",
    bestTime: "Aug – Feb", description: "A colossal masonry dam and reservoir, with boat rides to the Buddhist island-museum of Nagarjunakonda." },
  { name: "Laknavaram Lake", category: "nature", district: "Mulugu", location: pt(79.9667, 18.1667),
    tagline: "Island-dotted lake crossed by a hanging bridge.", highlight: "Suspension bridge",
    bestTime: "Aug – Feb", description: "A scenic Kakatiya-era lake threaded by a long suspension bridge between forested islets, with lakeside cottages." },
  { name: "Ananthagiri Hills", category: "nature", district: "Vikarabad", location: pt(78.0000, 17.3600),
    tagline: "Cool forested hills and the Musi's source.", highlight: "Weekend getaway",
    bestTime: "Jun – Feb", description: "Dense deccan forest near Hyderabad, a favourite for trekking, coffee slopes and the source of the Musi river." },
  { name: "Hussain Sagar & Tank Bund", category: "nature", district: "Hyderabad", location: pt(78.4750, 17.4239),
    tagline: "Heart-shaped lake with the midwater Buddha.", highlight: "City lakefront",
    bestTime: "Year-round", description: "The 16th-century lake linking the twin cities, with a monolithic Buddha statue on Gibraltar Rock and a lively promenade." },
  { name: "Nehru Zoological Park", category: "nature", district: "Hyderabad", location: pt(78.4513, 17.3497),
    tagline: "One of India's largest zoos, with a safari.", highlight: "Family favourite",
    bestTime: "Oct – Feb", description: "A sprawling zoo with a lion and tiger safari, natural enclosures and a prehistoric park — one of the country's most visited." },

  // ---------------- Crafts (village to visit) ----------------
  { name: "Pochampally Ikat Village", category: "crafts", district: "Yadadri Bhuvanagiri", location: pt(78.8203, 17.3006),
    tagline: "The 'Silk City' of ikat weaving, 50 km from Hyderabad.", highlight: "UNWTO Best Tourism Village 2021",
    bestTime: "Year-round", description: "The weaving village behind Pochampally Ikat — hundreds of pit looms, a tie-dye tradition GI-tagged since 2004, and a UN World Tourism Organisation Best Tourism Village. Book an individual host below to visit a working loom." },

  // ---------------- Food ----------------
  { name: "Old City Biryani Trail", category: "food", district: "Hyderabad", location: pt(78.4740, 17.3590),
    tagline: "Dum biryani and Irani chai around Charminar.", highlight: "Culinary trail",
    bestTime: "Year-round", description: "The lanes around Charminar and Shah Ali Banda, where slow-cooked dum biryani, haleem in Ramzan and Osmania biscuits define the city's table." },
];

// --- Bookable providers: the crafts vertical (bookable:true) ---------------
const providers = [
  { name: "Lakshmamma Bhooma", craft: "Pochampally Ikat", district: "Yadadri Bhuvanagiri", phone: "+919000000001",
    location: pt(78.8210, 17.3011), availabilityState: "available",
    tagline: "Third-generation double-ikat silk weaver.", highlight: "GI craft · Pochampally",
    bio: "Weaves double-ikat silk sarees on a pit loom and hosts dye-and-weave walkthroughs.",
    seed: { declaredCraft: "Pochampally Ikat", audits: 2, reviews: [5, 4, 5] } },
  { name: "Nakash Vaikuntam", craft: "Cheriyal Scroll Painting", district: "Siddipet", phone: "+919000000003",
    location: pt(79.1405, 18.1308), availabilityState: "available",
    tagline: "Nakashi scroll painter of folk epics.", highlight: "GI craft · Cheriyal",
    bio: "Paints mythological scrolls with natural pigments and demonstrates the full process.",
    seed: { declaredCraft: "Cheriyal Scroll Painting", audits: 2, reviews: [5, 5, 4] } },
  { name: "Todasam Bheem", craft: "Adilabad Dokra", district: "Adilabad", phone: "+919000000005",
    location: pt(78.5330, 19.6648), availabilityState: "request_confirm",
    tagline: "Woj-community lost-wax brass caster.", highlight: "GI craft · Dokra",
    bio: "Casts tribal brass figurines by the lost-wax method passed down in the Woj community.",
    seed: { declaredCraft: "Adilabad Dokra", audits: 1, reviews: [5, 4] } },
  { name: "Saroja Handloom", craft: "Gadwal Saree", district: "Jogulamba Gadwal", phone: "+919000000006",
    location: pt(77.7960, 16.2356), availabilityState: "available",
    tagline: "Kotakomma-border Gadwal saree weaver.", highlight: "GI craft · Gadwal",
    bio: "Weaves the cotton-body, silk-border Gadwal saree and welcomes visitors to the loom.",
    seed: { declaredCraft: "Gadwal Saree", audits: 1, reviews: [5, 5] } },
  { name: "Ameena Bangles", craft: "Hyderabad Lac Bangles", district: "Hyderabad", phone: "+919000000008",
    location: pt(78.4750, 17.3619), availabilityState: "request_confirm",
    tagline: "Laad Bazaar lac-bangle maker.", highlight: "GI craft · Laad Bazaar",
    bio: "Sets stones and mirror-work into lac bangles in the lanes beside Charminar.",
    seed: { declaredCraft: "Hyderabad Lac Bangles", audits: 2, reviews: [5, 4, 5] } },
];

async function run() {
  await connectDB();
  console.log("Clearing…");
  await Promise.all([Place.deleteMany({}), Verifier.deleteMany({}), AuditLog.deleteMany({}), Review.deleteMany({})]);

  const insertedSights = await Place.insertMany(sights.map((s) => ({ ...s, bookable: false })));
  console.log(`Seeded ${insertedSights.length} discovery sights`);

  const types = ["shg", "coop", "csc", "cluster_officer"];
  for (const p of providers) {
    const { seed, ...rest } = p;
    const place = await Place.create({
      ...rest, category: "crafts", bookable: true,
      credentials: [{ docType: "pehchan", docNumber: `TS-${Math.floor(100000 + Math.random() * 899999)}`,
        declaredCraft: seed.declaredCraft, formatValid: true, giDistrictMatch: true, tier1Score: 100 }],
    });
    const verifier = await Verifier.create({ name: `${rest.district} SHG coordinator`,
      type: types[Math.floor(Math.random() * types.length)], phone: "+919888800000", place: place._id });
    for (let i = 0; i < seed.audits; i++)
      await AuditLog.create({ verifier: verifier._id, place: place._id, action: "corroborated",
        notes: "Vouched by local institution during cluster visit." });
    for (const rating of seed.reviews)
      await Review.create({ place: place._id, rating, comment: "Warm host, authentic workshop experience." });
    const { score } = await computeTrustScore(place);
    place.trustScore = score; place.verified = score >= 50; await place.save();
    console.log(`  ${place.name} — trust ${score} (${place.availabilityState})`);
  }

  console.log(`Seed complete — ${insertedSights.length + providers.length} places total.`);
  await mongoose.disconnect();
  process.exit(0);
}
run().catch((e) => { console.error(e); process.exit(1); });