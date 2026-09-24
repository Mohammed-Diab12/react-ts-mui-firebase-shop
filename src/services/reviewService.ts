import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  deleteDoc,
  serverTimestamp,
  Timestamp,
  QueryDocumentSnapshot,
} from "firebase/firestore";
import { db } from "./firebase";
import type { Review } from "../types";

const productsCollectionName = "products";
const reviewsCollectionName = "reviews";

const reviewsCollection = (productId: string) =>
  collection(db, productsCollectionName, productId, reviewsCollectionName);

const mapDocToReview = (docSnap: QueryDocumentSnapshot): Review => {
  const data = docSnap.data();
  return {
    id: docSnap.id,
    userId: data.userId,
    userName: data.userName,
    rating: data.rating,
    comment: data.comment,
    createdAt:
      data.createdAt instanceof Timestamp ? data.createdAt.toDate() : null,
  };
};

// Fetch all reviews for a product
export const getProductReviews = async (
  productId: string,
): Promise<Review[]> => {
  const snapshot = await getDocs(reviewsCollection(productId));
  return snapshot.docs.map(mapDocToReview);
};

// Fetch a single user's review for a product, or null if they haven't reviewed it
export const getUserReview = async (
  productId: string,
  userId: string,
): Promise<Review | null> => {
  const reviewRef = doc(
    db,
    productsCollectionName,
    productId,
    reviewsCollectionName,
    userId,
  );
  const reviewSnap = await getDoc(reviewRef);

  if (!reviewSnap.exists()) {
    return null;
  }
  return mapDocToReview(reviewSnap as QueryDocumentSnapshot);
};

// Add a new review (document id = userId → one review per user per product)
export const addReview = async (
  productId: string,
  userId: string,
  review: Omit<Review, "id" | "userId" | "createdAt">,
): Promise<void> => {
  const reviewRef = doc(
    db,
    productsCollectionName,
    productId,
    reviewsCollectionName,
    userId,
  );
  await setDoc(reviewRef, {
    userId,
    userName: review.userName,
    rating: review.rating,
    comment: review.comment,
    createdAt: serverTimestamp(),
  });
};

// Update an existing review
export const updateReview = async (
  productId: string,
  userId: string,
  review: Pick<Review, "rating" | "comment">,
): Promise<void> => {
  const reviewRef = doc(
    db,
    productsCollectionName,
    productId,
    reviewsCollectionName,
    userId,
  );
  await setDoc(
    reviewRef,
    {
      rating: review.rating,
      comment: review.comment,
    },
    { merge: true },
  );
};

// Delete a review
export const deleteReview = async (
  productId: string,
  userId: string,
): Promise<void> => {
  const reviewRef = doc(
    db,
    productsCollectionName,
    productId,
    reviewsCollectionName,
    userId,
  );
  await deleteDoc(reviewRef);
};
