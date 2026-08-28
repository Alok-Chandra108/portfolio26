import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { aboutService } from "../../firebase/aboutService";
import { gsap, useGSAP } from "../../utils/gsapPlugins";
import "../../styles/admin.css";

const AdminAbout = () => {
  const { logout } = useAuth();
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [formError, setFormError] = useState("");
  const [formSuccess, setFormSuccess] = useState("");
  const formRef = useRef(null);
  const fileInputRef = useRef(null);

  const defaultPhoto = "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80";
  const defaultHeading = "I build robust infrastructure, because downtime is bad";
  const defaultBio1 = "I'm a Cloud & DevOps enthusiast with a passion for architecting resilient, scalable systems. My journey started with a curiosity for how servers and networks operate, and it has evolved into a career dedicated to automating deployments and building secure, reliable cloud infrastructure.";
  const defaultBio2 = "I specialize in AWS, CI/CD pipelines, containerization, and Infrastructure as Code. When I'm not configuring clusters or writing automation scripts, you'll find me reading about system architecture, exploring new cloud services, or contributing to open-source tools.";

  const [formData, setFormData] = useState({
    photoUrl: defaultPhoto,
    heading: defaultHeading,
    bio1: defaultBio1,
    bio2: defaultBio2,
  });

  const { contextSafe } = useGSAP({ scope: formRef });

  useEffect(() => {
    fetchAboutData();
  }, []);

  const fetchAboutData = async () => {
    setLoading(true);
    try {
      const data = await aboutService.getAboutData();
      if (data) {
        setFormData({
          photoUrl: data.photoUrl || defaultPhoto,
          heading: data.heading || defaultHeading,
          bio1: data.bio1 || defaultBio1,
          bio2: data.bio2 || defaultBio2,
        });
      }
    } catch (error) {
      console.error("Error fetching about data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ 
      ...prev, 
      [name]: value 
    }));
  };

  const handleFileSelect = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setFormError("Please select a valid image file.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setFormError("File size must be under 5MB.");
      return;
    }

    setUploadingImage(true);
    setFormError("");
    setUploadProgress(0);
    
    try {
      const url = await aboutService.uploadImage(file, (progress) => {
        setUploadProgress(progress);
      });
      setFormData(prev => ({ ...prev, photoUrl: url }));
      setFormSuccess("Image uploaded successfully!");
      setTimeout(() => setFormSuccess(""), 2000);
    } catch (error) {
      setFormError(error.message || "Failed to upload image.");
    } finally {
      setUploadingImage(false);
      setUploadProgress(0);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError("");
    setFormSuccess("");
    setIsSaving(true);

    if (!formData.heading || !formData.bio1) {
      setFormError("Please fill in the required fields (Heading and Bio 1).");
      setIsSaving(false);
      return;
    }

    try {
      await aboutService.updateAboutData(formData);
      setFormSuccess("About data saved successfully!");
      
      const animateSuccess = contextSafe(() => {
        gsap.fromTo(".success-banner", 
          { y: -20, opacity: 0 }, 
          { y: 0, opacity: 1, duration: 0.5, ease: "back.out" }
        );
      });
      animateSuccess();

      setTimeout(() => {
        setFormSuccess("");
      }, 3000);
    } catch (error) {
      setFormError("Failed to save about data.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="admin-page">
      <div className="admin-dashboard">
        <header className="dashboard-header">
          <div>
            <Link to="/admin" className="btn-back">
              <span>←</span> Back to Dashboard
            </Link>
            <h1 className="dashboard-title">Edit About Section</h1>
            <p>Update your photo, heading, and bio.</p>
          </div>
          <button onClick={logout} className="btn-logout">Logout</button>
        </header>

        <section className="admin-content" style={{ display: "grid", gridTemplateColumns: "1fr", gap: "40px", maxWidth: "800px" }}>
          
          <div className="admin-card" ref={formRef}>
            {loading ? (
              <p style={{ textAlign: "center", padding: "40px", color: "var(--color-muted)" }}>Loading data...</p>
            ) : (
              <>
                <h2 style={{ marginBottom: "20px" }}>About Me Settings</h2>
                
                {formError && <div className="error-message">{formError}</div>}
                {formSuccess && <div className="success-banner" style={{ background: "rgba(184, 255, 0, 0.1)", borderLeft: "4px solid var(--color-accent)", padding: "12px", marginBottom: "20px", color: "var(--color-dark)", fontSize: "0.9rem", fontWeight: "600", borderRadius: "4px" }}>{formSuccess}</div>}

                <form onSubmit={handleSubmit}>
                  <div className="form-group" style={{ display: "flex", gap: "20px", alignItems: "flex-start" }}>
                    <div style={{ flex: 1 }}>
                      <label>Photo URL *</label>
                      <div style={{ display: "flex", gap: "10px", marginBottom: "10px" }}>
                        <input 
                          type="text" 
                          name="photoUrl" 
                          className="form-input" 
                          value={formData.photoUrl} 
                          onChange={handleInputChange} 
                          placeholder="Direct image URL"
                          style={{ flex: 1 }}
                        />
                        <input 
                          type="file"
                          accept="image/*"
                          style={{ display: "none" }}
                          ref={fileInputRef}
                          onChange={handleFileSelect}
                        />
                        <button 
                          type="button" 
                          className="btn-manage" 
                          onClick={() => fileInputRef.current?.click()}
                          disabled={uploadingImage}
                          style={{ whiteSpace: "nowrap" }}
                        >
                          {uploadingImage ? `${Math.round(uploadProgress)}%` : "Upload Image"}
                        </button>
                      </div>
                    </div>
                    <div style={{ width: "120px", height: "120px", flexShrink: 0, borderRadius: "8px", overflow: "hidden", border: "1px solid rgba(0,0,0,0.1)", background: "#f5f5f5" }}>
                      {formData.photoUrl && (
                        <img 
                          src={formData.photoUrl} 
                          alt="Preview" 
                          style={{ width: "100%", height: "100%", objectFit: "cover" }} 
                        />
                      )}
                    </div>
                  </div>

                  <div className="form-group">
                    <label>Heading *</label>
                    <input 
                      type="text" 
                      name="heading" 
                      className="form-input" 
                      value={formData.heading} 
                      onChange={handleInputChange} 
                      placeholder="I build robust infrastructure..."
                    />
                  </div>

                  <div className="form-group">
                    <label>Bio Paragraph 1 *</label>
                    <textarea 
                      name="bio1" 
                      className="form-input" 
                      value={formData.bio1} 
                      onChange={handleInputChange} 
                      rows={4}
                      style={{ resize: "vertical", fontFamily: "inherit" }}
                    />
                  </div>

                  <div className="form-group">
                    <label>Bio Paragraph 2 (Optional)</label>
                    <textarea 
                      name="bio2" 
                      className="form-input" 
                      value={formData.bio2} 
                      onChange={handleInputChange} 
                      rows={4}
                      style={{ resize: "vertical", fontFamily: "inherit" }}
                    />
                  </div>

                  <div style={{ display: "flex", gap: "10px", marginTop: "30px" }}>
                    <button type="submit" className="login-button" disabled={isSaving || uploadingImage}>
                      {isSaving ? "Saving..." : "Save About Settings"}
                    </button>
                  </div>
                </form>
              </>
            )}
          </div>

        </section>
      </div>
    </div>
  );
};

export default AdminAbout;
