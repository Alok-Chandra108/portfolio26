import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
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
            <div className="btn-manage">Manage Projects</div>
          </div>

          <div className="admin-card">
            <h3>Experience</h3>
            <p>Update your professional journey and timeline.</p>
            <div className="btn-manage">Edit Experience</div>
          </div>

          <div className="admin-card">
            <h3>Capabilities</h3>
            <p>List your skills and technical expertise.</p>
            <div className="btn-manage">Update Skills</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
