import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./style.css";
import dwelledgeLogo from "./images/dwelledgeimage.png";

function Careers() {

  const [careers, setCareers] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);

  useEffect(() => {
    const data = [
      {
        id: 1,
        title: "Frontend Developer",
        skills: "React, JavaScript, CSS",
        description: "Build modern UI and responsive web apps."
      },
      {
        id: 2,
        title: "Backend Developer",
        skills: "Node.js, Express, MongoDB",
        description: "Develop APIs and scalable backend systems."
      },
      {
        id: 3,
        title: "Data Analyst",
        skills: "Python, SQL, Excel",
        description: "Analyze data and generate business insights."
      }
    ];

    setCareers(data);
  }, []);

  return (
    <div className="career-page">

      {/* 🔥 HEADER / NAVBAR */}
      <header className="career-navbar">
        <div className="logo-container">
          <img src={dwelledgeLogo} alt="logo" className="logo-img" />
          <h2>DWELLEDGE</h2>
        </div>

        <nav>
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/Services">Services</Link></li>
            <li><Link to="/Careers">Careers</Link></li>
            <li><Link to="/Contact">Contact</Link></li>
          </ul>
        </nav>
      </header>

      {/* 🔥 TITLE */}
      <h1 className="career-title">Join Our Team 🚀</h1>

      {/* 🔥 JOB GRID */}
      <div className="career-grid">
        {careers.map((job) => (
          <div
            key={job.id}
            className="career-card"
            onClick={() => setSelectedJob(job)}
          >
            <h3>{job.title}</h3>
            <p>{job.skills}</p>
          </div>
        ))}
      </div>

      {/* 🔥 POPUP */}
      {selectedJob && (
        <div className="popup-overlay" onClick={() => setSelectedJob(null)}>
          <div className="popup-box" onClick={(e) => e.stopPropagation()}>

            <h2>{selectedJob.title}</h2>

            <p><strong>Skills:</strong> {selectedJob.skills}</p>
            <p>{selectedJob.description}</p>

            <button className="apply-btn">
              Apply Now →
            </button>

            <span className="close-btn" onClick={() => setSelectedJob(null)}>✖</span>
          </div>
        </div>
      )}

    </div>
  );
}

export default Careers;