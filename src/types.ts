// Product
export type ProductCategory =
  | "Smartphone"
  | "Tablet"
  | "Audio & Sound"
  | "Laptop";

export interface Product {
  id: string;
  category: ProductCategory;
  title: string;
  description: string;
  images: string[];
  thumbnail: string;
  price: number;
  discountPercentage?: number;
  stock: number;
  sku: string;
  rating: number;
  ratingCount: number;
}

// Review
export interface Review {
  id: string;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  createdAt: Date | null;
}

// Cart
export interface CartItem {
  productId: string;
  title: string;
  price: number;
  thumbnail: string;
  quantity: number;
  stock: number;
}

export interface CartSummary {
  subtotal: number;
  shipping: number;
  total: number;
}
