import React from "react";
import "./Home.css";

function Home() {
  return (
    <div className="homepage">
      <video autoPlay loop muted playsInline className="background-video">
  <source src="/assets/waterfall.mp4" type="video/mp4" />
</video>

<div className="overlay"></div>

      <header className="navbar">
        <h2 className="logo">DWELLEDGE Tech</h2>
        <nav className="nav-center">
          <ul>
            <li>About Us</li>
            <li>Services</li>
            <li>Careers</li>
            <li>Contact Us</li>
            <li>Employee</li>
          </ul>
        </nav>
        <div className="nav-right">
          <button className="login-btn">Login</button>
          <button className="employee-btn">Employee Login</button>
        </div>
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
