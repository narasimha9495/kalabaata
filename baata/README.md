# Baata — the discovery trail of Telangana

A location-aware **Telangana tourism** platform. One map surfaces heritage, temples,
nature, food, and bookable craft workshops by proximity — solving the "you don't know
what you don't know" gap for visitors. Built on the **MERN stack** (MongoDB + Express +
React/Vite + Node) with a Leaflet map, Tesseract OCR verification, and a WhatsApp
availability flow.

Crafts (KalaBaata, the original vertical) is now one bookable category inside the broader
tourism app: **broad discovery across all categories, one deep vertical that goes all the
way down** to verification and booking.

## Categories
Heritage · Temples · Nature · Crafts (bookable) · Food — colour-coded on the map and as
filter tabs. Sights are discovery listings; craft hosts add a trust score, credential
verification, and request-to-book.

## Structure
```
baata/
├── server/   Express + Mongoose API
│   ├── models/    Place (sights + bookable providers), Booking, Review,
│   │              Verifier, AuditLog, AvailabilityLog
│   ├── routes/    places (discovery + categories), verify (OCR, bookable-only),
│   │              bookings (bookable-only), whatsapp (webhook + simulate)
│   ├── services/  ocr, giCheck (GI→district), trust (3-tier score)
│   └── seed.js    18 real Telangana sights + 5 craft hosts
└── client/   React + Vite + Leaflet
    ├── components/ Navbar, MapView, PlaceCard, CategoryChip, TrustSeal,
    │               AvailabilityPill, BookingModal
    └── pages/      Discover, PlaceDetail, Verify, Bookings, About
```

## Setup (Windows PowerShell)
```powershell
# backend
cd server
copy .env.example .env
npm install
npm run seed
npm run dev            # API on http://localhost:5000

# frontend (second terminal)
cd client
copy .env.example .env
npm install
npm run dev            # app on http://localhost:5173
```
Requires Node 18+ and MongoDB (local or Atlas — set MONGODB_URL). `DEMO_MODE=true`
keeps OCR instant for the live demo.

## Demo script
1. **Discover** — dark hero, category tabs (Heritage/Temples/Nature/Crafts/Food), pins
   colour-coded by category, nearest-first from Hyderabad.
2. **Sight detail** — open Ramappa Temple or Kuntala Falls: description, best season, mini-map.
3. **Craft host** — open a Pochampally weaver: trust seal, credentials, reviews, booking.
4. **WhatsApp flip** — on a host, hit Reply "YES"/"NO"; the live badge flips.
5. **Verify** — upload any JPG/PNG/PDF → OCR → GI-district check → trust score updates.
6. **Bookings** — request a visit, then confirm/decline it host-side.

## Git — first push (use your identity)
```powershell
git init
git config user.name "narasimha9495"
git config user.email "budhilreddy024@gmail.com"
git add .
git commit -m "Initial commit: Baata — Telangana tourism discovery (MERN)"
git branch -M main
git remote add origin https://github.com/narasimha9495/baata.git
git push -u origin main
```

## Notes
Seed coordinates are approximate cluster/site centres for the demo map — regenerate exact
values with an OpenStreetMap/Nominatim geocode pass if needed. Verification and booking
apply only to the crafts vertical by design.
