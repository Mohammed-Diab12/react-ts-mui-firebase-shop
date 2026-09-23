import { createBrowserRouter } from "react-router-dom";
import Layout from "../mainlayout/Layout";
import HomePage from "../pages/HomePage";
import ProductPage from "../pages/ProductPage";
import CartPage from "../pages/CartPage";
import WishlistPage from "../pages/WishlistPage";
import ComparePage from "../pages/ComparePage";
import LoginPage from "../pages/LoginPage";
import ProfilePage from "../pages/ProfilePage";
import ShopPage from "../pages/ShopPage";

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
      {
        path: "login",
        element: <LoginPage />,
      },
      {
        path: "profile",
        element: <ProfilePage />,
      },
      {
        path: "shop",
        element: <ShopPage />,
      },
    ],
  },
]);
export default router;
