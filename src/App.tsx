import { RouterProvider } from "react-router-dom";
import router from "./routes/Router";
import { CartProvider } from "./context/CartContext";
import { AppThemeProvider } from "./theme/ThemeProvider";
import { ProductFeaturesProvider } from "./context/ProductFeaturesContext";

function App() {
  return (
    <AppThemeProvider>
      <CartProvider>
        <ProductFeaturesProvider>
          <RouterProvider router={router} />
        </ProductFeaturesProvider>
      </CartProvider>
    </AppThemeProvider>
  );
}

export default App;
