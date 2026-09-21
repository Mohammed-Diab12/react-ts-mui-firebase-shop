import { createBrowserRouter } from "react-router-dom";
import Layout from "../mainlayout/Layout";
import HomePage from "../pages/HomePage";
import ProductPage from "../pages/ProductPage";
import CartPage from "../pages/CartPage";
import LoginPage from "../pages/LoginPage";
import CreateProductPage from "../pages/CreateProductPage";

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
        path: "products/new",
        element: <CreateProductPage />,
      },
      {
        path: "cart",
        element: <CartPage />,
      },
      {
        path: "login",
        element: <LoginPage />,
      },
    ],
  },
]);
export default router;
