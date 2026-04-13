import { 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  getDocs, 
  query, 
  orderBy,
  serverTimestamp,
  writeBatch
} from "firebase/firestore";
import { db } from "./config";

const COLLECTION_NAME = "projects";

export const projectsService = {
  // Fetch all projects ordered by sortOrder (ascending)
  async getProjects() {
    try {
      // Default to ordering by sortOrder. If that's missing for some, 
      // the first call to save a new order will fix it.
      const q = query(collection(db, COLLECTION_NAME), orderBy("sortOrder", "asc"));
      const querySnapshot = await getDocs(q);
      
      // Fallback: If no projects have sortOrder, fetch by createdAt desc
      if (querySnapshot.empty) {
        const fallBackQ = query(collection(db, COLLECTION_NAME), orderBy("createdAt", "desc"));
        const fallbackSnapshot = await getDocs(fallBackQ);
        return fallbackSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
      }

      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error("Error fetching projects:", error);
      // If index doesn't exist yet or other error, fallback to simple fetch
      const q = query(collection(db, COLLECTION_NAME), orderBy("createdAt", "desc"));
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    }
  },

  // Add a new project
  async addProject(projectData, totalProjects = 0) {
    try {
      const docRef = await addDoc(collection(db, COLLECTION_NAME), {
        ...projectData,
        sortOrder: totalProjects, // Assign to the end of the list
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      return docRef.id;
    } catch (error) {
      console.error("Error adding project:", error);
      throw error;
    }
  },

  // Update an existing project
  async updateProject(id, projectData) {
    try {
      const docRef = doc(db, COLLECTION_NAME, id);
      await updateDoc(docRef, {
        ...projectData,
        updatedAt: serverTimestamp()
      });
    } catch (error) {
      console.error("Error updating project:", error);
      throw error;
    }
  },

  // Update the order of all projects (Batch Write)
  async updateProjectsOrder(projects) {
    try {
      const batch = writeBatch(db);
      projects.forEach((project, index) => {
        const docRef = doc(db, COLLECTION_NAME, project.id);
        batch.update(docRef, { 
          sortOrder: index,
          updatedAt: serverTimestamp() 
        });
      });
      await batch.commit();
    } catch (error) {
      console.error("Error updating projects order:", error);
      throw error;
    }
  },

  // Delete a project
  async deleteProject(id) {
    try {
      const docRef = doc(db, COLLECTION_NAME, id);
      await deleteDoc(docRef);
    } catch (error) {
      console.error("Error deleting project:", error);
      throw error;
    }
  },

  // Upload image to Cloudinary (Replaced Firebase Storage)
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
    formData.append("folder", "portfolio-admin");

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
