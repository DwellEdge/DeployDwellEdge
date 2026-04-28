import React from "react";
import { Link } from "react-router-dom";
import dwelledgeLogo from "./images/dwelledgeimage.png";
import "./style.css";

function Navbar() {
  return (
    <header className="navbar navbar-dark">
      <div className="logo-container">
        <img src={dwelledgeLogo} alt="logo" className="logo-img" />
        <Link to="/" className="logo-text">DWELLEDGE</Link>
      </div>

      <nav>
        <ul className="nav-links">
          <li><Link to="/About">About Us</Link></li>
          <li><Link to="/Services">Services</Link></li>
          <li><Link to="/Careers">Careers</Link></li>
          <li><Link to="/Contact">Contact Us</Link></li>
        </ul>
      </nav>

      <div className="nav-buttons">
        <Link to="/start" className="nav-btn primary">Employee Login</Link>
      </div>
    </header>
  );
}

export default Navbar;