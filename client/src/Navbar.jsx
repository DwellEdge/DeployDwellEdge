import React from "react";
import { Link } from "react-router-dom";
import dwelledgeLogo from "./images/dwelledgeimage.png";
import "./style.css";

function Navbar() {
  return (
    <header className="navbar navbar-dark">
      <div className="logo-container">
        <img src={dwelledgeLogo} alt="logo" className="logo-img" />
        <h2 className="logo-text">DWELLEDGE Tech</h2>
      </div>

      <nav>
        <ul className="nav-links">
          <li><Link to="/">Home</Link></li>
          <li><Link to="/About">About Us</Link></li>
          <li><Link to="/Services">Services</Link></li>
          <li><Link to="/Careers">Careers</Link></li>
          <li><Link to="/Contact">Contact Us</Link></li>
        </ul>
      </nav>

      <div className="nav-buttons">
        <Link to="/login" className="nav-btn">Login</Link>
        <Link to="/start" className="nav-btn primary">Employee Login</Link>
      </div>
    </header>
  );
}

export default Navbar;