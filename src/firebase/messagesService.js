import { 
  collection, 
  addDoc, 
  serverTimestamp 
} from "firebase/firestore";
import { db } from "./config";

const COLLECTION_NAME = "messages";

export const messagesService = {
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
  }
};
