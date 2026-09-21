import { useEffect, useState } from "react";
import {
  Container,
  Grid,
  Box,
  Typography,
  CircularProgress,
  Alert,
} from "@mui/material";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import { getProductById } from "../services/productService";
import { useProductFeatures } from "../context/ProductFeaturesContext";
import type { Product as ProductType } from "../types";
import ProductCard from "../components/Home/ProductCard";

function WishlistPage() {
  const { wishlistIds, featuresLoading } = useProductFeatures();
  const [products, setProducts] = useState<ProductType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [partialError, setPartialError] = useState<string | null>(null);

  useEffect(() => {
    if (featuresLoading) return;

    let isMounted = true;

    const fetchProducts = async () => {
      if (wishlistIds.length === 0) {
        setProducts([]);
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);
      setPartialError(null);

      const results = await Promise.allSettled(
        wishlistIds.map((id) => getProductById(id)),
      );

      if (isMounted) {
        const fetchedProducts = results
          .filter(
            (result): result is PromiseFulfilledResult<ProductType | null> =>
              result.status === "fulfilled",
          )
          .map((result) => result.value)
          .filter((p): p is ProductType => p !== null);

        setProducts(fetchedProducts);

        const failedCount = results.filter(
          (result) =>
            result.status === "rejected" ||
            (result.status === "fulfilled" && result.value === null),
        ).length;

        if (failedCount > 0) {
          if (fetchedProducts.length === 0) {
            setError("Failed to load wishlist. Please try again.");
          } else {
            setPartialError(
              failedCount === 1
                ? "1 product couldn't be loaded and was skipped."
                : `${failedCount} products couldn't be loaded and were skipped.`,
            );
          }
        }

        setLoading(false);
      }
    };

    fetchProducts();

    return () => {
      isMounted = false;
    };
  }, [wishlistIds, featuresLoading]);

  if (featuresLoading || loading) {
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

      {partialError && (
        <Alert severity="warning" sx={{ mb: 3 }}>
          {partialError}
        </Alert>
      )}

      {products.length === 0 ? (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            py: 8,
            textAlign: "center",
          }}
        >
          <FavoriteBorderIcon
            sx={{
              fontSize: 56,
              color: "text.secondary",
              mb: 2,
            }}
          />

          <Typography variant="h6" sx={{ mb: 1 }}>
            Your Wishlist is Empty
          </Typography>

          <Typography color="text.secondary">
            Save your favorite products and find them here anytime.
          </Typography>
        </Box>
      ) : (
        <Grid container spacing={3}>
          {products.map((product) => (
            <Grid key={product.id} size={{ xs: 12, sm: 6, md: 4 }}>
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
