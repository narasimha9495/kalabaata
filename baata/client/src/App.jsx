import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar.jsx";
import Discover from "./pages/Discover.jsx";
import PlaceDetail from "./pages/PlaceDetail.jsx";
import Verify from "./pages/Verify.jsx";
import Bookings from "./pages/Bookings.jsx";
import About from "./pages/About.jsx";

export default function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Discover />} />
        <Route path="/place/:id" element={<PlaceDetail />} />
        <Route path="/verify" element={<Verify />} />
        <Route path="/bookings" element={<Bookings />} />
        <Route path="/about" element={<About />} />
      </Routes>
      <footer className="foot"><div className="wrap">Baata · location-aware Telangana tourism discovery · Digital India Hackathon, SNIST</div></footer>
    </>
  );
}
