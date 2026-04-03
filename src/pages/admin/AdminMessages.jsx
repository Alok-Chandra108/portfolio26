import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { messagesService } from "../../firebase/messagesService";
import { gsap } from "../../utils/gsapPlugins";
import "../../styles/admin.css";

const AdminMessages = () => {
  const { logout } = useAuth();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    setLoading(true);
    try {
      const data = await messagesService.getMessages();
      setMessages(data);
      
      // Animate items once loaded
      gsap.from(".message-item", {
        y: 20,
        opacity: 0,
        duration: 0.6,
        stagger: 0.1,
        ease: "power2.out",
        delay: 0.2
      });
    } catch (error) {
      console.error("Error fetching messages:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (id) => {
    try {
      await messagesService.markAsRead(id);
      setMessages(messages.map(m => m.id === id ? { ...m, status: 'read' } : m));
    } catch (error) {
      alert("Failed to update message status.");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this message?")) {
      try {
        await messagesService.deleteMessage(id);
        setMessages(messages.filter(m => m.id !== id));
      } catch (error) {
        alert("Failed to delete message.");
      }
    }
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return "";
    const date = timestamp.toDate();
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric', 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return (
    <div className="admin-page">
      <div className="admin-dashboard">
        <header className="dashboard-header">
          <div>
            <Link to="/admin" className="btn-back">
              <span>←</span> Back to Dashboard
            </Link>
            <h1 className="dashboard-title">Inbox</h1>
            <p>Read and manage messages from your contact form.</p>
          </div>
          <button onClick={logout} className="btn-logout">Logout</button>
        </header>

        <section className="admin-content">
          <div className="messages-list">
            {loading ? (
              <p style={{ textAlign: "center", padding: "40px", color: "var(--color-muted)" }}>Loading messages...</p>
            ) : messages.length === 0 ? (
              <div style={{ textAlign: "center", padding: "100px", background: "white", borderRadius: "15px", border: "1px dashed rgba(0,0,0,0.1)" }}>
                <h3 style={{ color: "var(--color-muted)", marginBottom: "10px" }}>Your inbox is empty</h3>
                <p style={{ color: "var(--color-muted)" }}>When people contact you via the site, their messages will appear here.</p>
              </div>
            ) : (
              messages.map((message) => (
                <div 
                  key={message.id} 
                  className={`admin-card message-item ${message.status === 'unread' ? 'message-item--unread' : ''}`}
                >
                  <div className="message-header">
                    <div>
                      <div className="message-sender">{message.name}</div>
                      <div className="message-date" style={{ color: "var(--color-accent)", fontWeight: "600", fontSize: "0.75rem", marginBottom: "4px" }}>
                        {message.email}
                      </div>
                      <div className="message-date">{formatDate(message.createdAt)}</div>
                    </div>
                    {message.status === 'unread' && (
                      <span style={{ background: "var(--color-accent)", padding: "4px 8px", borderRadius: "4px", fontSize: "0.6rem", fontWeight: "800", color: "var(--color-dark)" }}>NEW</span>
                    )}
                  </div>
                  
                  <div className="message-body">
                    {message.message}
                  </div>

                  <div className="message-actions">
                    {message.status === 'unread' && (
                      <button onClick={() => handleMarkAsRead(message.id)} className="btn-action btn-action--read">Mark as Read</button>
                    )}
                    <button onClick={() => handleDelete(message.id)} className="btn-action btn-action--delete">Delete</button>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>
      </div>
    </div>
  );
};

export default AdminMessages;
