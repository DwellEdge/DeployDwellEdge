import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import "./style.css";
import dwelledgeLogo from "./images/dwelledgeimage.png";
import Footer from "./Footer";
import Navbar from "./Navbar";

// Videos
import video1 from "./vedioes/ai-animation-video.mp4";
import video2 from "./vedioes/successful-marketing.mp4";
import video3 from "./vedioes/backside-motion-poster.mp4";

import slide1 from "./vedioes/birds-vedio.mp4";
import slide2 from "./vedioes/flowers-vedio.mp4";
import slide3 from "./vedioes/green-aeroplane-vedio.mp4";

// Images
import image1 from "./images/buildings.png";
import image2 from "./images/design-building.png";
import image3 from "./images/nature-buildings.png";
import img1 from "./images/app-support-image.avif";
import img2 from "./images/ecommers-application.jpg";
import img3 from "./images/healthcare-domin-image.jpg";
import img4 from "./images/hospital-application.webp";
import img5 from "./images/hostal-application.jpg";
import img6 from "./images/webdegin-image.avif";

function Home() {


  const slides = [
    {
      video: slide1,
      title: "Empowering Talent Transformations",
      text: "Embrace the talent revolution and build future-ready skills with DWELLEDGE technologies.",
    },
    {
      video: slide2,
      title: "Innovative Digital Solutions",
      text: "We design scalable web, AI, and cloud solutions that accelerate business growth and efficiency.",
    },
    {
      video: slide3,
      title: "Technology That Drives Success",
      text: "From startups to enterprises, DWELLEDGE delivers smart, reliable, and high-performance software solutions.",
    },
  ];

  const [current, setCurrent] = useState(0);

  useEffect(() => {
  // ================= FADE-UP ANIMATION =================
  const elements = document.querySelectorAll(".fade-up");

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("show");
        }
      });
    },
    { threshold: 0.2 }
  );

  elements.forEach((el) => observer.observe(el));

  // ================= VIDEO SLIDER =================
  const interval = setInterval(() => {
    setCurrent((prev) => (prev + 1) % slides.length);
  }, 5000); // change video every 5 sec

  // ================= CLEANUP =================
  return () => {
    elements.forEach((el) => observer.unobserve(el));
    clearInterval(interval); // ✅ stop slider on unmount
  };

}, [slides.length]);

  const vid1Ref = useRef(null);
  const vid2Ref = useRef(null);
  const trackRef = useRef(null);

  const handlePlay = (ref) => ref.current && ref.current.play();
  const handlePause = (ref) => {
    if (ref.current) {
      ref.current.pause();
      ref.current.currentTime = 0;
    }
  };

  const scrollLeft = () => trackRef.current?.scrollBy({ left: -300, behavior: "smooth" });
  const scrollRight = () => trackRef.current?.scrollBy({ left: 300, behavior: "smooth" });

  return (
    <div className="homepage">

      {/* NAVBAR */}
      <Navbar />

      {/* HERO */}
      <section className="hero-banner">

        {/* VIDEO BACKGROUND */}
        <video
          key={slides[current].video}   // ✅ ensures video changes properly
          autoPlay
          muted
          playsInline
          className="hero-bg-video"
        >
          <source src={slides[current].video} type="video/mp4" />
        </video>

        {/* DARK OVERLAY */}
        <div className="hero-overlay"></div>

        {/* TEXT CONTENT */}
        <div className="hero-content">
          <div className="hero-text">
            <h1>{slides[current].title}</h1>
            <p>{slides[current].text}</p>

            <div className="hero-buttons">
              <Link to="/contact" className="cta-btn">Contact Us</Link>
              <Link to="/Services" className="cta-btn primary">Get Started</Link>
            </div>
          </div>
        </div>

      </section>

      {/* INDUSTRY SECTION */}
      <section className="industry-section video-bg-section fade-up">
        <video autoPlay loop muted playsInline className="section-bg-video">
          <source src={video3} type="video/mp4" />
        </video>


        <div className="section-overlay"></div>

        <div className="section-content">
          <h1>Launch faster with 16+ Agentforce solutions</h1>

          <div className="industry-grid">
            <div className="industry-box"><h3>Web Services</h3></div>
            <div className="industry-box"><h3>Industry Services</h3></div>
            <div className="industry-box"><h3>Communication</h3></div>
            <div className="industry-box"><h3>Feature Aknowledge</h3></div>
          </div>
        </div>
      </section>

      {/* ================= PROMO 1 ================= */}
      <section className="promo fade-up">

        {/* LEFT TEXT */}
        <div className="promo-left">
          <h1>Grow faster and work smarter.</h1>
          <p>
            Start with DWELLEDGE Suite – built for small business with AI to help you grow.
          </p>

          <div className="promo-buttons">
            <button className="cta-btn primary">Start for free</button>
            <button className="cta-btn">Start demo</button>
          </div>
        </div>

        {/* RIGHT VIDEO */}
        <div className="promo-right">
          <video
            ref={vid2Ref}
            autoPlay
            muted
            loop
            playsInline
            onMouseEnter={() => handlePlay(vid2Ref)}
            onMouseLeave={() => handlePause(vid2Ref)}
            className="promo-video"
          >
            <source src={video2} type="video/mp4" />
          </video>
        </div>

      </section>


      {/* ================= PROMO 2 ================= */}
      <section className="promo alt fade-up">

        {/* LEFT VIDEO */}
        <div className="promo-left">
          <video
            ref={vid1Ref}
            autoPlay
            muted
            loop
            playsInline
            onMouseEnter={() => handlePlay(vid1Ref)}
            onMouseLeave={() => handlePause(vid1Ref)}
            className="promo-video"
          >
            <source src={video1} type="video/mp4" />
          </video>
        </div>

        {/* RIGHT TEXT */}
        <div className="promo-right">
          <h2>3M+ conversations handled by DWELLEDGE AI</h2>
          <p>
            66% automation, higher conversions, and smarter AI solutions for business growth.
          </p>

          <div className="promo-buttons">
            <button className="cta-btn primary">See our stories</button>
            <button className="cta-btn">Experience Help</button>
          </div>
        </div>

      </section>

      {/* ================= BOTTOM CARDS ================= */}
      <section className="bottom-section fade-up">
        <h1 className="bottom-heading"> Cutting edge solutions to power up your business. </h1>
        <div className="bottom-grid">
          <div className="bottom-card">
            <img src={image2} alt="Industries" />
            <h3>Industries</h3>
            <p>Select your industry. Discover our impact.</p>
            <span className="arrow">→</span>
          </div>
          <div className="bottom-card">
            <img src={image3} alt="Services" />
            <h3>Services</h3>
            <p>Experience our services. Transform your business.</p>
            <span className="arrow">→</span>
          </div>
          <div className="bottom-card">
            <img src={image1} alt="Products and Platforms" />
            <h3>Products and Platforms</h3>
            <p>Explore our products. Accelerate your performance.</p>
            <span className="arrow">→</span>
          </div>
        </div>
      </section>

      {/* ================= GIFT CARD SECTION ================= */}
      <section className="giftcard-section fade-up">
        <h2 className="giftcard-heading">Popular development</h2>
        <p className="giftcard-subheading"> Explore our most popular development solutions, designed to help you achieve your goals faster and more efficiently. </p>
        <div className="giftcard-carousel">
          <button className="arrow left" onClick={scrollLeft}>‹</button>
          <div className="giftcard-track" ref={trackRef}>
            <div className="giftcard-box">
              <img src={img1} alt="App-support" />
              <h3>App-support</h3>
            </div>
            <div className="giftcard-box">
              <img src={img2} alt="Ecommerce" />
              <h3>Ecommers-application</h3>
            </div>
            <div className="giftcard-box">
              <img src={img3} alt="Healthcare" />
              <h3>Healthcare-domin</h3>
            </div>
            <div className="giftcard-box">
              <img src={img4} alt="Hospital" />
              <h3>Hospital-application</h3>
            </div>
            <div className="giftcard-box">
              <img src={img5} alt="Hostel" />
              <h3>Hostal-application</h3>
            </div> <div className="giftcard-box">
              <img src={img6} alt="Webdesign" />
              <h3>Webdesign-image</h3>
            </div>
          </div>
          <button className="arrow right" onClick={scrollRight}>›</button>
        </div>
      </section>

      {/* FOOTER */}
      <Footer />

    </div>
  );
}

export default Home;