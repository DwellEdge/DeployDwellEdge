import React from "react";
import { Link } from "react-router-dom";
import "./style.css"; // custom styles for the homepage

function Home() {
  return (
    <div className="homepage">
      <video autoPlay loop muted playsInline className="background-video">
  <source src="/assets/waterfall.mp4" type="video/mp4" />
</video>

<div className="overlay"></div>

      <header className="navbar">
        <h2>DWELLEDGE Tech</h2>
        <nav>
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/about">About Us</Link></li>
            <li><Link to="/services">Services</Link></li>
            <li><Link to="/careers">Careers</Link></li>
            <li><Link to="/contact">Contact Us</Link></li>
            <li><Link to="/login">Employee Login</Link></li>
          </ul>
        </nav>
      </header>

      <section className="hero">
        <h1>Empowering Talent Transformations</h1>
        <p>Embrace the talent revolution to remain relevant in the future.</p>
        <button className="cta-btn">Get Started</button>
      </section>
    </div>
  );
}

export default Home;
