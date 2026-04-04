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

const COLLECTION_NAME = "experience";

export const experienceService = {
  // Fetch all experience entries ordered by sortOrder
  async getExperience() {
    try {
      const q = query(
        collection(db, COLLECTION_NAME), 
        orderBy("sortOrder", "asc")
      );
      const querySnapshot = await getDocs(q);
      
      // If none have sortOrder, fallback to date ordering
      if (querySnapshot.empty) {
        const qFallback = query(
          collection(db, COLLECTION_NAME), 
          orderBy("startDate", "desc")
        );
        const fbSnapshot = await getDocs(qFallback);
        return fbSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
      }

      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error("Error fetching experience:", error);
      // Fallback if index for sortOrder is missing yet
      const querySnapshot = await getDocs(collection(db, COLLECTION_NAME));
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })).sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0));
    }
  },

  // Add a new experience entry
  async addExperience(experienceData, currentLength = 0) {
    try {
      const docRef = await addDoc(collection(db, COLLECTION_NAME), {
        ...experienceData,
        sortOrder: currentLength,
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

  // Update order for multiple experiences
  async updateExperienceOrder(newOrder) {
    try {
      const batch = writeBatch(db);
      newOrder.forEach((item, index) => {
        const docRef = doc(db, COLLECTION_NAME, item.id);
        batch.update(docRef, { sortOrder: index });
      });
      await batch.commit();
    } catch (error) {
      console.error("Error updating experience order:", error);
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
