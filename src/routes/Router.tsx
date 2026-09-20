import { createBrowserRouter } from "react-router-dom";
import Layout from "../mainlayout/Layout";
import HomePage from "../pages/HomePage";
import ProductPage from "../pages/ProductPage";
import CartPage from "../pages/CartPage";
import WishlistPage from "../pages/WishlistPage";
import ComparePage from "../pages/ComparePage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: "products/:id",

        element: <ProductPage />,
      },
      {
        path: "cart",
        element: <CartPage />,
      },
      {
        path: "/wishlist",

        element: <WishlistPage />,
      },
      {
        path: "/compare",

        element: <ComparePage />,
      },
    ],
  },
]);
export default router;
