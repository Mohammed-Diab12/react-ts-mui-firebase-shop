import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
  addDoc,
  runTransaction,
  serverTimestamp,
  QueryDocumentSnapshot,
} from "firebase/firestore";
import { db } from "./firebase";
import type { Product } from "../types";

const productsCollectionName = "products";
const reviews_Collection = "reviews";
const productsCollection = collection(db, productsCollectionName);

const mapDocToProduct = (docSnap: QueryDocumentSnapshot): Product => {
  const data = docSnap.data();
  return {
    id: docSnap.id,
    category: data.category,
    title: data.title,
    description: data.description,
    images: data.images,
    thumbnail: data.thumbnail,
    price: data.price,
    discountPercentage: data.discountPercentage,
    stock: data.stock,
    sku: data.sku,
    rating: data.rating ?? 0,
    ratingCount: data.ratingCount ?? 0,
  };
};

// Fetch all products from the products collection
export const getAllProducts = async (): Promise<Product[]> => {
  const snapshot = await getDocs(productsCollection);
  return snapshot.docs.map(mapDocToProduct);
};

// Fetch products belonging to a single category
export const getProductsByCategory = async (
  category: Product["category"],
): Promise<Product[]> => {
  const productsQuery = query(
    productsCollection,
    where("category", "==", category),
  );
  const snapshot = await getDocs(productsQuery);
  return snapshot.docs.map(mapDocToProduct);
};

// Fetch products belonging to multiple categories
export const getProductsByCategories = async (
  categories: Product["category"][],
): Promise<Product[]> => {
  const productsQuery = query(
    productsCollection,
    where("category", "in", categories),
  );
  const snapshot = await getDocs(productsQuery);
  return snapshot.docs.map(mapDocToProduct);
};

// Fetch a single product by id, or null if it doesn't exist
export const getProductById = async (id: string): Promise<Product | null> => {
  const productRef = doc(db, productsCollectionName, id);
  const productSnap = await getDoc(productRef);

  if (!productSnap.exists()) {
    return null;
  }
  return mapDocToProduct(productSnap as QueryDocumentSnapshot);
};

export const createProduct = async (
  product: Omit<Product, "id">,
): Promise<string> => {
  const docRef = await addDoc(productsCollection, product);
  return docRef.id;
};

// Add a new review and update the product's rating/ratingCount atomically
export const addReviewAndUpdateRating = async (
  productId: string,
  userId: string,
  review: { userName: string; rating: number; comment: string },
): Promise<void> => {
  const productRef = doc(db, productsCollectionName, productId);
  const reviewRef = doc(
    db,
    productsCollectionName,
    productId,
    reviews_Collection,
    userId,
  );

  await runTransaction(db, async (transaction) => {
    const productSnap = await transaction.get(productRef);
    if (!productSnap.exists()) {
      throw new Error("Product not found");
    }

    const data = productSnap.data();
    const currentRating = data.rating ?? 0;
    const currentCount = data.ratingCount ?? 0;
    const newCount = currentCount + 1;
    const updatedRating =
      (currentRating * currentCount + review.rating) / newCount;

    transaction.set(reviewRef, {
      userId,
      userName: review.userName,
      rating: review.rating,
      comment: review.comment,
      createdAt: serverTimestamp(),
    });

    transaction.update(productRef, {
      rating: updatedRating,
      ratingCount: newCount,
    });
  });
};

// Update an existing review and the product's rating atomically
export const updateReviewAndRating = async (
  productId: string,
  userId: string,
  oldRating: number,
  review: { rating: number; comment: string },
): Promise<void> => {
  const productRef = doc(db, productsCollectionName, productId);
  const reviewRef = doc(
    db,
    productsCollectionName,
    productId,
    reviews_Collection,
    userId,
  );

  await runTransaction(db, async (transaction) => {
    const productSnap = await transaction.get(productRef);
    if (!productSnap.exists()) {
      throw new Error("Product not found");
    }

    const data = productSnap.data();
    const currentRating = data.rating ?? 0;
    const currentCount = data.ratingCount ?? 0;

    if (currentCount === 0) {
      throw new Error("Cannot update rating: no existing reviews");
    }

    const updatedRating =
      (currentRating * currentCount - oldRating + review.rating) / currentCount;

    transaction.update(reviewRef, {
      rating: review.rating,
      comment: review.comment,
    });

    transaction.update(productRef, {
      rating: updatedRating,
    });
  });
};

// Delete a review and update the product's rating/ratingCount atomically
export const deleteReviewAndUpdateRating = async (
  productId: string,
  userId: string,
  removedRating: number,
): Promise<void> => {
  const productRef = doc(db, productsCollectionName, productId);
  const reviewRef = doc(
    db,
    productsCollectionName,
    productId,
    reviews_Collection,
    userId,
  );

  await runTransaction(db, async (transaction) => {
    const productSnap = await transaction.get(productRef);
    if (!productSnap.exists()) {
      throw new Error("Product not found");
    }

    const data = productSnap.data();
    const currentRating = data.rating ?? 0;
    const currentCount = data.ratingCount ?? 0;
    const newCount = currentCount - 1;

    transaction.delete(reviewRef);

    if (newCount <= 0) {
      transaction.update(productRef, { rating: 0, ratingCount: 0 });
      return;
    }

    const updatedRating =
      (currentRating * currentCount - removedRating) / newCount;

    transaction.update(productRef, {
      rating: updatedRating,
      ratingCount: newCount,
    });
  });
};
