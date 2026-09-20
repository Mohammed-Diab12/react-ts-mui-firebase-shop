import { RouterProvider } from "react-router-dom";
import router from "./routes/Router";
import { CartProvider } from "./context/CartContext";
import { AppThemeProvider } from "./theme/ThemeProvider";
import { AuthProvider } from "./context/AuthContext";
function App() {
  return (
    <AppThemeProvider>
      <AuthProvider>
        <CartProvider>
          <RouterProvider router={router} />
        </CartProvider>
      </AuthProvider>
    </AppThemeProvider>
  );
}

export default App;
