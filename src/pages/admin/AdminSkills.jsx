import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { skillsService } from "../../firebase/skillsService";
import { gsap } from "../../utils/gsapPlugins";
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

  // Setup sensors for DND
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const [formData, setFormData] = useState({
    name: "",
    logoUrl: "",
    row: 1 // Default to Row 1
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
    setFormData(prev => ({ 
      ...prev, 
      [name]: name === 'row' ? parseInt(value) : value 
    }));
  };

  const resetForm = () => {
    setFormData({ name: "", logoUrl: "", row: 1 });
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
        // Pass skills length to assign correct sortOrder
        await skillsService.addSkill(formData, skills.length);
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
      logoUrl: skill.logoUrl,
      row: skill.row || 1
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

  const handleDragEnd = async (event) => {
    const { active, over } = event;

    if (active && over && active.id !== over.id) {
      const oldIndex = skills.findIndex((s) => s.id === active.id);
      const newIndex = skills.findIndex((s) => s.id === over.id);

      const newOrder = arrayMove(skills, oldIndex, newIndex);
      
      // Optimistic UI update
      setSkills(newOrder);

      try {
        // Persist to Firestore
        await skillsService.updateSkillsOrder(newOrder);
        console.log("Order updated successfully in Firestore.");
      } catch (error) {
        alert("Failed to save the new order. Reverting...");
        fetchSkills();
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

  const skillsByRow = (rowNum) => skills.filter(s => (s.row || 1) === rowNum);

  return (
    <div className="admin-page">
      <div className="admin-dashboard">
        <header className="dashboard-header">
          <div>
            <Link to="/admin" style={{ color: "var(--color-muted)", fontSize: "0.9rem", textDecoration: "none", marginBottom: "10px", display: "inline-block" }}>
              ← Back to Dashboard
            </Link>
            <h1 className="dashboard-title">{isEditing ? "Edit Skill" : "Skills Lattice"}</h1>
            <p>Manage your technical capabilities and assigned rows.</p>
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

              <div className="form-group">
                <label>Row Assignment *</label>
                <div style={{ display: "flex", gap: "20px", marginTop: "10px" }}>
                  <label style={{ display: "flex", alignItems: "center", gap: "8px", textTransform: "none", color: "var(--color-dark)", cursor: "pointer" }}>
                    <input 
                      type="radio" 
                      name="row" 
                      value="1" 
                      checked={formData.row === 1} 
                      onChange={handleInputChange} 
                    />
                    Row 1 (Leftward)
                  </label>
                  <label style={{ display: "flex", alignItems: "center", gap: "8px", textTransform: "none", color: "var(--color-dark)", cursor: "pointer" }}>
                    <input 
                      type="radio" 
                      name="row" 
                      value="2" 
                      checked={formData.row === 2} 
                      onChange={handleInputChange} 
                    />
                    Row 2 (Rightward)
                  </label>
                </div>
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
              </div>
            </div>

            <div className="projects-list-wrapper">
              {loading ? (
                <p style={{ textAlign: "center", padding: "40px", color: "var(--color-muted)" }}>Loading skills...</p>
              ) : skills.length === 0 ? (
                <div style={{ textAlign: "center", padding: "60px", background: "white", borderRadius: "15px", border: "1px dashed rgba(0,0,0,0.1)" }}>
                  <p style={{ color: "var(--color-muted)", marginBottom: "15px" }}>No skills found. Add your first skill assigned to a row!</p>
                </div>
              ) : (
                <DndContext
                  sensors={sensors}
                  collisionDetection={closestCenter}
                  onDragEnd={handleDragEnd}
                  modifiers={[restrictToVerticalAxis]}
                >
                  <div style={{ display: "flex", flexDirection: "column", gap: "30px" }}>
                    {[1, 2].map(rowNum => (
                      <div key={`row-${rowNum}`}>
                        <h4 style={{ fontSize: "0.8rem", color: "var(--color-muted)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "15px", borderBottom: "1px solid rgba(0,0,0,0.05)", paddingBottom: "8px" }}>
                          Row {rowNum}
                        </h4>
                        <SortableContext
                          items={skillsByRow(rowNum).map(s => s.id)}
                          strategy={verticalListSortingStrategy}
                        >
                          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                            {skillsByRow(rowNum).map((skill) => (
                              <SortableItem key={skill.id} id={skill.id}>
                                {({ attributes, listeners, handleStyle, isDragging }) => (
                                  <div 
                                    className="admin-card" 
                                    style={{ 
                                      padding: "12px", 
                                      display: "flex", 
                                      gap: "15px", 
                                      alignItems: "center", 
                                      opacity: isDragging ? 0.4 : 1,
                                      boxShadow: isDragging ? "0 8px 30px rgba(0,0,0,0.12)" : "none",
                                      border: selectedIds.includes(skill.id) ? "1px solid var(--color-accent)" : (isDragging ? "1px solid var(--color-accent)" : "1px solid rgba(0,0,0,0.05)") 
                                    }}
                                  >
                                    <div {...attributes} {...listeners} style={handleStyle}>
                                      <DragHandleIcon />
                                    </div>
                                    <input 
                                      type="checkbox" 
                                      onClick={(e) => e.stopPropagation()} 
                                      onChange={() => toggleSelect(skill.id)}
                                      checked={selectedIds.includes(skill.id)}
                                    />
                                    <div style={{ width: "40px", height: "40px", display: "flex", alignItems: "center", justifyContent: "center", background: "#f9f9f9", borderRadius: "8px", flexShrink: 0 }}>
                                      <img src={skill.logoUrl} alt="" style={{ maxWidth: "70%", maxHeight: "70%", objectFit: "contain" }} />
                                    </div>
                                    <div style={{ flexGrow: 1 }}>
                                      <h4 style={{ margin: 0, fontSize: "0.95rem" }}>{skill.name}</h4>
                                    </div>
                                    <div style={{ display: "flex", gap: "8px" }}>
                                      <button onClick={() => handleEdit(skill)} className="btn-manage" style={{ padding: "5px 10px", fontSize: "0.7rem" }}>Edit</button>
                                      <button onClick={() => handleDelete(skill.id)} className="btn-logout" style={{ padding: "5px 10px", fontSize: "0.7rem", border: "1px solid #ff4d4d", color: "#ff4d4d", background: "transparent" }}>Del</button>
                                    </div>
                                  </div>
                                )}
                              </SortableItem>
                            ))}
                            {skillsByRow(rowNum).length === 0 && (
                              <p style={{ fontSize: "0.8rem", color: "var(--color-muted)", fontStyle: "italic", padding: "10px" }}>No skills in this row.</p>
                            )}
                          </div>
                        </SortableContext>
                      </div>
                    ))}
                  </div>
                </DndContext>
              )}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default AdminSkills;
