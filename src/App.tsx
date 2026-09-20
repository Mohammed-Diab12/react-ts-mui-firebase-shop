import { RouterProvider } from "react-router-dom";
import router from "./routes/Router";
import { CartProvider } from "./context/CartContext";
import { AppThemeProvider } from "./theme/ThemeProvider";
import { ProductFeaturesProvider } from "./context/ProductFeaturesContext";
import { AuthProvider } from "./context/AuthContext";
function App() {
  return (
    <AppThemeProvider>
      <AuthProvider>
        <CartProvider>
          <ProductFeaturesProvider>
            <RouterProvider router={router} />
          </ProductFeaturesProvider>
        </CartProvider>
      </AuthProvider>
    </AppThemeProvider>
  );
}

export default App;
