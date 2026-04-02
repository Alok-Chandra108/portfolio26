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

const COLLECTION_NAME = "skills";

export const skillsService = {
  // Fetch all skills
  async getSkills() {
    try {
      const q = query(collection(db, COLLECTION_NAME), orderBy("createdAt", "desc"));
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error("Error fetching skills:", error);
      throw error;
    }
  },

  // Add a new skill
  async addSkill(skillData) {
    try {
      const docRef = await addDoc(collection(db, COLLECTION_NAME), {
        ...skillData,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      return docRef.id;
    } catch (error) {
      console.error("Error adding skill:", error);
      throw error;
    }
  },

  // Update an existing skill
  async updateSkill(id, skillData) {
    try {
      const docRef = doc(db, COLLECTION_NAME, id);
      await updateDoc(docRef, {
        ...skillData,
        updatedAt: serverTimestamp()
      });
    } catch (error) {
      console.error("Error updating skill:", error);
      throw error;
    }
  },

  // Delete a single skill
  async deleteSkill(id) {
    try {
      const docRef = doc(db, COLLECTION_NAME, id);
      await deleteDoc(docRef);
    } catch (error) {
      console.error("Error deleting skill:", error);
      throw error;
    }
  },

  // Bulk delete skills
  async bulkDeleteSkills(ids) {
    try {
      const batch = writeBatch(db);
      ids.forEach(id => {
        const docRef = doc(db, COLLECTION_NAME, id);
        batch.delete(docRef);
      });
      await batch.commit();
    } catch (error) {
      console.error("Error bulk deleting skills:", error);
      throw error;
    }
  }
};
