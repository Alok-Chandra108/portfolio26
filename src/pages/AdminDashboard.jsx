import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import "../styles/admin.css";

const AdminDashboard = () => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  async function handleLogout() {
    try {
      await logout();
      navigate("/");
    } catch (err) {
      console.error("Failed to log out", err);
    }
  }

  return (
    <div className="admin-page">
      <div className="admin-dashboard">
        <header className="dashboard-header">
          <div>
            <h1 className="dashboard-title">Dashboard</h1>
            <p>Welcome back, {currentUser?.email}</p>
          </div>
          <button onClick={handleLogout} className="btn-logout">
            Logout
          </button>
        </header>

        <div className="admin-grid">
          <div className="admin-card">
            <h3>Portfolio Items</h3>
            <p>Manage your projects, descriptions, and tags.</p>
            <Link to="/admin/projects" className="btn-manage" style={{ textDecoration: 'none' }}>Manage Projects</Link>
          </div>

          <div className="admin-card">
            <h3>Experience</h3>
            <p>Update your professional journey and timeline.</p>
            <Link to="/admin/experience" className="btn-manage" style={{ textDecoration: 'none' }}>Edit Experience</Link>
          </div>

          <div className="admin-card">
            <h3>Capabilities</h3>
            <p>List your skills and technical expertise.</p>
            <Link to="/admin/skills" className="btn-manage" style={{ textDecoration: 'none' }}>Update Skills</Link>
          </div>

          <div className="admin-card">
            <h3>My Reads</h3>
            <p>Add, edit, or remove books and update reading status.</p>
            <Link to="/admin/reads" className="btn-manage" style={{ textDecoration: 'none' }}>Manage Books</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
