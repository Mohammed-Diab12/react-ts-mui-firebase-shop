import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Alert, Box, CircularProgress, Container } from "@mui/material";
import { getProductById } from "../services/productService";
import type { Product as ProductType } from "../types";
import { ProductGallery } from "../components/product/ProductGallery";
import { ProductInfo } from "../components/product/ProductInfo";
import { ProductMeta } from "../components/product/ProductMeta";
import { ProductTabs } from "../components/product/ProductTabs";
import QuantityStepper from "../components/cart/QuantityStepper";
import { AddToCartActions } from "../components/product/AddToCartButton";
import { ProductSecondaryActions } from "../components/product/ProductSecondaryActions";

function Product() {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<ProductType | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    if (!id) {
      setLoading(false);
      return;
    }

    let isMounted = true;

    const fetchProduct = async () => {
      setLoading(true);
      setError(null);
      try {
        const result = await getProductById(id);
        if (isMounted) {
          setProduct(result);
        }
      } catch (err) {
        if (isMounted) {
          setError("Failed to load product. Please try again.");
          console.error(err);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchProduct();

    return () => {
      isMounted = false;
    };
  }, [id]);

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
  if (!product) {
    return (
      <Container sx={{ py: 4 }}>
        <Alert severity="error">Product not found</Alert>
      </Container>
    );
  }

  return (
    <Container sx={{ py: 5 }}>
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          alignItems: { xs: "center", md: "stretch" },
          gap: 4,
        }}
      >
        <Box sx={{ flex: 1 }}>
          <ProductGallery images={product.images} alt={product.title} />
        </Box>

        <Box sx={{ flex: 1, gap: 2, display: "flex", flexDirection: "column" }}>
          <ProductInfo product={product} />

          <Box sx={{ display: "flex", alignItems: "center", gap: 2, my: 2 }}>
            <QuantityStepper
              maxQuantity={product.stock}
              value={quantity}
              onChange={setQuantity}
            />
            <AddToCartActions product={product} quantity={quantity} />
            <ProductSecondaryActions />
          </Box>

          <ProductMeta product={product} />
        </Box>
      </Box>

      <Box sx={{ width: { xs: "100%", md: "70%" }, mx: "auto" }}>
        <ProductTabs product={product} />
      </Box>
    </Container>
  );
}

export default Product;
