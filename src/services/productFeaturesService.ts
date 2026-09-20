import {
  collection,
  doc,
  getDocs,
  getDoc,
  setDoc,
  deleteDoc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "./firebase";

type FeatureType = "wishlist" | "compare";

const getIds = async (uid: string, feature: FeatureType): Promise<string[]> => {
  try {
    const ref = collection(db, "users", uid, feature);
    const snapshot = await getDocs(ref);
    return snapshot.docs.map((docSnap) => docSnap.id);
  } catch (error) {
    console.error(`Failed to fetch ${feature} from Firestore.`, error);
    return [];
  }
};

const toggleId = async (
  uid: string,
  feature: FeatureType,
  productId: string,
): Promise<string[]> => {
  const productRef = doc(db, "users", uid, feature, productId);

  try {
    const snap = await getDoc(productRef);

    if (snap.exists()) {
      await deleteDoc(productRef);
    } else {
      await setDoc(productRef, { addedAt: serverTimestamp() });
    }
  } catch (error) {
    console.error(`Failed to update ${feature} on Firestore.`, error);
  }

  return getIds(uid, feature);
};

export const getWishlistIds = (uid: string): Promise<string[]> =>
  getIds(uid, "wishlist");
export const toggleWishlistId = (
  uid: string,
  productId: string,
): Promise<string[]> => toggleId(uid, "wishlist", productId);

export const getCompareIds = (uid: string): Promise<string[]> =>
  getIds(uid, "compare");
export const toggleCompareId = (
  uid: string,
  productId: string,
): Promise<string[]> => toggleId(uid, "compare", productId);
