import { doc, getDoc } from "firebase/firestore";
import { db } from "./firebase";

const ADMINS_COLLECTION = "admins";

export const checkIsAdmin = async (uid: string): Promise<boolean> => {
  const adminRef = doc(db, ADMINS_COLLECTION, uid);
  const adminSnap = await getDoc(adminRef);
  return adminSnap.exists();
};
