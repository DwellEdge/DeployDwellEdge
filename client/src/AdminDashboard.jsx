import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./innerpages.css";
import dwelledgeLogo from "./images/dwelledgeimage.png";

const dashboardItems = [
  {
    id: "JobListing",
    path: "/admin/JobListing",
    title: "Job Listings",
    description: "Building scalable, secure, and customized enterprise solutions to streamline business operations.",
  },
  {
    id: "EmployeePage",
    path: "/admin/employeepage",
    title: "Employee Dashboard",
    description: "Ensuring smooth performance, bug fixes, and ongoing support for mission-critical applications.",
  },
  {
    id: "Founders",
    path: "/admin/founders",
    title: "Founders Dashboard",
    description: "Creating responsive, user-friendly web apps tailored to client needs.",
  },
  {
    id: "Applicants",
    path: "/admin/Applicants",
    title: "Applicants",
    description: "View and manage job applications submitted by candidates.",
  },
];

function AdminDashboard() {
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [passwordForm, setPasswordForm] = useState({ current: "", newPass: "", confirm: "" });
  const [passwordError, setPasswordError] = useState("");
  const [showChangePassword, setShowChangePassword] = useState(false);

  const API = "http://localhost:5001";
  const storedEmail = localStorage.getItem("adminEmail");
  const adminEmail =
    storedEmail && storedEmail !== "undefined"
      ? storedEmail
      : "admin@dwelledge.com";


       useEffect(() => {
          const close = () => setShowDropdown(false);
          if (showDropdown) document.addEventListener("click", close);
          return () => document.removeEventListener("click", close);
        }, [showDropdown]);

        const handleChangePassword = async (e) => {
    e.preventDefault();
    setPasswordError("");
    if (passwordForm.newPass !== passwordForm.confirm) {
      setPasswordError("New passwords do not match");
      return;
    }

    try {
      const res = await fetch(`${API}/api/auth/change-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: adminEmail,
          currentPassword: passwordForm.current,
          newPassword: passwordForm.newPass,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Incorrect current password");
      showToast("Password changed successfully", "success");
      setShowChangePassword(false);
      setPasswordForm({ current: "", newPass: "", confirm: "" });
    } catch (err) {
      setPasswordError(err.message);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("adminEmail");
    navigate("/login");
  };

  return (
    <div className="dashboard-page">
      {/* ===== ADMIN NAVBAR ===== */}
            <header className="admin-topnav">
              <div className="admin-topnav-logo">
               <Link to="/"><img src={dwelledgeLogo} alt="Dwelledge" className="admin-topnav-logo-img" /></Link>
                <span className="admin-topnav-logo-text"><Link to="/">DWELLEDGE</Link></span>
              </div>
      
              <nav className="admin-topnav-links">
                <Link to="/">Home</Link>
                <Link to="/about">About</Link>
                <Link to="/services">Services</Link>
                <Link to="/careers">Careers</Link>
                <Link to="/contact">Contact</Link>
              </nav>
      
              <div className="admin-topnav-profile" onClick={(e) => { e.stopPropagation(); setShowDropdown(!showDropdown); }}>
                <div className="admin-topnav-avatar">
                  {adminEmail.charAt(0).toUpperCase()}
                </div>
                <span className="admin-topnav-caret">{showDropdown ? "▲" : "▼"}</span>
      
                {showDropdown && (
                  <div className="admin-topnav-dropdown" onClick={(e) => e.stopPropagation()}>
                    <div className="admin-dropdown-header">
                      <div className="admin-dropdown-avatar">{adminEmail.charAt(0).toUpperCase()}</div>
                      <div>
                        <div className="admin-dropdown-email">{adminEmail}</div>
                        <div className="admin-dropdown-role">Administrator</div>
                      </div>
                    </div>
                    <hr className="admin-dropdown-divider" />
                    <button className="admin-dropdown-item" onClick={() => { setShowDropdown(false); setShowProfile(true); }}>
                      👤 My Profile
                    </button>
                    <button className="admin-dropdown-item" onClick={() => { setShowDropdown(false); setShowChangePassword(true); }}>
                      🔒 Change Password
                    </button>
                    <hr className="admin-dropdown-divider" />
                    <button className="admin-dropdown-item admin-dropdown-logout" onClick={handleLogout}>
                      ↩ Logout
                    </button>
                  </div>
                )}
              </div>
            </header>

      <div style={{ paddingTop: "120px" }}>
        <div className="dashboard-header">
          <h1 className="dashboard-title">
            <em>Dashboard</em>
          </h1>
        </div>

        <div className="dashboard-wrapper">
          <div className="dashboard-row">
            {dashboardItems.map((item) => (
              <Link
                to={item.path}
                key={item.id}
                className="dashboard-card-link"
              >
                <div className="dashboard-card">
                  <h3>{item.title}</h3>
                  <p>{item.description}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* ================= PROFILE MODAL ================= */}
      {showProfile && (
        <div className="admin-modal-overlay" onClick={() => setShowProfile(false)}>
          <div className="admin-modal admin-profile-modal" onClick={(e) => e.stopPropagation()}>
            <div className="admin-modal-header">
              <h2 className="admin-modal-title">My Profile</h2>
              <button className="admin-modal-close" onClick={() => setShowProfile(false)}>
                ✕
              </button>
            </div>
            <div className="admin-profile-body">
              <div className="admin-profile-avatar">{adminEmail.charAt(0).toUpperCase()}</div>
              <div className="admin-profile-email">{adminEmail}</div>
              <div className="admin-profile-role">Administrator</div>
              <div className="admin-profile-options">
                <button
                  className="admin-profile-option"
                  onClick={() => {
                    setShowProfile(false);
                    setShowChangePassword(true);
                  }}
                >
                  <span className="admin-profile-option-icon">🔒</span>
                  <div>
                    <div className="admin-profile-option-title">Change Password</div>
                    <div className="admin-profile-option-sub">Update your login password</div>
                  </div>
                  <span className="admin-profile-option-arrow">›</span>
                </button>
                <button
                  className="admin-profile-option admin-profile-option-danger"
                  onClick={handleLogout}
                >
                  <span className="admin-profile-option-icon">↩</span>
                  <div>
                    <div className="admin-profile-option-title">Logout</div>
                    <div className="admin-profile-option-sub">Sign out of admin panel</div>
                  </div>
                  <span className="admin-profile-option-arrow">›</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================= CHANGE PASSWORD MODAL ================= */}
      {showChangePassword && (
        <div className="admin-modal-overlay" onClick={() => setShowChangePassword(false)}>
          <div className="admin-modal" onClick={(e) => e.stopPropagation()}>
            <div className="admin-modal-header">
              <h2 className="admin-modal-title">Change Password</h2>
              <button className="admin-modal-close" onClick={() => setShowChangePassword(false)}>
                ✕
              </button>
            </div>
            <form className="admin-form" onSubmit={handleChangePassword}>
              {passwordError && <div className="admin-pw-error">⚠ {passwordError}</div>}
              <div className="admin-form-field">
                <label>Current Password</label>
                <input
                  type="password"
                  required
                  value={passwordForm.current}
                  onChange={(e) =>
                    setPasswordForm({
                      ...passwordForm,
                      current: e.target.value,
                    })
                  }
                />
              </div>
              <div className="admin-form-field">
                <label>New Password</label>
                <input
                  type="password"
                  required
                  value={passwordForm.newPass}
                  onChange={(e) =>
                    setPasswordForm({
                      ...passwordForm,
                      newPass: e.target.value,
                    })
                  }
                />
              </div>
              <div className="admin-form-field">
                <label>Confirm Password</label>
                <input
                  type="password"
                  required
                  value={passwordForm.confirm}
                  onChange={(e) =>
                    setPasswordForm({
                      ...passwordForm,
                      confirm: e.target.value,
                    })
                  }
                />
              </div>
              <div className="admin-form-actions">
                <button type="button" className="admin-cancel-btn" onClick={() => setShowChangePassword(false)}>
                  Cancel
                </button>
                <button type="submit" className="admin-submit-btn">
                  Update Password
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminDashboard;