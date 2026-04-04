import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { experienceService } from "../../firebase/experienceService";
import { gsap, useGSAP } from "../../utils/gsapPlugins";
import "../../styles/admin.css";

// DND Kit Imports
import {
  DndContext, 
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { restrictToVerticalAxis } from '@dnd-kit/modifiers';
import { SortableItem, DragHandleIcon } from "../../components/admin/SortableItem";

const AdminExperience = () => {
  const { logout } = useAuth();
  const [experiences, setExperiences] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState(null);
  const [formError, setFormError] = useState("");
  const [formSuccess, setFormSuccess] = useState("");
  const formRef = useRef(null);

  // Setup sensors for DND
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const [formData, setFormData] = useState({
    company: "",
    role: "",
    location: "",
    startDate: "",
    endDate: "",
    description: "",
    isCurrent: false
  });

  useEffect(() => {
    fetchExperience();
  }, []);

  const fetchExperience = async () => {
    setLoading(true);
    try {
      const data = await experienceService.getExperience();
      setExperiences(data);
    } catch (error) {
      console.error("Error fetching experience:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ 
      ...prev, 
      [name]: type === "checkbox" ? checked : value 
    }));
  };

  const { contextSafe } = useGSAP({ scope: formRef });

  const resetForm = () => {
    setFormData({
      company: "",
      role: "",
      location: "",
      startDate: "",
      endDate: "",
      description: "",
      isCurrent: false
    });
    setIsEditing(false);
    setCurrentId(null);
    setFormError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError("");
    setFormSuccess("");

    if (!formData.company || !formData.role || !formData.startDate) {
      setFormError("Company, Role, and Start Date are required.");
      return;
    }

    try {
      if (isEditing) {
        await experienceService.updateExperience(currentId, formData);
        setFormSuccess("Experience updated successfully!");
      } else {
        await experienceService.addExperience(formData, experiences.length);
        setFormSuccess("Experience added successfully!");
      }
      
      fetchExperience();
      
      const animateSuccess = contextSafe(() => {
        gsap.fromTo(".success-banner", 
          { y: -20, opacity: 0 }, 
          { y: 0, opacity: 1, duration: 0.5, ease: "back.out" }
        );
      });
      animateSuccess();

      setTimeout(() => {
        resetForm();
        setFormSuccess("");
      }, 2000);
    } catch (error) {
      setFormError("Failed to save experience. Please try again.");
    }
  };

  const handleEdit = (exp) => {
    setIsEditing(true);
    setCurrentId(exp.id);
    setFormData({
      company: exp.company,
      role: exp.role,
      location: exp.location || "",
      startDate: exp.startDate,
      endDate: exp.endDate || "",
      description: exp.description || "",
      isCurrent: exp.isCurrent || false
    });
    
    window.scrollTo({ top: 0, behavior: "smooth" });
    
    const animateEdit = contextSafe(() => {
      gsap.from(formRef.current, {
        backgroundColor: "rgba(184, 255, 0, 0.1)",
        duration: 0.8
      });
    });
    animateEdit();
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this entry?")) {
      try {
        await experienceService.deleteExperience(id);
        fetchExperience();
      } catch (error) {
        alert("Failed to delete experience.");
      }
    }
  };

  const handleDragEnd = async (event) => {
    const { active, over } = event;

    if (active && over && active.id !== over.id) {
      const oldIndex = experiences.findIndex((e) => e.id === active.id);
      const newIndex = experiences.findIndex((e) => e.id === over.id);

      const newOrder = arrayMove(experiences, oldIndex, newIndex);
      
      // Optimistic UI update
      setExperiences(newOrder);

      try {
        // Persist to Firestore
        await experienceService.updateExperienceOrder(newOrder);
        console.log("Timeline order updated successfully.");
      } catch (error) {
        alert("Failed to save the new order. Reverting...");
        fetchExperience();
      }
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
            <h1 className="dashboard-title">{isEditing ? "Edit Work Entry" : "Work Experience"}</h1>
            <p>Manage your professional timeline and company history.</p>
          </div>
          <button onClick={logout} className="btn-logout">Logout</button>
        </header>

        <section className="admin-content" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "40px" }}>
          
          {/* Experience Form */}
          <div className="admin-card" ref={formRef} style={{ height: "fit-content", position: "sticky", top: "120px" }}>
            <h2 style={{ marginBottom: "20px" }}>{isEditing ? "Update Entry" : "Add Experience"}</h2>
            
            {formError && <div className="error-message">{formError}</div>}
            {formSuccess && <div className="success-banner" style={{ background: "rgba(184, 255, 0, 0.1)", borderLeft: "4px solid var(--color-accent)", padding: "12px", marginBottom: "20px", color: "var(--color-dark)", fontSize: "0.9rem", fontWeight: "600", borderRadius: "4px" }}>{formSuccess}</div>}

            <form onSubmit={handleSubmit}>
              <div className="form-group" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px" }}>
                <div>
                  <label>Company *</label>
                  <input 
                    type="text" 
                    name="company" 
                    className="form-input" 
                    value={formData.company} 
                    onChange={handleInputChange} 
                    placeholder="e.g. Google"
                  />
                </div>
                <div>
                  <label>Role *</label>
                  <input 
                    type="text" 
                    name="role" 
                    className="form-input" 
                    value={formData.role} 
                    onChange={handleInputChange} 
                    placeholder="e.g. Senior DevOps"
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Location</label>
                <input 
                  type="text" 
                  name="location" 
                  className="form-input" 
                  value={formData.location} 
                  onChange={handleInputChange} 
                  placeholder="e.g. Remote / New York"
                />
              </div>

              <div className="form-group" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px" }}>
                <div>
                  <label>Start Date *</label>
                  <input 
                    type="text" 
                    name="startDate" 
                    className="form-input" 
                    value={formData.startDate} 
                    onChange={handleInputChange} 
                    placeholder="e.g. Oct 2022"
                  />
                </div>
                <div>
                  <label>End Date</label>
                  <input 
                    type="text" 
                    name="endDate" 
                    className="form-input" 
                    disabled={formData.isCurrent}
                    value={formData.isCurrent ? "Present" : formData.endDate} 
                    onChange={handleInputChange} 
                    placeholder="e.g. Dec 2023"
                  />
                </div>
              </div>

              <div className="form-group" style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "20px" }}>
                <input 
                  type="checkbox" 
                  name="isCurrent" 
                  id="isCurrent"
                  checked={formData.isCurrent} 
                  onChange={handleInputChange} 
                />
                <label htmlFor="isCurrent" style={{ margin: 0, cursor: "pointer" }}>I currently work here</label>
              </div>

              <div className="form-group">
                <label>Description / Key Achievements</label>
                <textarea 
                  name="description" 
                  className="form-input" 
                  rows="5" 
                  value={formData.description} 
                  onChange={handleInputChange}
                  placeholder="Bullet points or summary of your impact..."
                  style={{ resize: "none" }}
                />
              </div>

              <div style={{ display: "flex", gap: "10px", marginTop: "30px" }}>
                <button type="submit" className="login-button" style={{ flex: 2 }}>
                  {isEditing ? "Apply Changes" : "Save Experience"}
                </button>
                {isEditing && (
                  <button type="button" onClick={resetForm} className="btn-logout" style={{ flex: 1, padding: "0" }}>
                    Cancel
                  </button>
                )}
              </div>
            </form>
          </div>

          {/* Experience List */}
          <div className="projects-container">
            <h2 className="heading-card" style={{ marginBottom: "20px" }}>Current History ({experiences.length})</h2>

            <div className="projects-list-wrapper">
              {loading ? (
                <p style={{ textAlign: "center", padding: "40px", color: "var(--color-muted)" }}>Loading timeline...</p>
              ) : experiences.length === 0 ? (
                <div style={{ textAlign: "center", padding: "60px", background: "white", borderRadius: "15px", border: "1px dashed rgba(0,0,0,0.1)" }}>
                  <p style={{ color: "var(--color-muted)" }}>No experience data yet. Start by adding your first role.</p>
                </div>
              ) : (
                <DndContext
                  sensors={sensors}
                  collisionDetection={closestCenter}
                  onDragEnd={handleDragEnd}
                  modifiers={[restrictToVerticalAxis]}
                >
                  <SortableContext
                    items={experiences.map(e => e.id)}
                    strategy={verticalListSortingStrategy}
                  >
                    <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
                      {experiences.map((exp) => (
                        <SortableItem key={exp.id} id={exp.id}>
                          {({ attributes, listeners, handleStyle, isDragging }) => (
                            <div 
                              className="admin-card" 
                              style={{ 
                                padding: "15px", 
                                display: "flex", 
                                justifyContent: "space-between", 
                                alignItems: "center", 
                                border: isDragging ? "1px solid var(--color-accent)" : "1px solid rgba(0,0,0,0.05)",
                                boxShadow: isDragging ? "0 8px 30px rgba(0,0,0,0.1)" : "none",
                                opacity: isDragging ? 0.5 : 1,
                                transition: "all 0.2s ease"
                              }}
                            >
                              <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
                                <div {...attributes} {...listeners} style={handleStyle}>
                                  <DragHandleIcon />
                                </div>
                                <div>
                                  <h4 style={{ margin: "0 0 5px 0" }}>{exp.role} @ {exp.company}</h4>
                                  <p style={{ margin: 0, fontSize: "0.8rem", color: "var(--color-muted)" }}>
                                    {exp.startDate} — {exp.isCurrent ? "Present" : exp.endDate} | {exp.location}
                                  </p>
                                </div>
                              </div>
                              <div style={{ display: "flex", gap: "8px" }}>
                                <button onClick={() => handleEdit(exp)} className="btn-manage" style={{ padding: "6px 12px", fontSize: "0.75rem" }}>Edit</button>
                                <button onClick={() => handleDelete(exp.id)} className="btn-logout" style={{ padding: "6px 12px", fontSize: "0.75rem", border: "1px solid #ff4d4d", color: "#ff4d4d", background: "transparent" }}>Del</button>
                              </div>
                            </div>
                          )}
                        </SortableItem>
                      ))}
                    </div>
                  </SortableContext>
                </DndContext>
              )}
            </div>
          </div>

        </section>
      </div>
    </div>
  );
};

export default AdminExperience;
