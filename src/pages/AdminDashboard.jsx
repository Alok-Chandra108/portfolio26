import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { subscribeToStatus, updateStatus } from "../firebase/statusService";
import "../styles/admin.css";

const AdminDashboard = () => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const unsubscribe = subscribeToStatus((data) => {
      setStatus(data);
    });
    return () => unsubscribe();
  }, []);

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

          <div className="admin-card">
            <h3>Inbox</h3>
            <p>View and manage messages from your contact form.</p>
            <Link to="/admin/messages" className="btn-manage" style={{ textDecoration: 'none' }}>View Messages</Link>
          </div>

          <div className="admin-card">
            <h3>About Me</h3>
            <p>Update your profile photo, heading, and bio.</p>
            <Link to="/admin/about" className="btn-manage" style={{ textDecoration: 'none' }}>Edit About</Link>
          </div>

          <div className="admin-card status-card">
            <h3>Live Availability</h3>
            <p>Show visitors if you are open for new projects or currently deep in work.</p>
            
            <div className="status-toggle-wrap">
              <div className={`status-indicator ${status?.state}`}></div>
              <span className="status-text">
                Current: <strong>{status?.state === 'open' ? 'Open for Work' : 'Busy with Project'}</strong>
              </span>
            </div>

            <div className="admin-actions">
              <button 
                disabled={loading}
                onClick={async () => {
                  setLoading(true);
                  await updateStatus('open');
                  setLoading(false);
                }}
                className={`btn-status open ${status?.state === 'open' ? 'active' : ''}`}
              >
                Set Open
              </button>
              <button 
                disabled={loading}
                onClick={async () => {
                  setLoading(true);
                  await updateStatus('busy');
                  setLoading(false);
                }}
                className={`btn-status busy ${status?.state === 'busy' ? 'active' : ''}`}
              >
                Set Busy
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
