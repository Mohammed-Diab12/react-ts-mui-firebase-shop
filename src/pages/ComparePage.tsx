import { useEffect, useState, type ReactNode } from "react";
import {
  Container,
  Box,
  Typography,
  CircularProgress,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
} from "@mui/material";
import CompareArrowsIcon from "@mui/icons-material/CompareArrows";
import CloseIcon from "@mui/icons-material/Close";
import { Link as RouterLink } from "react-router-dom";
import { getProductById } from "../services/productService";
import { useProductFeatures } from "../context/ProductFeaturesContext";
import type { Product } from "../types";
import { formatPrice } from "../components/cart/utils";

interface ComparisonRow {
  label: string;
  renderValue: (product: Product) => ReactNode;
}

const comparisonRows: ComparisonRow[] = [
  {
    label: "Category",
    renderValue: (product) => product.category,
  },
  {
    label: "Price",
    renderValue: (product) => {
      const discountPercentage = product.discountPercentage ?? 0;
      const hasDiscount = discountPercentage > 0;
      const finalPrice = hasDiscount
        ? product.price - (product.price * discountPercentage) / 100
        : product.price;

      return (
        <Box
          sx={{
            display: "flex",
            gap: 1,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Typography sx={{ fontWeight: 700, color: "primary.main" }}>
            {formatPrice(finalPrice)}
          </Typography>
          {hasDiscount && (
            <Typography
              sx={{ textDecoration: "line-through", color: "text.secondary" }}
            >
              {formatPrice(product.price)}
            </Typography>
          )}
        </Box>
      );
    },
  },
  {
    label: "Discount",
    renderValue: (product) => {
      const discountPercentage = product.discountPercentage ?? 0;
      return discountPercentage > 0 ? `${discountPercentage}%` : "—";
    },
  },
  {
    label: "Stock",
    renderValue: (product) =>
      product.stock > 0 ? `${product.stock} available` : "Out of stock",
  },
  {
    label: "SKU",
    renderValue: (product) => product.sku ?? "—",
  },
  {
    label: "Description",
    renderValue: (product) => (
      <Typography
        variant="body2"
        sx={{
          color: "text.secondary",
          display: "-webkit-box",
          WebkitLineClamp: 4,
          WebkitBoxOrient: "vertical",
          overflow: "hidden",
        }}
      >
        {product.description}
      </Typography>
    ),
  },
];

function ComparePage() {
  const { compareIds, featuresLoading, toggleCompare } = useProductFeatures();
  const [comparedProducts, setComparedProducts] = useState<Product[]>([]);
  const [isLoadingProducts, setIsLoadingProducts] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [partialError, setPartialError] = useState<string | null>(null);

  useEffect(() => {
    if (featuresLoading) return;

    let isMounted = true;

    const fetchComparedProducts = async () => {
      if (compareIds.length === 0) {
        setComparedProducts([]);
        setIsLoadingProducts(false);
        return;
      }

      setIsLoadingProducts(true);
      setLoadError(null);
      setPartialError(null);

      const results = await Promise.allSettled(
        compareIds.map((productId) => getProductById(productId)),
      );

      if (isMounted) {
        const fetchedProducts = results
          .filter(
            (result): result is PromiseFulfilledResult<Product | null> =>
              result.status === "fulfilled",
          )
          .map((result) => result.value)
          .filter((product): product is Product => product !== null);

        setComparedProducts(fetchedProducts);

        const failedCount = results.filter(
          (result) =>
            result.status === "rejected" ||
            (result.status === "fulfilled" && result.value === null),
        ).length;

        if (failedCount > 0) {
          if (fetchedProducts.length === 0) {
            setLoadError("Failed to load compare list. Please try again.");
          } else {
            setPartialError(
              failedCount === 1
                ? "1 product couldn't be loaded and was skipped."
                : `${failedCount} products couldn't be loaded and were skipped.`,
            );
          }
        }

        setIsLoadingProducts(false);
      }
    };

    fetchComparedProducts();

    return () => {
      isMounted = false;
    };
  }, [compareIds, featuresLoading]);

  if (featuresLoading || isLoadingProducts) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (loadError) {
    return (
      <Container sx={{ py: 4 }}>
        <Alert severity="error">{loadError}</Alert>
      </Container>
    );
  }

  return (
    <Container sx={{ py: 5 }}>
      <Typography variant="h5" sx={{ mb: 3, fontWeight: 600 }}>
        Compare
      </Typography>

      {partialError && (
        <Alert severity="warning" sx={{ mb: 3 }}>
          {partialError}
        </Alert>
      )}

      {comparedProducts.length === 0 ? (
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
          <CompareArrowsIcon
            sx={{ fontSize: 56, color: "text.secondary", mb: 2 }}
          />

          <Typography variant="h6" sx={{ mb: 1 }}>
            Your Compare List is Empty
          </Typography>

          <Typography color="text.secondary">
            Add products to compare them here.
          </Typography>
        </Box>
      ) : (
        <TableContainer component={Paper} sx={{ overflowX: "auto" }}>
          <Table>
            <TableHead>
              <TableRow>
                {/* Empty corner cell above the attribute labels column */}
                <TableCell sx={{ minWidth: 140 }} />

                {comparedProducts.map((product) => (
                  <TableCell
                    key={product.id}
                    align="center"
                    sx={{ minWidth: 200, verticalAlign: "top" }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                      }}
                    >
                      <IconButton
                        aria-label="Remove from compare"
                        size="small"
                        onClick={() => toggleCompare(product.id)}
                        sx={{ alignSelf: "flex-end" }}
                      >
                        <CloseIcon fontSize="small" />
                      </IconButton>

                      <Box
                        component={RouterLink}
                        to={`/products/${product.id}`}
                        sx={{ textDecoration: "none", color: "inherit" }}
                      >
                        <Box
                          component="img"
                          src={product.thumbnail}
                          alt={product.title}
                          sx={{
                            width: 120,
                            height: 120,
                            objectFit: "contain",
                            mb: 1,
                          }}
                        />
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                          {product.title}
                        </Typography>
                      </Box>
                    </Box>
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>

            <TableBody>
              {comparisonRows.map((row) => (
                <TableRow key={row.label}>
                  <TableCell
                    sx={{ fontWeight: 600, backgroundColor: "action.hover" }}
                  >
                    {row.label}
                  </TableCell>

                  {comparedProducts.map((product) => (
                    <TableCell key={product.id} align="center">
                      {row.renderValue(product)}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Container>
  );
}

export default ComparePage;
