import { doc, getDoc, setDoc, deleteDoc, onSnapshot, serverTimestamp } from "firebase/firestore";
import { db } from "./config";

const COLLECTION_NAME = "resume";
const DOCUMENT_ID = "current";

export const resumeService = {
  // Fetch current resume data once
  async getResumeData() {
    try {
      const docRef = doc(db, COLLECTION_NAME, DOCUMENT_ID);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() };
      }
      return null;
    } catch (error) {
      console.error("Error fetching resume data:", error);
      throw error;
    }
  },

  // Real-time listener for resume changes across the application
  subscribeToResume(callback) {
    try {
      const docRef = doc(db, COLLECTION_NAME, DOCUMENT_ID);
      return onSnapshot(
        docRef,
        (docSnap) => {
          if (docSnap.exists()) {
            callback({ id: docSnap.id, ...docSnap.data() });
          } else {
            callback(null);
          }
        },
        (error) => {
          console.error("Resume subscription error:", error);
          callback(null);
        }
      );
    } catch (error) {
      console.error("Error setting up resume subscription:", error);
      return () => {};
    }
  },

  // Upload resume PDF to Cloudinary with progress tracking
  async uploadResume(file, onProgress) {
    if (!file) throw new Error("No file provided for upload");

    const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
    const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

    if (!cloudName || !uploadPreset) {
      throw new Error("Cloudinary configuration missing in environment variables.");
    }

    // Use auto endpoint for PDFs / documents
    const url = `https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`;

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", uploadPreset);
    formData.append("folder", "portfolio-resume");

    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open("POST", url, true);

      xhr.upload.onprogress = (e) => {
        if (e.lengthComputable && onProgress) {
          const progress = Math.round((e.loaded / e.total) * 100);
          onProgress(progress);
        }
      };

      xhr.onload = () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          try {
            const response = JSON.parse(xhr.responseText);
            resolve({
              url: response.secure_url,
              publicId: response.public_id,
              originalFilename: response.original_filename || file.name,
              format: response.format || "pdf",
              bytes: response.bytes || file.size,
            });
          } catch {
            reject(new Error("Failed to parse Cloudinary response"));
          }
        } else {
          try {
            const errRes = JSON.parse(xhr.responseText);
            reject(new Error(errRes.error?.message || "Cloudinary upload failed"));
          } catch {
            reject(new Error("Cloudinary upload failed with status: " + xhr.status));
          }
        }
      };

      xhr.onerror = () => {
        reject(new Error("Network error occurred during Cloudinary upload"));
      };

      xhr.send(formData);
    });
  },

  // Save or update the resume metadata in Firestore
  async saveResume(resumeData) {
    try {
      const docRef = doc(db, COLLECTION_NAME, DOCUMENT_ID);
      await setDoc(
        docRef,
        {
          ...resumeData,
          updatedAt: serverTimestamp(),
        },
        { merge: true }
      );
    } catch (error) {
      console.error("Error saving resume to Firestore:", error);
      throw error;
    }
  },

  // Delete resume from Firestore
  async deleteResume() {
    try {
      const docRef = doc(db, COLLECTION_NAME, DOCUMENT_ID);
      await deleteDoc(docRef);
    } catch (error) {
      console.error("Error deleting resume:", error);
      throw error;
    }
  },

  // Generate an attachment download URL for Cloudinary assets
  getAttachmentUrl(url) {
    if (!url) return "";
    if (url.includes("cloudinary.com") && url.includes("/upload/") && !url.includes("/fl_attachment/")) {
      return url.replace("/upload/", "/upload/fl_attachment/");
    }
    return url;
  }
};
