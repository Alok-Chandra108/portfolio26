import { 
  collection, 
  addDoc, 
  getDocs,
  deleteDoc,
  updateDoc,
  doc,
  query,
  orderBy,
  serverTimestamp 
} from "firebase/firestore";
import { db } from "./config";

const COLLECTION_NAME = "messages";

export const messagesService = {
  // Fetch all messages ordered by newest first
  async getMessages() {
    try {
      const q = query(collection(db, COLLECTION_NAME), orderBy("createdAt", "desc"));
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error("Error fetching messages:", error);
      throw error;
    }
  },

  // Add a new contact message
  async sendMessage(messageData) {
    try {
      const docRef = await addDoc(collection(db, COLLECTION_NAME), {
        ...messageData,
        status: 'unread',
        createdAt: serverTimestamp()
      });
      return docRef.id;
    } catch (error) {
      console.error("Error sending message:", error);
      throw error;
    }
  },

  // Update a message (e.g. mark as read)
  async markAsRead(id) {
    try {
      const docRef = doc(db, COLLECTION_NAME, id);
      await updateDoc(docRef, { status: 'read' });
    } catch (error) {
      console.error("Error marking message as read:", error);
      throw error;
    }
  },

  // Delete a message
  async deleteMessage(id) {
    try {
      const docRef = doc(db, COLLECTION_NAME, id);
      await deleteDoc(docRef);
    } catch (error) {
      console.error("Error deleting message:", error);
      throw error;
    }
  }
};
