import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./innerpages.css";

const API = "http://localhost:5000";

function AdminDashboard() {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [toast, setToast] = useState(null);
  const [showProfile, setShowProfile] = useState(false);
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [passwordForm, setPasswordForm] = useState({ current: "", newPass: "", confirm: "" });
  const [passwordError, setPasswordError] = useState("");

  const adminEmail = localStorage.getItem("adminEmail") || "admin@dwelledge.com";
  const token = localStorage.getItem("token");

  const emptyForm = { title: "", department: "", location: "", type: "Full-time", description: "", requirements: "" };
  const [form, setForm] = useState(emptyForm);

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };


  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const res = await fetch(`${API}/careers`);
      const data = await res.json();

      setJobs(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false); // ✅ IMPORTANT
    }
  };


  const handleAdd = async (e) => {
    e.preventDefault();

    try {
      const newJob = {
        jobTitle: form.title,
        requiredSkills: form.requirements,
        description: form.description,
        department: form.department,
        location: form.location,
        type: form.type,
        isActive: true
      };

      const res = await fetch(`${API}/careers`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(newJob)
      });

      if (!res.ok) throw new Error("Failed to add job");

      showToast("Job added successfully");

      setShowForm(false);
      setForm(emptyForm);

      fetchJobs(); // ✅ REFRESH DATA

    } catch (err) {
      showToast(err.message, "error");
    }
  };


  const handleDelete = async (id) => {
    try {
      const res = await fetch(`${API}/careers/${id}`, {
        method: "DELETE"
      });

      if (!res.ok) throw new Error("Failed to delete");

      setJobs(jobs.filter((j) => j._id !== id));
      setDeleteConfirm(null);

      showToast("Job deleted");

    } catch (err) {
      showToast(err.message, "error");
    }
  };

  const handleToggle = async (id) => {
    const job = jobs.find((j) => j._id === id);

    try {
      const res = await fetch(`${API}/careers/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ isActive: !job.isActive })
      });

      const updated = await res.json();

      setJobs(jobs.map((j) => (j._id === id ? updated : j)));

      showToast("Status updated");

    } catch (err) {
      showToast(err.message, "error");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("adminEmail");
    navigate("/login");
  };

  const handleChangePassword = (e) => {
    e.preventDefault();
    setPasswordError("");
    if (passwordForm.newPass !== passwordForm.confirm) {
      setPasswordError("New passwords do not match.");
      return;
    }
    if (passwordForm.newPass.length < 6) {
      setPasswordError("Password must be at least 6 characters.");
      return;
    }

    showToast("Password changed successfully!");
    setShowChangePassword(false);
    setPasswordForm({ current: "", newPass: "", confirm: "" });
  };


  const activeJobs = jobs.filter((j) => j.isActive).length;

  return (
    <div className="admin-page">
      {toast && (
        <div className={`admin-toast ${toast.type === "error" ? "admin-toast-error" : ""}`}>
          {toast.type === "error" ? "⚠" : "✓"} {toast.msg}
        </div>
      )}


      <aside className="admin-sidebar">
        <div className="admin-sidebar-top">
          <div className="admin-logo">
            <span className="admin-logo-mark">D</span>
            <div>
              <div className="admin-logo-name">DWELLEDGE</div>
              <div className="admin-logo-sub">Admin Panel</div>
            </div>
          </div>
          <nav className="admin-nav">
            <div className="admin-nav-item admin-nav-active">
              <span>💼</span> Job Listings
            </div>
          </nav>
        </div>

        <div className="admin-sidebar-bottom">
          <div className="admin-user-card" onClick={() => setShowProfile(true)} style={{ cursor: "pointer" }}>
            <div className="admin-user-avatar">{adminEmail.charAt(0).toUpperCase()}</div>
            <div className="admin-user-info">
              <div className="admin-user-email">{adminEmail}</div>
              <div className="admin-user-role">Administrator</div>
            </div>
            <span className="admin-profile-arrow">›</span>
          </div>
          <button className="admin-logout-btn" onClick={handleLogout}>↩ Logout</button>
        </div>
      </aside>


      <main className="admin-main">
        <div className="admin-header">
          <div>
            <p className="admin-header-eyebrow">ADMIN DASHBOARD</p>
            <h1 className="admin-header-title">Job Opportunities</h1>
          </div>
          <button className="admin-add-btn" onClick={() => setShowForm(true)}>+ Add New Job</button>
        </div>


        <div className="admin-stats">
          {[
            { label: "Total Jobs", value: jobs.length, icon: "📋" },
            { label: "Active", value: activeJobs, icon: "✅" },
            { label: "Inactive", value: jobs.length - activeJobs, icon: "⏸" },
          ].map((s, i) => (
            <div className="admin-stat-card" key={i}>
              <span className="admin-stat-icon">{s.icon}</span>
              <div className="admin-stat-value">{s.value}</div>
              <div className="admin-stat-label">{s.label}</div>
            </div>
          ))}
        </div>


        <div className="admin-table-wrapper">
          <div className="admin-table-header">
            <h2 className="admin-table-title">All Listings</h2>

            <button
              className="admin-add-btn"
              onClick={() => setShowForm(true)}
            >
              + Add New Job
            </button>
          </div>

          {loading ? (
            <div className="admin-empty">
              <p>Loading jobs...</p>
            </div>
          ) : jobs.length === 0 ? (
            <div className="admin-empty">
              <div className="admin-empty-icon">💼</div>
              <p>No jobs yet. Add your first listing!</p>
            </div>
          ) : (
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Job Title</th>
                  <th>Department</th>
                  <th>Location</th>
                  <th>Type</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {jobs.map((job) => (
                  <tr key={job._id} className={!job.isActive ? "admin-row-inactive" : ""}>
                    <td>

                      <div className="admin-job-title">{job.jobTitle || job.title}</div>
                      <div className="admin-job-desc">{(job.description || "").substring(0, 60)}...</div>
                    </td>
                    <td><span className="admin-dept-tag">{job.department}</span></td>
                    <td>{job.location}</td>
                    <td><span className="admin-type-tag">{job.type}</span></td>
                    <td>
                      <button
                        className={`admin-status-btn ${job.isActive ? "active" : "inactive"}`}
                        onClick={() => handleToggle(job._id)}
                      >
                        {job.isActive ? "● Active" : "○ Inactive"}
                      </button>
                    </td>
                    <td>
                      <button className="admin-delete-btn" onClick={() => setDeleteConfirm(job._id)}>
                        🗑 Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </main>


      {showProfile && (
        <div className="admin-modal-overlay" onClick={() => setShowProfile(false)}>
          <div className="admin-modal admin-profile-modal" onClick={(e) => e.stopPropagation()}>
            <div className="admin-modal-header">
              <h2 className="admin-modal-title">My Profile</h2>
              <button className="admin-modal-close" onClick={() => setShowProfile(false)}>✕</button>
            </div>
            <div className="admin-profile-body">
              <div className="admin-profile-avatar">{adminEmail.charAt(0).toUpperCase()}</div>
              <div className="admin-profile-email">{adminEmail}</div>
              <div className="admin-profile-role">Administrator</div>
              <div className="admin-profile-options">
                <button
                  className="admin-profile-option"
                  onClick={() => { setShowProfile(false); setShowChangePassword(true); }}
                >
                  <span className="admin-profile-option-icon">🔒</span>
                  <div>
                    <div className="admin-profile-option-title">Change Password</div>
                    <div className="admin-profile-option-sub">Update your login password</div>
                  </div>
                  <span className="admin-profile-option-arrow">›</span>
                </button>
                <button className="admin-profile-option" onClick={() => { showToast("Session info copied!"); }}>
                  <span className="admin-profile-option-icon">📋</span>
                  <div>
                    <div className="admin-profile-option-title">Account Info</div>
                    <div className="admin-profile-option-sub">Role: Administrator</div>
                  </div>
                  <span className="admin-profile-option-arrow">›</span>
                </button>
                <button
                  className="admin-profile-option admin-profile-option-danger"
                  onClick={() => { setShowProfile(false); handleLogout(); }}
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


      {showChangePassword && (
        <div className="admin-modal-overlay" onClick={() => setShowChangePassword(false)}>
          <div className="admin-modal" onClick={(e) => e.stopPropagation()}>
            <div className="admin-modal-header">
              <h2 className="admin-modal-title">Change Password</h2>
              <button className="admin-modal-close" onClick={() => setShowChangePassword(false)}>✕</button>
            </div>
            <form className="admin-form" onSubmit={handleChangePassword}>
              <div className="admin-form-field">
                <label>Current Password</label>
                <input type="password" placeholder="Enter current password" value={passwordForm.current}
                  onChange={e => setPasswordForm({ ...passwordForm, current: e.target.value })} required />
              </div>
              <div className="admin-form-field">
                <label>New Password</label>
                <input type="password" placeholder="Enter new password" value={passwordForm.newPass}
                  onChange={e => setPasswordForm({ ...passwordForm, newPass: e.target.value })} required />
              </div>
              <div className="admin-form-field">
                <label>Confirm New Password</label>
                <input type="password" placeholder="Confirm new password" value={passwordForm.confirm}
                  onChange={e => setPasswordForm({ ...passwordForm, confirm: e.target.value })} required />
              </div>
              {passwordError && <div className="admin-pw-error">⚠ {passwordError}</div>}
              <div className="admin-form-actions">
                <button type="button" className="admin-cancel-btn" onClick={() => setShowChangePassword(false)}>Cancel</button>
                <button type="submit" className="admin-submit-btn">Update Password →</button>
              </div>
            </form>
          </div>
        </div>
      )}


      {showForm && (
        <div className="admin-modal-overlay" onClick={() => setShowForm(false)}>
          <div className="admin-modal" onClick={(e) => e.stopPropagation()}>
            <div className="admin-modal-header">
              <h2 className="admin-modal-title">Add New Job</h2>
              <button className="admin-modal-close" onClick={() => setShowForm(false)}>✕</button>
            </div>
            <form className="admin-form" onSubmit={handleAdd}>
              <div className="admin-form-row">
                <div className="admin-form-field">
                  <label>Job Title *</label>
                  <input type="text" placeholder="e.g. Senior React Developer" value={form.title}
                    onChange={e => setForm({ ...form, title: e.target.value })} required />
                </div>
                <div className="admin-form-field">
                  <label>Department *</label>
                  <input type="text" placeholder="e.g. Engineering" value={form.department}
                    onChange={e => setForm({ ...form, department: e.target.value })} required />
                </div>
              </div>
              <div className="admin-form-row">
                <div className="admin-form-field">
                  <label>Location *</label>
                  <input type="text" placeholder="e.g. Hyderabad / Remote" value={form.location}
                    onChange={e => setForm({ ...form, location: e.target.value })} required />
                </div>
                <div className="admin-form-field">
                  <label>Job Type</label>
                  <select value={form.type} onChange={e => setForm({ ...form, type: e.target.value })}>
                    <option>Full-time</option>
                    <option>Part-time</option>
                    <option>Contract</option>
                    <option>Remote</option>
                  </select>
                </div>
              </div>
              <div className="admin-form-field">
                <label>Description *</label>
                <textarea rows={4} placeholder="Describe the role..." value={form.description}
                  onChange={e => setForm({ ...form, description: e.target.value })} required />
              </div>
              <div className="admin-form-field">
                <label>Requirements <span>(comma separated)</span></label>
                <input type="text" placeholder="e.g. React, Node.js, 3+ years" value={form.requirements}
                  onChange={e => setForm({ ...form, requirements: e.target.value })} />
              </div>
              <div className="admin-form-actions">
                <button type="button" className="admin-cancel-btn" onClick={() => setShowForm(false)}>Cancel</button>
                <button type="submit" className="admin-submit-btn">Add Job →</button>
              </div>
            </form>
          </div>
        </div>
      )}


      {deleteConfirm && (
        <div className="admin-modal-overlay" onClick={() => setDeleteConfirm(null)}>
          <div className="admin-modal admin-modal-sm" onClick={(e) => e.stopPropagation()}>
            <div className="admin-delete-icon">🗑</div>
            <h3 className="admin-delete-title">Delete this job?</h3>
            <p className="admin-delete-sub">This action cannot be undone.</p>
            <div className="admin-form-actions">
              <button className="admin-cancel-btn" onClick={() => setDeleteConfirm(null)}>Cancel</button>
              <button className="admin-confirm-delete-btn" onClick={() => handleDelete(deleteConfirm)}>Yes, Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminDashboard;