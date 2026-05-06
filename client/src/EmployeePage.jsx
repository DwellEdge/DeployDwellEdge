import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./innerpages.css";

const API = "http://localhost:5001";

function EmployeePage() {
    const [employees, setEmployees] = useState([]);
    const [showProfile, setShowProfile] = useState(false); // ✅ FIX
    const navigate = useNavigate();

    // ✅ FIX: define adminEmail
    const storedEmail = localStorage.getItem("adminEmail");

    const adminEmail =
        storedEmail && storedEmail !== "undefined"
            ? storedEmail
            : "admin@dwelledge.com";

    // ✅ FIX: logout function
    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("adminEmail");
        navigate("/login");
    };

    // 🔥 FETCH DATA
    useEffect(() => {
        fetch(`${API}/api/employees`)
            .then((res) => res.json())
            .then((data) => {
                console.log("EMP DATA:", data);
                setEmployees(Array.isArray(data) ? data : []);
            })
            .catch((err) => console.error(err));
    }, []);

    // 🗑 DELETE
    const handleDelete = async (id) => {
        await fetch(`${API}/api/employees/${id}`, { method: "DELETE" });
        setEmployees(employees.filter((e) => e._id !== id));
    };

    return (
        <div className="admin-page">

            {/* ===== SIDEBAR ===== */}
            <aside className="admin-sidebar">

                {/* TOP SECTION */}
                <div>
                    <div className="admin-logo">
                        <span className="admin-logo-mark">D</span>
                        <div>
                            <div className="admin-logo-name">DWELLEDGE</div>
                            <div className="admin-logo-sub">Admin Panel</div>
                        </div>
                    </div>

                    <div className="admin-nav">
                        <div
                            className={`admin-nav-item ${window.location.pathname === "/admin" ? "admin-nav-active" : ""}`}
                            onClick={() => navigate("/admin")}
                        >
                            💼 Job Listings
                        </div>

                        <div
                            className={`admin-nav-item ${window.location.pathname === "/admin/employees" ? "admin-nav-active" : ""}`}
                            onClick={() => navigate("/admin/employees")}
                        >
                            👨‍💼 Employees
                        </div>

                        <div
                            className={`admin-nav-item ${window.location.pathname === "/admin/founders" ? "admin-nav-active" : ""}`}
                            onClick={() => navigate("/admin/founders")}
                        >
                            🏢 Founders
                        </div>
                    </div>
                </div>

                {/* BOTTOM SECTION */}
                <div>
                    <div
                        className="admin-user-card"
                        onClick={() => setShowProfile(true)}
                        style={{ cursor: "pointer" }}
                    >
                        <div className="admin-user-avatar">
                            {adminEmail?.charAt(0).toUpperCase()}
                        </div>
                        <div>
                            <div className="admin-user-email">{adminEmail}</div>
                            <div className="admin-user-role">Administrator</div>
                        </div>
                        <span className="admin-profile-arrow">›</span>
                    </div>

                    <button className="admin-logout-btn" onClick={handleLogout}>
                        ↩ Logout
                    </button>
                </div>

            </aside>

            {showProfile && (
                <div className="admin-modal-overlay" onClick={() => setShowProfile(false)}>
                    <div
                        className="admin-modal admin-profile-modal"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="admin-modal-header">
                            <h2 className="admin-modal-title">My Profile</h2>
                            <button
                                className="admin-modal-close"
                                onClick={() => setShowProfile(false)}
                            >
                                ✕
                            </button>
                        </div>

                        <div className="admin-profile-body">
                            <div className="admin-profile-avatar">
                                {adminEmail.charAt(0).toUpperCase()}
                            </div>

                            <div className="admin-profile-email">{adminEmail}</div>
                            <div className="admin-profile-role">Administrator</div>

                            <div className="admin-profile-options">
                                <button className="admin-profile-option">
                                    <span className="admin-profile-option-icon">🔒</span>
                                    <div>
                                        <div className="admin-profile-option-title">
                                            Change Password
                                        </div>
                                        <div className="admin-profile-option-sub">
                                            Update your login password
                                        </div>
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
                                        <div className="admin-profile-option-sub">
                                            Sign out of admin panel
                                        </div>
                                    </div>
                                    <span className="admin-profile-option-arrow">›</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            {/* ===== MAIN ===== */}
            <main className="admin-main">
                <div className="admin-header">
                    <div>
                        <p className="admin-header-eyebrow">ADMIN DASHBOARD</p>
                        <h1 className="admin-header-title">Employee Management</h1>
                    </div>
                </div>

                <div className="admin-table-wrapper">
                    <h2 className="admin-table-title">All Employees</h2>

                    {employees.length === 0 ? (
                        <div className="admin-empty">
                            <p>No employees found</p>
                        </div>
                    ) : (
                        <table className="admin-table">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Code</th>
                                    <th>First Name</th>
                                    <th>Last Name</th>
                                    <th>Email</th>
                                    <th>Mobile</th>
                                    <th>DOB</th>
                                    <th>DOJ</th>
                                    <th>Designation</th>
                                    <th>Type</th>
                                    <th>Location</th>
                                    <th>Status</th>
                                    <th>Exit</th>
                                    <th>Created</th>
                                    <th>Updated</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>

                            <tbody>
                                {employees.map((emp) => (
                                    <tr key={emp._id}>
                                        <td>{emp._id?.slice(-5)}</td>
                                        <td>{emp.employee_code}</td>
                                        <td>{emp.first_name}</td>
                                        <td>{emp.last_name}</td>
                                        <td>{emp.email_id}</td>
                                        <td>{emp.mobile_number}</td>
                                        <td>{emp.date_of_birth?.slice(0, 10)}</td>
                                        <td>{emp.date_of_joining?.slice(0, 10)}</td>
                                        <td>{emp.designation}</td>
                                        <td>{emp.employment_type}</td>
                                        <td>{emp.work_location}</td>
                                        <td>{emp.status}</td>
                                        <td>{emp.date_of_exit?.slice(0, 10) || "-"}</td>
                                        <td>{emp.created_date?.slice(0, 10)}</td>
                                        <td>{emp.updated_date?.slice(0, 10)}</td>

                                        <td>
                                            <button
                                                className="admin-delete-btn"
                                                onClick={() => handleDelete(emp._id)}
                                            >
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
        </div>
    );
}

export default EmployeePage;