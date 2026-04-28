import React, { useState, useEffect } from "react";
import Navbar from "./Navbar";
import bgImage from "./images/career-image.jpg";
import "./style.css";
import Footer from "./Footer";
import { useNavigate } from "react-router-dom";

function Careers() {
  const [jobs, setJobs] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedJob, setSelectedJob] = useState(null);
  const navigate = useNavigate();

  // 🔥 FETCH JOBS FROM BACKEND
  useEffect(() => {
    fetch("http://localhost:5000/careers")
      .then((res) => res.json())
      .then((data) => {
        console.log("API DATA:", data);

        // ✅ Ensure array
        if (Array.isArray(data)) {
          setJobs(data);
        } else {
          setJobs([]);
        }
      })
      .catch((err) => {
        console.error("Fetch error:", err);
        setJobs([]);
      });
  }, []);

  // ✅ FIX: DEFINE filteredJobs (THIS WAS MISSING)
  const filteredJobs = jobs.filter((job) =>
    job.jobTitle?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="career-page">
      <Navbar />

      <div className="main-content">
        {/* HERO */}
        <div
          className="career-hero"
          style={{
            backgroundImage: `url(${bgImage})`,
            backgroundSize: "cover",
            backgroundPosition: "center"
          }}
        >
          <div className="overlay">
            <h1>Job search</h1>

            <div className="search-box">
              <input
                type="text"
                placeholder="Search jobs by title..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <button>→</button>
            </div>
          </div>
        </div>

        {/* JOBS */}
        <div className="jobs-container">
          <div className="job-list">

            {/* ✅ HANDLE EMPTY STATE */}
            {filteredJobs.length === 0 ? (
              <p style={{ color: "white" }}>No jobs found</p>
            ) : (
              filteredJobs.map((job) => (
                <div
                  key={job._id}
                  className="job-card"
                  onClick={() => setSelectedJob(job)}
                >
                  <div>
                    <h2>{job.jobTitle} →</h2>
                    <p>{job.requiredSkills}</p>
                  </div>

                  <div className="job-info">
                    <p>{job.description}</p>
                  </div>
                </div>
              ))
            )}

          </div>

          {/* FILTERS */}
          <div className="filters">
            <h3>Filters</h3>

            <div className="filter-section">
              <p>Experience Level</p>
              <label><input type="checkbox" /> Executives</label>
              <label><input type="checkbox" /> Experienced Professionals</label>
            </div>
          </div>
        </div>
      </div>

      {/* 🔥 POPUP */}
      {selectedJob && (
        <div
          className="job-popup-overlay"
          onClick={() => setSelectedJob(null)}
        >
          <div
            className="job-popup"
            onClick={(e) => e.stopPropagation()}
          >
            <h1>{selectedJob.jobTitle}</h1>

            <div className="job-meta">
              <span>Created By: {selectedJob.createdBy}</span>
              <span>
                {new Date(selectedJob.createdDate).toLocaleDateString()}
              </span>
            </div>

            <div className="job-popup-content">
              <h2>Required Skills</h2>
              <p>{selectedJob.requiredSkills}</p>

              <h2>Job Description</h2>
              <p>{selectedJob.description}</p>

              <h2>Your Role</h2>
              <p>
                As a {selectedJob.jobTitle}, you will work on modern applications
                and build scalable solutions.
              </p>

              <h2>Experience</h2>
              <p>2+ years preferred.</p>

              <h2>What You’ll Love</h2>
              <p>Growth, flexibility, and a strong tech culture.</p>

              <h2>About Dwelledge</h2>
              <p>Innovation-driven platform for skill growth.</p>
            </div>

            {/* APPLY BUTTON */}
            <div className="popup-actions">
              <button
                className="apply-btn"
                onClick={() =>
                  navigate("/apply", { state: selectedJob })
                }
              >
                Apply →
              </button>
            </div>

            <span
              className="close-btn"
              onClick={() => setSelectedJob(null)}
            >
              ✖
            </span>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}

export default Careers;