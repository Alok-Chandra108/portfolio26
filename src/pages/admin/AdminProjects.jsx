import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import "../../styles/admin.css";

const AdminProjects = () => {
  const { logout } = useAuth();

  return (
    <div className="admin-page">
      <div className="admin-dashboard">
        <header className="dashboard-header">
          <div>
            <Link to="/admin" style={{ color: "var(--color-muted)", fontSize: "0.9rem", textDecoration: "none", marginBottom: "10px", display: "inline-block" }}>
              ← Back to Dashboard
            </Link>
            <h1 className="dashboard-title">Manage Projects</h1>
            <p>Add, edit, or delete your portfolio pieces.</p>
          </div>
          <button onClick={logout} className="btn-logout">
            Logout
          </button>
        </header>

        <section className="admin-content">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "30px" }}>
            <h2>Your Projects</h2>
            <button className="btn-manage" style={{ padding: "12px 24px", fontSize: "1rem", border: "none" }}>
              + Add New Project
            </button>
          </div>

          <div className="projects-list" style={{ background: "white", borderRadius: "var(--radius-card)", padding: "20px", border: "1px solid rgba(0,0,0,0.05)" }}>
            <p style={{ color: "var(--color-muted)", textAlign: "center", padding: "40px" }}>
              Loading projects from Firebase...
            </p>
          </div>
        </section>
      </div>
    </div>
  );
};

export default AdminProjects;
