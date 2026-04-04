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

const COLLECTION_NAME = "experience";

export const experienceService = {
  // Fetch all experience entries ordered by date or sortOrder
  async getExperience() {
    try {
      const q = query(
        collection(db, COLLECTION_NAME), 
        orderBy("startDate", "desc")
      );
      const querySnapshot = await getDocs(q);
      
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error("Error fetching experience:", error);
      // Fallback to simple fetch if index is missing
      const querySnapshot = await getDocs(collection(db, COLLECTION_NAME));
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    }
  },

  // Add a new experience entry
  async addExperience(experienceData) {
    try {
      const docRef = await addDoc(collection(db, COLLECTION_NAME), {
        ...experienceData,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      return docRef.id;
    } catch (error) {
      console.error("Error adding experience:", error);
      throw error;
    }
  },

  // Update an existing experience entry
  async updateExperience(id, experienceData) {
    try {
      const docRef = doc(db, COLLECTION_NAME, id);
      await updateDoc(docRef, {
        ...experienceData,
        updatedAt: serverTimestamp()
      });
    } catch (error) {
      console.error("Error updating experience:", error);
      throw error;
    }
  },

  // Delete an experience entry
  async deleteExperience(id) {
    try {
      const docRef = doc(db, COLLECTION_NAME, id);
      await deleteDoc(docRef);
    } catch (error) {
      console.error("Error deleting experience:", error);
      throw error;
    }
  }
};
