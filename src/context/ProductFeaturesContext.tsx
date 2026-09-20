import {
  createContext,
  useContext,
  useState,
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

interface ProductFeaturesContextValue {
  wishlistIds: string[];
  wishlistCount: number;
  isInWishlist: (productId: string) => boolean;
  toggleWishlist: (productId: string) => void;

  compareIds: string[];
  compareCount: number;
  isInCompare: (productId: string) => boolean;
  toggleCompare: (productId: string) => void;
}

const ProductFeaturesContext = createContext<
  ProductFeaturesContextValue | undefined
>(undefined);

export const ProductFeaturesProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [wishlistIds, setWishlistIds] = useState<string[]>(getWishlistIds);
  const [compareIds, setCompareIds] = useState<string[]>(getCompareIds);

  const toggleWishlist = useCallback((productId: string) => {
    setWishlistIds(toggleWishlistId(productId));
  }, []);

  const toggleCompare = useCallback((productId: string) => {
    setCompareIds(toggleCompareId(productId));
  }, []);

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
    }),
    [
      wishlistIds,
      compareIds,
      isInWishlist,
      toggleWishlist,
      isInCompare,
      toggleCompare,
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
