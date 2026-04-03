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
  }
};
