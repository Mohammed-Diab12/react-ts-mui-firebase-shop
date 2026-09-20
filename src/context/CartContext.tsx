import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
  useRef,
  type ReactNode,
} from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../services/firebase";
import type { CartItem } from "../types";
import {
  getCartId,
  getCart,
  addToCart as addToCartService,
  updateCartItem as updateCartItemService,
  removeFromCart as removeFromCartService,
  clearCart as clearCartService,
} from "../services/cartService";

interface CartContextValue {
  items: CartItem[];
  loading: boolean;
  itemCount: number;
  addItem: (
    product: Pick<
      CartItem,
      "productId" | "title" | "price" | "thumbnail" | "stock"
    >,
    quantity?: number,
  ) => Promise<void>;
  updateQuantity: (productId: string, quantity: number) => void;
  removeItem: (productId: string) => Promise<void>;
  clearAll: () => Promise<void>;
  refresh: () => Promise<void>;
}

const CartContext = createContext<CartContextValue | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const updateTimeouts = useRef<Record<string, ReturnType<typeof setTimeout>>>(
    {},
  );

  const cartIdRef = useRef<string | null>(null);

  const loadCartFor = useCallback(async (id: string) => {
    cartIdRef.current = id;
    const cartItems = await getCart(id);
    setItems(cartItems);
    setLoading(false);
  }, []);

  const refresh = useCallback(async () => {
    const id = cartIdRef.current;
    if (!id) return;
    const cartItems = await getCart(id);
    setItems(cartItems);
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (!currentUser) {
        cartIdRef.current = null;
        setItems([]);
        await getCartId().catch(() => {});
        return;
      }
      if (currentUser.uid !== cartIdRef.current) {
        await loadCartFor(currentUser.uid);
      }
    });

    return () => {
      unsubscribe();
      Object.values(updateTimeouts.current).forEach(clearTimeout);
      updateTimeouts.current = {};
    };
  }, [loadCartFor]);

  const addItem: CartContextValue["addItem"] = async (
    product,
    quantity = 1,
  ) => {
    const id = cartIdRef.current;
    if (!id) return;
    await addToCartService(id, product, quantity);
    await refresh();
  };

  const updateQuantity = (productId: string, quantity: number) => {
    const id = cartIdRef.current;
    if (!id) return;
    setItems((prev) =>
      prev
        .map((item) =>
          item.productId === productId ? { ...item, quantity } : item,
        )
        .filter((item) => item.quantity > 0),
    );
    if (updateTimeouts.current[productId]) {
      clearTimeout(updateTimeouts.current[productId]);
    }
    updateTimeouts.current[productId] = setTimeout(async () => {
      try {
        await updateCartItemService(id, productId, quantity);
      } catch (error) {
        console.error("Failed to update cart quantity:", error);
        await refresh();
      }
      delete updateTimeouts.current[productId];
    }, 500);
  };

  const removeItem = async (productId: string) => {
    const id = cartIdRef.current;
    if (!id) return;
    setItems((prev) => prev.filter((item) => item.productId !== productId));
    await removeFromCartService(id, productId);
    await refresh();
  };

  const clearAll = async () => {
    const id = cartIdRef.current;
    if (!id) return;
    setItems([]);
    await clearCartService(id);
  };

  const itemCount = useMemo(
    () => items.reduce((sum, item) => sum + item.quantity, 0),
    [items],
  );

  const value: CartContextValue = {
    items,
    loading,
    itemCount,
    addItem,
    updateQuantity,
    removeItem,
    clearAll,
    refresh,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = (): CartContextValue => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
