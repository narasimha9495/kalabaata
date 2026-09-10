import { NavLink } from "react-router-dom";
export default function Navbar() {
  return (
    <nav className="nav">
      <div className="nav-inner">
        <div>
          <NavLink to="/" className="wordmark">Baata<b>.</b></NavLink>
          <span className="nav-tag">discover telangana</span>
        </div>
        <div className="nav-links">
          <NavLink to="/" end>Discover</NavLink>
          <NavLink to="/verify">Verify</NavLink>
          <NavLink to="/bookings">Bookings</NavLink>
          <NavLink to="/about">About</NavLink>
        </div>
      </div>
    </nav>
  );
}
