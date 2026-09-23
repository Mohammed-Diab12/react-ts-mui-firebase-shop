import { Grid, Box, Typography } from "@mui/material";
import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined";
import ProductCard from "../Home/ProductCard";
import type { Product } from "../../types";

interface ProductGridProps {
  products: Product[];
}

export default function ProductGrid({ products }: ProductGridProps) {
  if (products.length === 0) {
    return (
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          py: 8,
          color: "text.secondary",
        }}
      >
        <Inventory2OutlinedIcon sx={{ fontSize: 56, mb: 1.5, opacity: 0.5 }} />
        <Typography variant="h6" sx={{ fontWeight: 600 }}>
          No products found
        </Typography>
        <Typography variant="body2">
          Try adjusting your filters or check back later.
        </Typography>
      </Box>
    );
  }

  return (
    <Grid container spacing={3}>
      {products.map((product) => (
        <Grid key={product.id} size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
          <ProductCard {...product} />
        </Grid>
      ))}
    </Grid>
  );
}
