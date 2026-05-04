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
                  <p className="logo-text">DWELLEDGE</p>
      </div>

      {/* NAV LINKS */}
      <nav>
        <ul className="nav-links">
          <li><Link to="/">Home</Link></li>
          <li><Link to="/about">About</Link></li>
          <li><Link to="/services">Services</Link></li>
          <li><Link to="/careers">Careers</Link></li>
          <li><Link to="/contact">Contact</Link></li>
          <li><Link to="/login">Employee Login</Link></li>
        </ul>
      </nav>

    </header>
  );
}

export default Navbar;