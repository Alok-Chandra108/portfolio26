import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { resumeService } from "../../firebase/resumeService";
import { gsap, useGSAP } from "../../utils/gsapPlugins";
import "../../styles/admin.css";

export default function AdminResume() {
  const [resumeData, setResumeData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const containerRef = useRef(null);
  const fileInputRef = useRef(null);

  useGSAP(() => {
    gsap.from(".admin-dashboard > *", {
      y: 15,
      opacity: 0,
      duration: 0.5,
      stagger: 0.06,
      ease: "power2.out",
    });
  }, { scope: containerRef });

  useEffect(() => {
    // Subscribe to real-time updates
    const unsubscribe = resumeService.subscribeToResume((data) => {
      setResumeData(data);
      setLoading(false);
    });

    return () => unsubscribe && unsubscribe();
  }, []);

  const formatBytes = (bytes) => {
    if (!bytes || bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return "Recently";
    if (timestamp.toDate) {
      return timestamp.toDate().toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    }
    return new Date(timestamp).toLocaleDateString();
  };

  const handleProcessFile = async (file) => {
    if (!file) return;

    // Validate PDF
    const isPdf = file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf");
    if (!isPdf) {
      setError("Please select a valid PDF document (.pdf).");
      return;
    }

    // 15MB limit
    if (file.size > 15 * 1024 * 1024) {
      setError("File size exceeds 15MB limit.");
      return;
    }

    setError("");
    setSuccess("");
    setUploading(true);
    setUploadProgress(0);

    try {
      // 1. Upload to Cloudinary
      const uploaded = await resumeService.uploadResume(file, (progress) => {
        setUploadProgress(progress);
      });

      // 2. Save metadata to Firestore
      await resumeService.saveResume({
        resumeUrl: uploaded.url,
        publicId: uploaded.publicId,
        fileName: file.name,
        fileSize: file.size,
        format: uploaded.format,
      });

      setSuccess("Resume successfully uploaded and activated!");
      setTimeout(() => setSuccess(""), 4000);
    } catch (err) {
      console.error(err);
      setError(err.message || "Failed to upload resume to Cloudinary.");
    } finally {
      setUploading(false);
      setUploadProgress(0);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleFileInputChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      handleProcessFile(file);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleProcessFile(file);
    }
  };

  const handleDeleteResume = async () => {
    setIsDeleting(true);
    setError("");
    setSuccess("");

    try {
      await resumeService.deleteResume();
      setShowDeleteConfirm(false);
      setSuccess("Resume removed. The download button is now hidden across your portfolio.");
      setTimeout(() => setSuccess(""), 4000);
    } catch (err) {
      console.error(err);
      setError("Failed to delete resume record: " + err.message);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="admin-page" ref={containerRef}>
      <div className="admin-dashboard" style={{ maxWidth: "800px" }}>
        {/* Navigation */}
        <Link to="/admin" className="btn-back">
          <span>&larr;</span> Back to Dashboard
        </Link>

        <header className="dashboard-header" style={{ marginBottom: "30px", display: "block" }}>
          <h1 className="dashboard-title" style={{ fontSize: "2.5rem" }}>
            Resume / CV Management
          </h1>
          <p style={{ color: "var(--color-muted)", marginTop: "8px" }}>
            Upload, update, or remove your downloadable PDF resume. Powered by Cloudinary & Firebase for instant synchronization.
          </p>
        </header>

        {/* Notifications */}
        {error && <div className="error-message">{error}</div>}
        {success && (
          <div
            style={{
              padding: "12px 20px",
              marginBottom: "20px",
              background: "rgba(184, 255, 0, 0.1)",
              borderLeft: "4px solid var(--color-accent)",
              borderRadius: "4px",
              fontWeight: 600,
              color: "var(--color-text)",
            }}
          >
            ✓ {success}
          </div>
        )}

        {/* Loading state */}
        {loading ? (
          <div style={{ padding: "60px 0", textAlign: "center", color: "var(--color-muted)" }}>
            Loading resume status...
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "30px" }}>
            {/* Current Active Resume Card */}
            {resumeData?.resumeUrl ? (
              <div
                style={{
                  background: "white",
                  borderRadius: "var(--radius-card)",
                  padding: "32px",
                  border: "1px solid rgba(0, 0, 0, 0.08)",
                  boxShadow: "0 10px 30px rgba(0, 0, 0, 0.04)",
                  position: "relative",
                  overflow: "hidden",
                }}
              >
                {/* Active Indicator Header */}
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "24px",
                    flexWrap: "wrap",
                    gap: "12px",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <span
                      style={{
                        display: "inline-block",
                        width: "10px",
                        height: "10px",
                        borderRadius: "50%",
                        background: "#00d26a",
                        boxShadow: "0 0 10px #00d26a",
                      }}
                    />
                    <span
                      style={{
                        fontFamily: "var(--font-mono)",
                        fontSize: "0.85rem",
                        fontWeight: 700,
                        textTransform: "uppercase",
                        color: "#009e4f",
                        letterSpacing: "0.05em",
                      }}
                    >
                      Active & Live on Portfolio
                    </span>
                  </div>

                  <span
                    style={{
                      fontFamily: "var(--font-mono)",
                      fontSize: "0.8rem",
                      color: "var(--color-muted)",
                    }}
                  >
                    Updated: {formatDate(resumeData.updatedAt)}
                  </span>
                </div>

                {/* File Details Display */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "20px",
                    padding: "20px",
                    background: "rgba(0, 0, 0, 0.02)",
                    borderRadius: "16px",
                    border: "1px solid rgba(0, 0, 0, 0.05)",
                    marginBottom: "24px",
                  }}
                >
                  <div
                    style={{
                      width: "56px",
                      height: "56px",
                      borderRadius: "12px",
                      background: "rgba(255, 68, 68, 0.1)",
                      color: "#ff3b30",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "1.8rem",
                      fontWeight: 800,
                      flexShrink: 0,
                    }}
                  >
                    📄
                  </div>

                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div
                      style={{
                        fontWeight: 700,
                        fontSize: "1.1rem",
                        color: "var(--color-text)",
                        wordBreak: "break-all",
                        marginBottom: "4px",
                      }}
                    >
                      {resumeData.fileName || "Alok_Chandra_Resume.pdf"}
                    </div>
                    <div
                      style={{
                        fontFamily: "var(--font-mono)",
                        fontSize: "0.85rem",
                        color: "var(--color-muted)",
                      }}
                    >
                      PDF Document • {formatBytes(resumeData.fileSize)}
                    </div>
                  </div>
                </div>

                {/* Cloudinary Security Tip */}
                <div
                  style={{
                    padding: "12px 16px",
                    background: "rgba(255, 149, 0, 0.06)",
                    borderLeft: "3px solid #ff9500",
                    borderRadius: "8px",
                    fontSize: "0.85rem",
                    color: "var(--color-text)",
                    marginBottom: "20px",
                    lineHeight: 1.5,
                  }}
                >
                  <strong style={{ color: "#d97706" }}>Cloudinary Setting Reminder:</strong> If PDF preview or download shows an access error, make sure <em>"Allow delivery of PDF and ZIP files"</em> is checked in your Cloudinary Settings &rarr; Security.
                </div>

                {/* Quick Actions */}
                <div
                  style={{
                    display: "flex",
                    gap: "12px",
                    flexWrap: "wrap",
                    alignItems: "center",
                  }}
                >
                  {/* View PDF */}
                  <a
                    href={resumeData.resumeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-manage"
                    style={{
                      textDecoration: "none",
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "8px",
                    }}
                  >
                    <span>↗</span> Preview PDF
                  </a>

                  {/* Direct Download Test */}
                  <a
                    href={resumeService.getAttachmentUrl(resumeData.resumeUrl)}
                    download={resumeData.fileName || "Alok_Chandra_Resume.pdf"}
                    className="btn-manage"
                    style={{
                      textDecoration: "none",
                      background: "var(--color-dark)",
                      color: "white",
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "8px",
                    }}
                  >
                    <span>↓</span> Test Download
                  </a>

                  {/* Replace Button */}
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploading}
                    style={{
                      padding: "8px 20px",
                      borderRadius: "var(--radius-pill)",
                      border: "1px solid rgba(0, 0, 0, 0.15)",
                      background: "transparent",
                      color: "var(--color-text)",
                      fontFamily: "var(--font-body)",
                      fontWeight: 600,
                      fontSize: "0.85rem",
                      cursor: "pointer",
                      transition: "all 0.3s ease",
                    }}
                  >
                    Replace File
                  </button>

                  {/* Delete Button */}
                  <button
                    type="button"
                    onClick={() => setShowDeleteConfirm(true)}
                    disabled={uploading || isDeleting}
                    style={{
                      padding: "8px 20px",
                      marginLeft: "auto",
                      borderRadius: "var(--radius-pill)",
                      border: "1px solid rgba(255, 59, 48, 0.2)",
                      background: "rgba(255, 59, 48, 0.05)",
                      color: "#ff3b30",
                      fontFamily: "var(--font-body)",
                      fontWeight: 600,
                      fontSize: "0.85rem",
                      cursor: "pointer",
                      transition: "all 0.3s ease",
                    }}
                  >
                    Remove Resume
                  </button>
                </div>
              </div>
            ) : (
              <div
                style={{
                  background: "white",
                  borderRadius: "var(--radius-card)",
                  padding: "32px",
                  border: "1px solid rgba(0, 0, 0, 0.08)",
                  textAlign: "center",
                }}
              >
                <div style={{ fontSize: "2rem", marginBottom: "12px" }}>📁</div>
                <h3 style={{ fontFamily: "var(--font-display)", fontSize: "1.3rem", marginBottom: "8px" }}>
                  No Resume Currently Uploaded
                </h3>
                <p style={{ color: "var(--color-muted)", fontSize: "0.95rem", maxWidth: "450px", margin: "0 auto" }}>
                  The <strong>Download CV</strong> button is currently hidden across your portfolio. Upload your PDF resume below to publish it live immediately.
                </p>
              </div>
            )}

            {/* Upload / Drag & Drop Area */}
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => !uploading && fileInputRef.current?.click()}
              style={{
                border: isDragging
                  ? "2px dashed var(--color-accent)"
                  : "2px dashed rgba(0, 0, 0, 0.15)",
                background: isDragging
                  ? "rgba(184, 255, 0, 0.05)"
                  : "rgba(255, 255, 255, 0.6)",
                borderRadius: "var(--radius-card)",
                padding: "48px 24px",
                textAlign: "center",
                cursor: uploading ? "wait" : "pointer",
                transition: "all 0.3s ease",
              }}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,application/pdf"
                style={{ display: "none" }}
                onChange={handleFileInputChange}
              />

              {uploading ? (
                <div style={{ maxWidth: "360px", margin: "0 auto" }}>
                  <div style={{ fontSize: "1.1rem", fontWeight: 700, marginBottom: "12px" }}>
                    Uploading to Cloudinary... {uploadProgress}%
                  </div>
                  <div
                    style={{
                      width: "100%",
                      height: "10px",
                      background: "rgba(0, 0, 0, 0.08)",
                      borderRadius: "10px",
                      overflow: "hidden",
                    }}
                  >
                    <div
                      style={{
                        width: `${uploadProgress}%`,
                        height: "100%",
                        background: "var(--color-accent)",
                        transition: "width 0.2s ease",
                      }}
                    />
                  </div>
                  <p style={{ fontSize: "0.85rem", color: "var(--color-muted)", marginTop: "10px" }}>
                    Optimizing & publishing to CDN...
                  </p>
                </div>
              ) : (
                <div>
                  <div style={{ fontSize: "2.5rem", marginBottom: "16px" }}>☁️</div>
                  <h4 style={{ fontSize: "1.2rem", fontWeight: 700, marginBottom: "8px" }}>
                    {resumeData?.resumeUrl ? "Upload New Version" : "Upload Your Resume"}
                  </h4>
                  <p style={{ color: "var(--color-muted)", fontSize: "0.95rem", marginBottom: "20px" }}>
                    Drag and drop your PDF file here, or <strong style={{ color: "var(--color-dark)" }}>browse files</strong>
                  </p>
                  <span
                    style={{
                      fontFamily: "var(--font-mono)",
                      fontSize: "0.75rem",
                      color: "var(--color-muted)",
                      padding: "4px 12px",
                      background: "rgba(0, 0, 0, 0.04)",
                      borderRadius: "var(--radius-pill)",
                    }}
                  >
                    PDF files only • Max size 15MB
                  </span>
                </div>
              )}
            </div>

            {/* Efficiency Info Box */}
            <div
              style={{
                background: "rgba(0, 0, 0, 0.02)",
                border: "1px solid rgba(0, 0, 0, 0.06)",
                borderRadius: "16px",
                padding: "20px 24px",
                fontSize: "0.9rem",
                color: "var(--color-muted)",
                lineHeight: 1.6,
              }}
            >
              <strong style={{ color: "var(--color-text)", display: "block", marginBottom: "4px" }}>
                ⚡ How it works:
              </strong>
              When you upload a new resume, it is stored in your Cloudinary asset repository and the portfolio’s download buttons (Hero section & Experience page) update in real-time. If you remove the resume, the button is cleanly hidden until you upload another.
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {showDeleteConfirm && (
          <div
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: "rgba(0, 0, 0, 0.5)",
              backdropFilter: "blur(4px)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 1000,
              padding: "20px",
            }}
            onClick={() => setShowDeleteConfirm(false)}
          >
            <div
              style={{
                background: "white",
                borderRadius: "var(--radius-card)",
                padding: "32px",
                maxWidth: "460px",
                width: "100%",
                boxShadow: "0 25px 50px rgba(0, 0, 0, 0.15)",
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <h3 style={{ fontFamily: "var(--font-display)", fontSize: "1.4rem", marginBottom: "12px" }}>
                Remove Resume?
              </h3>
              <p style={{ color: "var(--color-muted)", fontSize: "0.95rem", lineHeight: 1.6, marginBottom: "24px" }}>
                Are you sure you want to remove this resume from your portfolio? The download button will be completely hidden from visitors until a new resume is uploaded.
              </p>
              <div style={{ display: "flex", justifyContent: "flex-end", gap: "12px" }}>
                <button
                  type="button"
                  onClick={() => setShowDeleteConfirm(false)}
                  style={{
                    padding: "10px 20px",
                    borderRadius: "var(--radius-pill)",
                    border: "1px solid rgba(0, 0, 0, 0.1)",
                    background: "transparent",
                    fontWeight: 600,
                    cursor: "pointer",
                  }}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleDeleteResume}
                  disabled={isDeleting}
                  style={{
                    padding: "10px 24px",
                    borderRadius: "var(--radius-pill)",
                    border: "none",
                    background: "#ff3b30",
                    color: "white",
                    fontWeight: 700,
                    cursor: isDeleting ? "wait" : "pointer",
                  }}
                >
                  {isDeleting ? "Removing..." : "Yes, Remove"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
