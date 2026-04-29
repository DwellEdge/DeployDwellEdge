import React from "react";
import { Link } from "react-router-dom";
import dwelledgeLogo from "./images/dwelledgeimage.png";
import "./style.css";

function Navbar() {
  return (
    <header className="navbar">
      {/* LOGO */}
      <div className="logo-container">
        <img src={dwelledgeLogo} alt="logo" className="logo-img" />
        <Link to="/" className="logo-text">DWELLEDGE</Link>
      </div>

      {/* NAV LINKS */}
      <nav>
        <ul className="nav-links">
          <li><Link to="/">Home</Link></li>
          <li><Link to="/about">About</Link></li>
          <li><Link to="/services">Services</Link></li>
          <li><Link to="/careers">Careers</Link></li>
          <li><Link to="/contact">Contact</Link></li>
        </ul>
      </nav>

      {/* BUTTON */}
      <div className="nav-buttons">
        <Link to="/login" className="nav-btn primary">
          Employee Login
        </Link>
      </div>
    </header>
  );
}

export default Navbar;