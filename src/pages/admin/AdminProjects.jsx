import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { projectsService } from "../../firebase/projectsService";
import projectsData from "../../data/projects"; // Static data for seeding
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

const AdminProjects = () => {
  const { logout } = useAuth();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [currentProject, setCurrentProject] = useState(null);
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
    title: "",
    description: "",
    tags: "",
    image: "",
    type: "tall",
    link: "#"
  });

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    setLoading(true);
    try {
      const data = await projectsService.getProjects();
      setProjects(data);
    } catch (error) {
      console.error("Error fetching projects:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      tags: "",
      image: "",
      type: "tall",
      link: "#"
    });
    setIsEditing(false);
    setCurrentProject(null);
    setFormError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError("");
    setFormSuccess("");

    if (!formData.title || !formData.description || !formData.image) {
      setFormError("Please fill in all required fields.");
      return;
    }

    const projectPayload = {
      ...formData,
      tags: typeof formData.tags === "string" 
        ? formData.tags.split(",").map(t => t.trim()).filter(t => t !== "")
        : formData.tags
    };

    try {
      if (isEditing) {
        await projectsService.updateProject(currentProject.id, projectPayload);
        setFormSuccess("Project updated successfully!");
      } else {
        // Pass project count to assign correct sortOrder
        await projectsService.addProject(projectPayload, projects.length);
        setFormSuccess("Project added successfully!");
      }
      
      fetchProjects();
      
      // Animation for success
      gsap.fromTo(".success-banner", 
        { y: -20, opacity: 0 }, 
        { y: 0, opacity: 1, duration: 0.5, ease: "back.out" }
      );

      setTimeout(() => {
        resetForm();
        setFormSuccess("");
      }, 2000);
    } catch (error) {
      setFormError("Failed to save project. Please try again.");
    }
  };

  const handleEdit = (project) => {
    setIsEditing(true);
    setCurrentProject(project);
    setFormData({
      title: project.title,
      description: project.description,
      tags: project.tags.join(", "),
      image: project.image,
      type: project.type || "tall",
      link: project.link || "#"
    });
    
    window.scrollTo({ top: 0, behavior: "smooth" });
    
    gsap.from(formRef.current, {
      backgroundColor: "rgba(184, 255, 0, 0.1)",
      duration: 0.8
    });
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this project?")) {
      try {
        await projectsService.deleteProject(id);
        fetchProjects();
      } catch (error) {
        alert("Failed to delete project.");
      }
    }
  };

  const handleDragEnd = async (event) => {
    const { active, over } = event;

    if (active.id !== over.id) {
      const oldIndex = projects.findIndex((p) => p.id === active.id);
      const newIndex = projects.findIndex((p) => p.id === over.id);

      const newOrder = arrayMove(projects, oldIndex, newIndex);
      
      // Optimistic UI update
      setProjects(newOrder);

      try {
        // Persist to Firestore
        await projectsService.updateProjectsOrder(newOrder);
        console.log("Order updated successfully in Firestore.");
      } catch (error) {
        alert("Failed to save the new order. Reverting...");
        fetchProjects(); // Revert to database state
      }
    }
  };

  const handleSeedData = async () => {
    if (window.confirm("This will import the 4 default projects from static data into Firestore. Continue?")) {
      setLoading(true);
      try {
        for (let i = 0; i < projectsData.length; i++) {
          const { id, ...data } = projectsData[i];
          // Assign sortOrder during seeding
          await projectsService.addProject(data, i);
        }
        alert("Data seeded successfully!");
        fetchProjects();
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
            <Link to="/admin" className="btn-back">
              <span>←</span> Back to Dashboard
            </Link>
            <h1 className="dashboard-title">{isEditing ? "Edit Project" : "Manage Projects"}</h1>
            <p>Add, edit, or delete your portfolio pieces.</p>
          </div>
          <button onClick={logout} className="btn-logout">Logout</button>
        </header>

        <section className="admin-content" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "40px" }}>
          
          {/* Project Form */}
          <div className="admin-card" ref={formRef} style={{ height: "fit-content", position: "sticky", top: "120px" }}>
            <h2 style={{ marginBottom: "20px" }}>{isEditing ? "Update Project" : "New Project"}</h2>
            
            {formError && <div className="error-message">{formError}</div>}
            {formSuccess && <div className="success-banner" style={{ background: "rgba(184, 255, 0, 0.1)", borderLeft: "4px solid var(--color-accent)", padding: "12px", marginBottom: "20px", color: "var(--color-dark)", fontSize: "0.9rem", fontWeight: "600", borderRadius: "4px" }}>{formSuccess}</div>}

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Project Title *</label>
                <input 
                  type="text" 
                  name="title" 
                  className="form-input" 
                  value={formData.title} 
                  onChange={handleInputChange} 
                  placeholder="e.g. Zenith Dashboard"
                />
              </div>

              <div className="form-group">
                <label>Description *</label>
                <textarea 
                  name="description" 
                  className="form-input" 
                  rows="3" 
                  value={formData.description} 
                  onChange={handleInputChange}
                  placeholder="A short overview of the project..."
                  style={{ resize: "none" }}
                />
              </div>

              <div className="form-group">
                <label>Image URL *</label>
                <input 
                  type="text" 
                  name="image" 
                  className="form-input" 
                  value={formData.image} 
                  onChange={handleInputChange} 
                  placeholder="Unsplash URL or other direct link"
                />
              </div>

              <div className="form-group" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px" }}>
                <div>
                  <label>Tags (comma separated)</label>
                  <input 
                    type="text" 
                    name="tags" 
                    className="form-input" 
                    value={formData.tags} 
                    onChange={handleInputChange} 
                    placeholder="React, GSAP, etc."
                  />
                </div>
                <div>
                  <label>Layout Type</label>
                  <select 
                    name="type" 
                    className="form-input" 
                    value={formData.type} 
                    onChange={handleInputChange} 
                  >
                    <option value="tall">Tall (Portrait)</option>
                    <option value="wide">Wide (Landscape)</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label>Project Link</label>
                <input 
                  type="text" 
                  name="link" 
                  className="form-input" 
                  value={formData.link} 
                  onChange={handleInputChange} 
                  placeholder="#"
                />
              </div>

              <div style={{ display: "flex", gap: "10px", marginTop: "30px" }}>
                <button type="submit" className="login-button" style={{ flex: 2 }}>
                  {isEditing ? "Apply Changes" : "Save Project"}
                </button>
                {isEditing && (
                  <button type="button" onClick={resetForm} className="btn-logout" style={{ flex: 1, padding: "0" }}>
                    Cancel
                  </button>
                )}
              </div>
            </form>
          </div>

          {/* Project List */}
          <div className="projects-container">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
              <h2 className="heading-card">Current Projects ({projects.length})</h2>
              {projects.length === 0 && !loading && (
                <button onClick={handleSeedData} className="btn-manage" style={{ background: "var(--color-dark)", color: "white" }}>
                  Seed Static Data
                </button>
              )}
            </div>

            <div className="projects-list-wrapper">
              {loading ? (
                <p style={{ textAlign: "center", padding: "40px", color: "var(--color-muted)" }}>Loading projects...</p>
              ) : projects.length === 0 ? (
                <div style={{ textAlign: "center", padding: "60px", background: "white", borderRadius: "15px", border: "1px dashed rgba(0,0,0,0.1)" }}>
                  <p style={{ color: "var(--color-muted)", marginBottom: "15px" }}>No projects found in Firestore.</p>
                </div>
              ) : (
                <DndContext
                  sensors={sensors}
                  collisionDetection={closestCenter}
                  onDragEnd={handleDragEnd}
                  modifiers={[restrictToVerticalAxis]}
                >
                  <SortableContext
                    items={projects.map(p => p.id)}
                    strategy={verticalListSortingStrategy}
                  >
                    <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
                      {projects.map((project) => (
                        <SortableItem key={project.id} id={project.id}>
                          {({ attributes, listeners, handleStyle, isDragging }) => (
                            <div 
                              className="admin-card" 
                              style={{ 
                                padding: "15px", 
                                display: "flex", 
                                gap: "20px", 
                                alignItems: "center",
                                opacity: isDragging ? 0.4 : 1,
                                boxShadow: isDragging ? "0 8px 30px rgba(0,0,0,0.12)" : "none",
                                border: isDragging ? "1px solid var(--color-accent)" : "1px solid rgba(0,0,0,0.05)"
                              }}
                            >
                              <div {...attributes} {...listeners} style={handleStyle}>
                                <DragHandleIcon />
                              </div>
                              <div style={{ width: "80px", height: "80px", borderRadius: "8px", overflow: "hidden", flexShrink: 0 }}>
                                <img src={project.image} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                              </div>
                              <div style={{ flexGrow: 1 }}>
                                <h4 style={{ margin: "0 0 5px 0" }}>{project.title}</h4>
                                <p style={{ margin: 0, fontSize: "0.8rem", overflow: "hidden", textOverflow: "ellipsis", display: "-webkit-box", WebkitLineClamp: 1, WebkitBoxOrient: "vertical" }}>
                                  {project.description}
                                </p>
                              </div>
                              <div style={{ display: "flex", gap: "8px" }}>
                                <button onClick={() => handleEdit(project)} className="btn-manage" style={{ padding: "6px 12px", fontSize: "0.75rem" }}>Edit</button>
                                <button onClick={() => handleDelete(project.id)} className="btn-logout" style={{ padding: "6px 12px", fontSize: "0.75rem", border: "1px solid #ff4d4d", color: "#ff4d4d", background: "transparent" }}>Del</button>
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

export default AdminProjects;
