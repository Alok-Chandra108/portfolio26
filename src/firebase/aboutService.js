import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { db } from "./config";

const COLLECTION_NAME = "about";
const DOCUMENT_ID = "data";

export const aboutService = {
  // Fetch the single about data document
  async getAboutData() {
    try {
      const docRef = doc(db, COLLECTION_NAME, DOCUMENT_ID);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        return docSnap.data();
      } else {
        // Return null if it doesn't exist so frontend knows to use defaults
        return null; 
      }
    } catch (error) {
      console.error("Error fetching about data:", error);
      throw error;
    }
  },

  // Update or create the about data document
  async updateAboutData(aboutData) {
    try {
      const docRef = doc(db, COLLECTION_NAME, DOCUMENT_ID);
      await setDoc(docRef, {
        ...aboutData,
        updatedAt: serverTimestamp()
      }, { merge: true }); // Merge true allows partial updates if needed
    } catch (error) {
      console.error("Error updating about data:", error);
      throw error;
    }
  },

  // Upload image to Cloudinary (Reused from projectsService logic)
  async uploadImage(file, onProgress) {
    if (!file) throw new Error("No file provided for upload");
    
    const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
    const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;
    
    if (!cloudName || !uploadPreset) {
      throw new Error("Cloudinary configuration missing in environment variables.");
    }

    const url = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;
    
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", uploadPreset);
    formData.append("folder", "portfolio-admin-about");

    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open("POST", url, true);

      xhr.upload.onprogress = (e) => {
        if (e.lengthComputable && onProgress) {
          const progress = (e.loaded / e.total) * 100;
          onProgress(progress);
        }
      };

      xhr.onload = () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          try {
            const response = JSON.parse(xhr.responseText);
            resolve(response.secure_url);
          } catch (err) {
            reject(new Error("Failed to parse Cloudinary response"));
          }
        } else {
          try {
            const errRes = JSON.parse(xhr.responseText);
            reject(new Error(errRes.error?.message || "Cloudinary upload failed"));
          } catch(err) {
            reject(new Error("Cloudinary upload failed with status: " + xhr.status));
          }
        }
      };

      xhr.onerror = () => {
        reject(new Error("Network error occurred during Cloudinary upload"));
      };

      xhr.send(formData);
    });
  }
};
