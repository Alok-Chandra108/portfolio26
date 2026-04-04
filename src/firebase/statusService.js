import { db } from "./config";
import { doc, onSnapshot, updateDoc, getDoc, setDoc } from "firebase/firestore";

const STATUS_DOC_ID = "availability";
const STATUS_COLLECTION = "settings";

/**
 * Subscribe to status changes in real-time
 * @param {function} callback - Function to call when status changes
 * @returns {function} Unsubscribe function
 */
export const subscribeToStatus = (callback) => {
  const docRef = doc(db, STATUS_COLLECTION, STATUS_DOC_ID);
  
  return onSnapshot(docRef, (docSnap) => {
    if (docSnap.exists()) {
      callback(docSnap.data());
    } else {
      // Initialize if doesn't exist
      const initialStatus = {
        state: "open", // 'open' or 'busy'
        lastUpdated: new Date().toISOString()
      };
      setDoc(docRef, initialStatus);
      callback(initialStatus);
    }
  }, (error) => {
    console.error("Error subscribing to status:", error);
  });
};

/**
 * Update the availability status
 * @param {string} newState - 'open' or 'busy'
 */
export const updateStatus = async (newState) => {
  const docRef = doc(db, STATUS_COLLECTION, STATUS_DOC_ID);
  try {
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      await updateDoc(docRef, {
        state: newState,
        lastUpdated: new Date().toISOString()
      });
    } else {
      await setDoc(docRef, {
        state: newState,
        lastUpdated: new Date().toISOString()
      });
    }
  } catch (error) {
    console.error("Error updating status:", error);
    throw error;
  }
};
