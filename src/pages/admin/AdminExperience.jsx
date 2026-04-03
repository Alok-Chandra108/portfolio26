import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import "../../styles/admin.css";

const AdminExperience = () => {
  const { logout } = useAuth();

  return (
    <div className="admin-page">
      <div className="admin-dashboard">
        <header className="dashboard-header">
          <div>
            <Link to="/admin" className="btn-back">
              <span>←</span> Back to Dashboard
            </Link>
            <h1 className="dashboard-title">Edit Experience</h1>
            <p>Coming Soon: Update your professional journey.</p>
          </div>
          <button onClick={logout} className="btn-logout">Logout</button>
        </header>

        <section className="admin-content">
          <div className="projects-list" style={{ background: "white", borderRadius: "var(--radius-card)", padding: "20px", border: "1px solid rgba(0,0,0,0.05)" }}>
            <p style={{ color: "var(--color-muted)", textAlign: "center", padding: "40px" }}>
              Experience timeline manager is under construction.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
};

export default AdminExperience;
