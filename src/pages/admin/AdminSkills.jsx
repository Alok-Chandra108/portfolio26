import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { skillsService } from "../../firebase/skillsService";
import { gsap } from "../../utils/gsapPlugins";
import "../../styles/admin.css";

const DEFAULT_SKILLS = [
  { name: 'AWS', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/amazonwebservices/amazonwebservices-original.svg' },
  { name: 'GCP', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/googlecloud/googlecloud-original.svg' },
  { name: 'Terraform', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/terraform/terraform-original.svg' },
  { name: 'Docker', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg' },
  { name: 'Kubernetes', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/kubernetes/kubernetes-plain.svg' },
];

const AdminSkills = () => {
  const { logout } = useAuth();
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [currentSkill, setCurrentSkill] = useState(null);
  const [selectedIds, setSelectedIds] = useState([]);
  const [formError, setFormError] = useState("");
  const [formSuccess, setFormSuccess] = useState("");
  const formRef = useRef(null);

  const [formData, setFormData] = useState({
    name: "",
    logoUrl: ""
  });

  useEffect(() => {
    fetchSkills();
  }, []);

  const fetchSkills = async () => {
    setLoading(true);
    try {
      const data = await skillsService.getSkills();
      setSkills(data);
    } catch (error) {
      console.error("Error fetching skills:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const resetForm = () => {
    setFormData({ name: "", logoUrl: "" });
    setIsEditing(false);
    setCurrentSkill(null);
    setFormError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError("");
    setFormSuccess("");

    if (!formData.name || !formData.logoUrl) {
      setFormError("Please fill in all required fields.");
      return;
    }

    try {
      if (isEditing) {
        await skillsService.updateSkill(currentSkill.id, formData);
        setFormSuccess("Skill updated successfully!");
      } else {
        await skillsService.addSkill(formData);
        setFormSuccess("Skill added successfully!");
      }
      
      fetchSkills();
      
      gsap.fromTo(".success-banner", 
        { y: -20, opacity: 0 }, 
        { y: 0, opacity: 1, duration: 0.5, ease: "back.out" }
      );

      setTimeout(() => {
        resetForm();
        setFormSuccess("");
      }, 2000);
    } catch (error) {
      setFormError("Failed to save skill.");
    }
  };

  const handleEdit = (skill) => {
    setIsEditing(true);
    setCurrentSkill(skill);
    setFormData({
      name: skill.name,
      logoUrl: skill.logoUrl
    });
    
    window.scrollTo({ top: 0, behavior: "smooth" });
    gsap.from(formRef.current, {
      backgroundColor: "rgba(184, 255, 0, 0.1)",
      duration: 0.8
    });
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this skill?")) {
      try {
        await skillsService.deleteSkill(id);
        fetchSkills();
      } catch (error) {
        alert("Failed to delete skill.");
      }
    }
  };

  const toggleSelect = (id) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const handleBulkDelete = async () => {
    if (window.confirm(`Are you sure you want to delete ${selectedIds.length} skills?`)) {
      try {
        await skillsService.bulkDeleteSkills(selectedIds);
        setSelectedIds([]);
        fetchSkills();
      } catch (error) {
        alert("Bulk delete failed.");
      }
    }
  };

  const handleSeedData = async () => {
    if (window.confirm("Seed default skills into Firestore?")) {
      setLoading(true);
      try {
        for (const s of DEFAULT_SKILLS) {
          await skillsService.addSkill({ name: s.name, logoUrl: s.logo });
        }
        fetchSkills();
      } catch (error) {
        alert("Seeding failed.");
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="admin-page">
      <div className="admin-dashboard">
        <header className="dashboard-header">
          <div>
            <Link to="/admin" style={{ color: "var(--color-muted)", fontSize: "0.9rem", textDecoration: "none", marginBottom: "10px", display: "inline-block" }}>
              ← Back to Dashboard
            </Link>
            <h1 className="dashboard-title">{isEditing ? "Edit Skill" : "Skills Lattice"}</h1>
            <p>Manage your technical capabilities and logos.</p>
          </div>
          <button onClick={logout} className="btn-logout">Logout</button>
        </header>

        <section className="admin-content" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "40px" }}>
          
          {/* Skill Form */}
          <div className="admin-card" ref={formRef} style={{ height: "fit-content", position: "sticky", top: "120px" }}>
            <h2 style={{ marginBottom: "20px" }}>{isEditing ? "Update Skill" : "New Skill"}</h2>
            
            {formError && <div className="error-message">{formError}</div>}
            {formSuccess && <div className="success-banner" style={{ background: "rgba(184, 255, 0, 0.1)", borderLeft: "4px solid var(--color-accent)", padding: "12px", marginBottom: "20px", color: "var(--color-dark)", fontSize: "0.9rem", fontWeight: "600", borderRadius: "4px" }}>{formSuccess}</div>}

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Skill Name *</label>
                <input 
                  type="text" 
                  name="name" 
                  className="form-input" 
                  value={formData.name} 
                  onChange={handleInputChange} 
                  placeholder="e.g. Kubernetes"
                />
              </div>

              <div className="form-group">
                <label>Logo URL (SVG/PNG) *</label>
                <input 
                  type="text" 
                  name="logoUrl" 
                  className="form-input" 
                  value={formData.logoUrl} 
                  onChange={handleInputChange} 
                  placeholder="Direct image URL"
                />
              </div>

              <div style={{ display: "flex", gap: "10px", marginTop: "30px" }}>
                <button type="submit" className="login-button" style={{ flex: 2 }}>
                  {isEditing ? "Apply Changes" : "Save Skill"}
                </button>
                {isEditing && (
                  <button type="button" onClick={resetForm} className="btn-logout" style={{ flex: 1, padding: "0" }}>
                    Cancel
                  </button>
                )}
              </div>
            </form>
          </div>

          {/* Skill List */}
          <div className="projects-container">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
              <h2 className="heading-card">Current Skills ({skills.length})</h2>
              <div style={{ display: "flex", gap: "10px" }}>
                {selectedIds.length > 0 && (
                  <button onClick={handleBulkDelete} className="btn-logout" style={{ border: "1px solid #ff4d4d", color: "#ff4d4d", fontSize: "0.8rem" }}>
                    Delete Selected ({selectedIds.length})
                  </button>
                )}
                {skills.length === 0 && !loading && (
                  <button onClick={handleSeedData} className="btn-manage" style={{ background: "var(--color-dark)", color: "white" }}>
                    Seed Defaults
                  </button>
                )}
              </div>
            </div>

            <div className="projects-list-wrapper" style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
              {loading ? (
                <p style={{ textAlign: "center", padding: "40px", color: "var(--color-muted)" }}>Loading skills...</p>
              ) : skills.length === 0 ? (
                <div style={{ textAlign: "center", padding: "60px", background: "white", borderRadius: "15px", border: "1px dashed rgba(0,0,0,0.1)" }}>
                  <p style={{ color: "var(--color-muted)", marginBottom: "15px" }}>No skills found.</p>
                </div>
              ) : (
                skills.map((skill) => (
                  <div key={skill.id} className="admin-card" style={{ padding: "15px", display: "flex", gap: "15px", alignItems: "center", border: selectedIds.includes(skill.id) ? "1px solid var(--color-accent)" : "1px solid rgba(0,0,0,0.05)" }}>
                    <input 
                      type="checkbox" 
                      onClick={(e) => e.stopPropagation()} 
                      onChange={() => toggleSelect(skill.id)}
                      checked={selectedIds.includes(skill.id)}
                    />
                    <div style={{ width: "50px", height: "50px", display: "flex", alignItems: "center", justifyContent: "center", background: "#f9f9f9", borderRadius: "8px", flexShrink: 0 }}>
                      <img src={skill.logoUrl} alt="" style={{ maxWidth: "70%", maxHeight: "70%", objectFit: "contain" }} />
                    </div>
                    <div style={{ flexGrow: 1 }}>
                      <h4 style={{ margin: 0 }}>{skill.name}</h4>
                    </div>
                    <div style={{ display: "flex", gap: "8px" }}>
                      <button onClick={() => handleEdit(skill)} className="btn-manage" style={{ padding: "6px 12px", fontSize: "0.75rem" }}>Edit</button>
                      <button onClick={() => handleDelete(skill.id)} className="btn-logout" style={{ padding: "6px 12px", fontSize: "0.75rem", border: "1px solid #ff4d4d", color: "#ff4d4d", background: "transparent" }}>Del</button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default AdminSkills;
