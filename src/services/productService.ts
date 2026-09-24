import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
  addDoc,
  runTransaction,
  QueryDocumentSnapshot,
} from "firebase/firestore";
import { db } from "./firebase";
import type { Product } from "../types";

const products_Collections = "products";
const productsCollection = collection(db, products_Collections);

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
  const productRef = doc(db, products_Collections, id);
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

// Recalculate rating/ratingCount after a new review is added
export const applyReviewAdded = async (
  productId: string,
  newRating: number,
): Promise<void> => {
  const productRef = doc(db, products_Collections, productId);

  await runTransaction(db, async (transaction) => {
    const productSnap = await transaction.get(productRef);
    if (!productSnap.exists()) return;

    const data = productSnap.data();
    const currentRating = data.rating ?? 0;
    const currentCount = data.ratingCount ?? 0;

    const newCount = currentCount + 1;
    const updatedRating = (currentRating * currentCount + newRating) / newCount;

    transaction.update(productRef, {
      rating: updatedRating,
      ratingCount: newCount,
    });
  });
};

// Recalculate rating after an existing review is edited
export const applyReviewUpdated = async (
  productId: string,
  oldRating: number,
  newRating: number,
): Promise<void> => {
  const productRef = doc(db, products_Collections, productId);

  await runTransaction(db, async (transaction) => {
    const productSnap = await transaction.get(productRef);
    if (!productSnap.exists()) return;

    const data = productSnap.data();
    const currentRating = data.rating ?? 0;
    const currentCount = data.ratingCount ?? 0;

    if (currentCount === 0) return;

    const updatedRating =
      (currentRating * currentCount - oldRating + newRating) / currentCount;

    transaction.update(productRef, {
      rating: updatedRating,
    });
  });
};

// Recalculate rating/ratingCount after a review is deleted
export const applyReviewDeleted = async (
  productId: string,
  removedRating: number,
): Promise<void> => {
  const productRef = doc(db, products_Collections, productId);

  await runTransaction(db, async (transaction) => {
    const productSnap = await transaction.get(productRef);
    if (!productSnap.exists()) return;

    const data = productSnap.data();
    const currentRating = data.rating ?? 0;
    const currentCount = data.ratingCount ?? 0;

    const newCount = currentCount - 1;

    if (newCount <= 0) {
      transaction.update(productRef, {
        rating: 0,
        ratingCount: 0,
      });
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
