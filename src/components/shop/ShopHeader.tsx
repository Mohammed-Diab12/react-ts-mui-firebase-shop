import { Box, Typography, Divider } from "@mui/material";
import ShoppingBagOutlinedIcon from "@mui/icons-material/ShoppingBagOutlined";

export default function ShopHeader() {
  return (
    <Box sx={{ mb: 4 }}>
      <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
        <ShoppingBagOutlinedIcon
          sx={{ color: "primary.main" }}
          fontSize="large"
        />
        <Box>
          <Typography
            variant="h4"
            component="h1"
            sx={{ fontWeight: 700, color: "brand.main" }}
          >
            Shop
          </Typography>
          <Typography variant="body2" sx={{ color: "content.main" }}>
            Browse our full collection
          </Typography>
        </Box>
      </Box>

      <Divider sx={{ mt: 2.5 }} />
    </Box>
  );
}
