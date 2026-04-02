import { 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  getDocs, 
  query, 
  orderBy,
  serverTimestamp 
} from "firebase/firestore";
import { db } from "./config";

const COLLECTION_NAME = "projects";

export const projectsService = {
  // Fetch all projects ordered by sortOrder (descending) or createdAt
  async getProjects() {
    try {
      const q = query(collection(db, COLLECTION_NAME), orderBy("createdAt", "desc"));
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error("Error fetching projects:", error);
      throw error;
    }
  },

  // Add a new project
  async addProject(projectData) {
    try {
      const docRef = await addDoc(collection(db, COLLECTION_NAME), {
        ...projectData,
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

  // Delete a project
  async deleteProject(id) {
    try {
      const docRef = doc(db, COLLECTION_NAME, id);
      await deleteDoc(docRef);
    } catch (error) {
      console.error("Error deleting project:", error);
      throw error;
    }
  }
};
