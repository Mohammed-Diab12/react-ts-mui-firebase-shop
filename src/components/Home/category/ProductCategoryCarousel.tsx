import { useEffect, useMemo, useState } from "react";

import { Box, Typography, CircularProgress } from "@mui/material";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Grid } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/grid";

import { getProductsByCategories } from "../../../services/productService";
import ProductCard from "../ProductCard";
import type { Product } from "../../../types";

const CARD_GAP = 10;

const PAGINATION_CONFIG = { clickable: true };

// slidesPerView الافتراضي لكل breakpoint
const DEFAULT_SLIDES_PER_VIEW = {
  0: 2,
  600: 3,
  900: 4,
  1200: 5,
};

function getCarouselBreakpoints(
  rows: number,
  slidesPerView: Record<number, number>,
) {
  return Object.fromEntries(
    Object.entries(slidesPerView).map(([bp, slides]) => [
      bp,
      {
        slidesPerView: slides,
        slidesPerGroup: slides,
        grid: { rows, fill: "row" as const },
      },
    ]),
  );
}

interface ProductCategoryCarouselProps {
  categoryTitle: string;
  categories: Product["category"][];
  rows?: number;
  cardHeight?: number;
  slidesPerView?: Record<number, number>;
}

function ProductCategoryCarousel({
  categoryTitle,
  categories,
  rows = 1,
  cardHeight = 340,
  slidesPerView = DEFAULT_SLIDES_PER_VIEW,
}: ProductCategoryCarouselProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const breakpoints = useMemo(
    () => getCarouselBreakpoints(rows, slidesPerView),
    [rows, slidesPerView],
  );

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError(false);

      try {
        const data = await getProductsByCategories(categories);
        setProducts(data);
      } catch (error) {
        console.error(`Failed to fetch ${categoryTitle} products:`, error);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [categories, categoryTitle]);

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
        <CircularProgress size={28} />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ py: 4, textAlign: "center" }}>
        <Typography variant="body2" color="text.secondary">
          Couldn't load {categoryTitle} products. Please try again later.
        </Typography>
      </Box>
    );
  }

  if (!products.length) {
    return null;
  }

  return (
    <Box>
      {/* Title */}
      <Box sx={{ mb: 2 }}>
        <Typography variant="h6" sx={{ fontWeight: 600 }}>
          {categoryTitle}
        </Typography>

        <Box sx={{ width: 115, height: 3, bgcolor: "error.main", mt: 0.5 }} />
      </Box>
      {/* Products */}
      <Box
        role="region"
        aria-label={`${categoryTitle} products`}
        sx={{
          mt: 5,
          pb: 4,
          "& .swiper-pagination-bullet": {
            backgroundColor: "content.main",
            opacity: 1,
            borderRadius: 0,
            width: 24,
            height: 4,
          },
          "& .swiper-pagination-bullet-active": {
            backgroundColor: "error.main",
            height: 5,
          },
        }}
      >
        <Swiper
          modules={[Pagination, Grid]}
          spaceBetween={CARD_GAP}
          pagination={PAGINATION_CONFIG}
          breakpoints={breakpoints}
          grid={{ rows, fill: "row" }}
        >
          {products.map((product) => (
            <SwiperSlide
              key={product.id}
              style={{ height: rows > 1 ? cardHeight : "auto" }}
            >
              <Box
                sx={{
                  display: "flex",
                  height: "100%",
                }}
              >
                <ProductCard
                  id={product.id}
                  category={product.category}
                  thumbnail={product.thumbnail}
                  title={product.title}
                  price={product.price}
                  discountPercentage={product.discountPercentage}
                />
              </Box>
            </SwiperSlide>
          ))}
        </Swiper>
      </Box>
    </Box>
  );
}

export default ProductCategoryCarousel;
