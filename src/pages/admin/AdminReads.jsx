import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import "../../styles/admin.css";

const AdminReads = () => {
  const { logout } = useAuth();

  return (
    <div className="admin-page">
      <div className="admin-dashboard">
        <header className="dashboard-header">
          <div>
            <Link to="/admin" style={{ color: "var(--color-muted)", fontSize: "0.9rem", textDecoration: "none", marginBottom: "10px", display: "inline-block" }}>
              ← Back to Dashboard
            </Link>
            <h1 className="dashboard-title">Manage Books</h1>
            <p>Add, edit, or remove books and update reading status.</p>
          </div>
          <button onClick={logout} className="btn-logout">Logout</button>
        </header>

        <section className="admin-content">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "30px" }}>
            <h2>Your Reading List</h2>
            <button className="btn-manage" style={{ padding: "12px 24px", fontSize: "1rem", border: "none" }}>
              + Add New Book
            </button>
          </div>

          <div className="projects-list" style={{ background: "white", borderRadius: "var(--radius-card)", padding: "20px", border: "1px solid rgba(0,0,0,0.05)" }}>
            <p style={{ color: "var(--color-muted)", textAlign: "center", padding: "40px" }}>
              Books manager is under construction. It will connect to Firebase soon.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
};

export default AdminReads;
