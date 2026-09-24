import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import {
  Container,
  CircularProgress,
  Alert,
  Box,
  Typography,
} from "@mui/material";
import ShopHeader from "../components/shop/ShopHeader";
import ShopFilters from "../components/shop/ShopFilters";
import type { ShopFiltersState } from "../components/shop/ShopFilters";
import ProductGrid from "../components/shop/ProductGrid";
import ShopPagination from "../components/shop/ShopPagination";
import { getAllProducts } from "../services/productService";
import type { Product } from "../types";

const categories: Product["category"][] = [
  "Smartphone",
  "Tablet",
  "Audio & Sound",
  "Laptop",
];

const PRODUCTS_PER_PAGE = 12;

export default function ShopPage() {
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get("q")?.trim() ?? "";

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [filters, setFilters] = useState<ShopFiltersState>({
    category: "all",
    sortBy: "title-asc",
  });
  const [page, setPage] = useState(1);

  useEffect(() => {
    getAllProducts()
      .then(setProducts)
      .catch(() => setError("Failed to load products. Please try again."))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    setPage(1);
  }, [searchQuery]);

  const filteredProducts = useMemo(() => {
    let result = products;

    if (searchQuery) {
      const lowerQuery = searchQuery.toLowerCase();
      result = result.filter((p) => p.title.toLowerCase().includes(lowerQuery));
    }

    if (filters.category !== "all") {
      result = result.filter((p) => p.category === filters.category);
    }

    result = [...result].sort((a, b) => {
      switch (filters.sortBy) {
        case "price-asc":
          return a.price - b.price;
        case "price-desc":
          return b.price - a.price;
        case "title-asc":
          return a.title.localeCompare(b.title);
      }
    });

    return result;
  }, [products, filters, searchQuery]);

  const pageCount = Math.ceil(filteredProducts.length / PRODUCTS_PER_PAGE);

  const paginatedProducts = useMemo(
    () =>
      filteredProducts.slice(
        (page - 1) * PRODUCTS_PER_PAGE,
        page * PRODUCTS_PER_PAGE,
      ),
    [filteredProducts, page],
  );

  const handleFiltersChange = (newFilters: ShopFiltersState) => {
    setFilters(newFilters);
    setPage(1);
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <Container sx={{ py: 4 }}>
      <ShopHeader />

      {searchQuery && (
        <Box sx={{ mb: 2 }}>
          <Typography variant="body2" color="text.secondary">
            Search results for <strong>&ldquo;{searchQuery}&rdquo;</strong>
            {!loading && ` — ${filteredProducts.length} found`}
          </Typography>
        </Box>
      )}

      <ShopFilters
        categories={categories}
        filters={filters}
        onChange={handleFiltersChange}
      />

      {loading && (
        <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
          <CircularProgress />
        </Box>
      )}

      {!loading && error && <Alert severity="error">{error}</Alert>}

      {!loading && !error && (
        <>
          <ProductGrid products={paginatedProducts} />
          <ShopPagination
            page={page}
            count={pageCount}
            onChange={handlePageChange}
          />
        </>
      )}
    </Container>
  );
}
