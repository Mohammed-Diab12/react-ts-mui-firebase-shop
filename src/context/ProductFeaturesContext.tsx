import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
  type ReactNode,
} from "react";
import {
  getWishlistIds,
  toggleWishlistId,
  getCompareIds,
  toggleCompareId,
} from "../services/productFeaturesService";
import { useAuth } from "./AuthContext";

interface ProductFeaturesContextValue {
  wishlistIds: string[];
  wishlistCount: number;
  isInWishlist: (productId: string) => boolean;
  toggleWishlist: (productId: string) => Promise<void>;

  compareIds: string[];
  compareCount: number;
  isInCompare: (productId: string) => boolean;
  toggleCompare: (productId: string) => Promise<void>;

  featuresLoading: boolean;
}

const ProductFeaturesContext = createContext<
  ProductFeaturesContextValue | undefined
>(undefined);

export const ProductFeaturesProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const { user } = useAuth();
  const uid = user?.uid;

  const [wishlistIds, setWishlistIds] = useState<string[]>([]);
  const [compareIds, setCompareIds] = useState<string[]>([]);
  const [featuresLoading, setFeaturesLoading] = useState(true);

  useEffect(() => {
    if (!uid) {
      setWishlistIds([]);
      setCompareIds([]);
      setFeaturesLoading(false);
      return;
    }

    let isMounted = true;

    const loadFeatures = async () => {
      setFeaturesLoading(true);

      const [wishlist, compare] = await Promise.all([
        getWishlistIds(uid),
        getCompareIds(uid),
      ]);

      if (isMounted) {
        setWishlistIds(wishlist);
        setCompareIds(compare);
        setFeaturesLoading(false);
      }
    };

    loadFeatures();

    return () => {
      isMounted = false;
    };
  }, [uid]);

  const toggleWishlist = useCallback(
    async (productId: string) => {
      if (!uid) return;
      const updated = await toggleWishlistId(uid, productId);
      setWishlistIds(updated);
    },
    [uid],
  );

  const toggleCompare = useCallback(
    async (productId: string) => {
      if (!uid) return;
      const updated = await toggleCompareId(uid, productId);
      setCompareIds(updated);
    },
    [uid],
  );

  const isInWishlist = useCallback(
    (productId: string) => wishlistIds.includes(productId),
    [wishlistIds],
  );

  const isInCompare = useCallback(
    (productId: string) => compareIds.includes(productId),
    [compareIds],
  );

  const value = useMemo(
    () => ({
      wishlistIds,
      wishlistCount: wishlistIds.length,
      isInWishlist,
      toggleWishlist,

      compareIds,
      compareCount: compareIds.length,
      isInCompare,
      toggleCompare,

      featuresLoading,
    }),
    [
      wishlistIds,
      compareIds,
      isInWishlist,
      toggleWishlist,
      isInCompare,
      toggleCompare,
      featuresLoading,
    ],
  );

  return (
    <ProductFeaturesContext.Provider value={value}>
      {children}
    </ProductFeaturesContext.Provider>
  );
};

export const useProductFeatures = () => {
  const context = useContext(ProductFeaturesContext);
  if (!context) {
    throw new Error(
      "useProductFeatures must be used within a ProductFeaturesProvider",
    );
  }
  return context;
};
