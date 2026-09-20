// src/pages/WishlistPage.tsx
import { useEffect, useState } from "react";
import {
  Container,
  Grid,
  Box,
  Typography,
  CircularProgress,
  Alert,
} from "@mui/material";
import { getProductById } from "../services/productService";
import { useProductFeatures } from "../context/ProductFeaturesContext";
import type { Product as ProductType } from "../types";
import ProductCard from "../components/Home/ProductCard";

function WishlistPage() {
  const { wishlistIds } = useProductFeatures();
  const [products, setProducts] = useState<ProductType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const fetchProducts = async () => {
      if (wishlistIds.length === 0) {
        setProducts([]);
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);
      try {
        const results = await Promise.all(
          wishlistIds.map((id) => getProductById(id)),
        );
        if (isMounted) {
          setProducts(results.filter((p): p is ProductType => p !== null));
        }
      } catch (err) {
        if (isMounted) {
          setError("Failed to load wishlist. Please try again.");
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchProducts();

    return () => {
      isMounted = false;
    };
  }, [wishlistIds]);

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Container sx={{ py: 4 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  return (
    <Container sx={{ py: 5 }}>
      <Typography variant="h5" sx={{ mb: 3, fontWeight: 600 }}>
        Wishlist
      </Typography>

      {products.length === 0 ? (
        <Typography color="text.secondary">Your wishlist is empty.</Typography>
      ) : (
        <Grid container spacing={1}>
          {products.map((product) => (
            <Grid key={product.id} size={{ xs: 12, sm: 6, md: 3 }}>
              <ProductCard
                id={product.id}
                category={product.category}
                thumbnail={product.thumbnail}
                title={product.title}
                price={product.price}
                discountPercentage={product.discountPercentage}
              />
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
}

export default WishlistPage;
