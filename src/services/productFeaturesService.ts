// productFeaturesService.ts

const WISHLIST_KEY = "wishlist_items";
const COMPARE_KEY = "compare_items";

// Generic localStorage helpers — shared by wishlist and compare
const getIds = (key: string): string[] => {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as string[]) : [];
  } catch {
    return [];
  }
};

const setIds = (key: string, ids: string[]): void => {
  try {
    localStorage.setItem(key, JSON.stringify(ids));
  } catch {
    console.error("Failed to save product IDs to localStorage.");
  }
};

const toggleId = (key: string, productId: string): string[] => {
  const current = getIds(key);
  const exists = current.includes(productId);
  const updated = exists
    ? current.filter((id) => id !== productId)
    : [...current, productId];

  setIds(key, updated);
  return updated;
};

// Wishlist
export const getWishlistIds = (): string[] => getIds(WISHLIST_KEY);
export const toggleWishlistId = (productId: string): string[] =>
  toggleId(WISHLIST_KEY, productId);

// Compare
export const getCompareIds = (): string[] => getIds(COMPARE_KEY);
export const toggleCompareId = (productId: string): string[] =>
  toggleId(COMPARE_KEY, productId);
