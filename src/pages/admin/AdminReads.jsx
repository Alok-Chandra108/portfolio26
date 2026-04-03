import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { db } from "../../firebase/config";
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from "firebase/firestore";
import "../../styles/admin.css";

const AdminReads = () => {
  const { logout } = useAuth();
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Form State
  const [isEditing, setIsEditing] = useState(false);
  const [currentBookId, setCurrentBookId] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    author: "",
    category: "Fiction",
    status: "Want to Read",
    cover: ""
  });

  const categories = ["Fiction", "Non-Fiction", "Design", "Tech", "Productivity", "Business", "Self-Help"];
  const statuses = ["Want to Read", "Reading", "Read"];

  // Fetch books
  const fetchBooks = async () => {
    setLoading(true);
    try {
      const querySnapshot = await getDocs(collection(db, "reads"));
      const booksData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setBooks(booksData);
    } catch (error) {
      console.error("Error fetching books: ", error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleEdit = (book) => {
    setIsEditing(true);
    setCurrentBookId(book.id);
    setFormData({
      title: book.title,
      author: book.author,
      category: book.category,
      status: book.status,
      cover: book.cover || ""
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleCancel = () => {
    setIsEditing(false);
    setCurrentBookId(null);
    setFormData({ title: "", author: "", category: "Fiction", status: "Want to Read", cover: "" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditing) {
        const bookRef = doc(db, "reads", currentBookId);
        await updateDoc(bookRef, formData);
      } else {
        await addDoc(collection(db, "reads"), formData);
      }
      handleCancel();
      fetchBooks();
    } catch (error) {
      console.error("Error saving book: ", error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this book?")) {
      try {
        await deleteDoc(doc(db, "reads", id));
        fetchBooks();
      } catch (error) {
        console.error("Error deleting book: ", error);
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
            <h1 className="dashboard-title">Manage Books</h1>
            <p>Add, edit, or remove books and update reading status.</p>
          </div>
          <button onClick={logout} className="btn-logout">Logout</button>
        </header>

        <section className="admin-content">
          {/* Form Section */}
          <div className="admin-card" style={{ marginBottom: "40px" }}>
            <h2 style={{ marginBottom: "20px" }}>{isEditing ? "Edit Book" : "Add New Book"}</h2>
            <form onSubmit={handleSubmit}>
              <div className="admin-grid">
                <div className="form-group">
                  <label>Title</label>
                  <input type="text" className="form-input" name="title" value={formData.title} onChange={handleChange} required placeholder="e.g. Attitude is Everything" />
                </div>
                <div className="form-group">
                  <label>Author</label>
                  <input type="text" className="form-input" name="author" value={formData.author} onChange={handleChange} required placeholder="e.g. Jeff Keller" />
                </div>
              </div>
              
              <div className="admin-grid">
                <div className="form-group">
                  <label>Category</label>
                  <select className="form-input" name="category" value={formData.category} onChange={handleChange}>
                    {categories.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label>Status</label>
                  <select className="form-input" name="status" value={formData.status} onChange={handleChange}>
                    {statuses.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label>Cover Image URL (Direct Link)</label>
                <input type="url" className="form-input" name="cover" value={formData.cover} onChange={handleChange} placeholder="https://..." />
              </div>

              <div style={{ display: "flex", gap: "10px", marginTop: "20px" }}>
                <button type="submit" className="login-button" style={{ marginTop: 0 }}>
                  {isEditing ? "Update Book" : "Save Book"}
                </button>
                {isEditing && (
                  <button type="button" onClick={handleCancel} className="btn-logout">
                    Cancel
                  </button>
                )}
              </div>
            </form>
          </div>

          {/* List Section */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
            <h2 style={{ margin: 0 }}>Your Reading List</h2>
          </div>
          <div style={{ marginTop: "20px", display: "flex", flexDirection: "column", gap: "15px" }}>
            {loading ? (
              <p style={{ color: "var(--color-muted)" }}>Loading books...</p>
            ) : books.length === 0 ? (
              <p style={{ color: "var(--color-muted)" }}>No books found. Add one above!</p>
            ) : (
              books.map(book => (
                <div key={book.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", background: "white", padding: "20px", borderRadius: "12px", border: "1px solid rgba(0,0,0,0.05)" }}>
                  <div style={{ display: "flex", gap: "20px", alignItems: "center" }}>
                    {book.cover && <img src={book.cover} alt={book.title} style={{ width: "50px", height: "70px", objectFit: "cover", borderRadius: "4px" }} />}
                    <div>
                      <h3 style={{ margin: 0, fontSize: "1.1rem" }}>{book.title}</h3>
                      <p style={{ margin: "5px 0 0 0", color: "var(--color-muted)", fontSize: "0.9rem" }}>by {book.author}</p>
                    </div>
                  </div>
                  
                  <div style={{ display: "flex", gap: "20px", alignItems: "center" }}>
                    <div style={{ textAlign: "right", marginRight: "20px" }}>
                      <span style={{ display: "block", fontSize: "0.8rem", fontWeight: "bold", color: "var(--color-accent-dark)", textTransform: "uppercase" }}>{book.status}</span>
                      <span style={{ fontSize: "0.8rem", color: "var(--color-muted)" }}>{book.category}</span>
                    </div>
                    <button onClick={() => handleEdit(book)} className="btn-manage" style={{ background: "transparent", border: "1px solid var(--color-dark)" }}>Edit</button>
                    <button onClick={() => handleDelete(book.id)} className="btn-manage" style={{ background: "#ff4d4d", color: "white" }}>Delete</button>
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

export default AdminReads;
