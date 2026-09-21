import { IconButton, Typography, Box, Badge } from "@mui/material";
import { Link } from "react-router-dom";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import { useProductFeatures } from "../../context/ProductFeaturesContext";

export const WishlistAction = () => {
  const { wishlistCount } = useProductFeatures();

  return (
    <Box
      component={Link}
      to="/wishlist"
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 0.5,
        textDecoration: "none",
        color: "inherit",
      }}
    >
      <IconButton aria-label="Wishlist" component="span">
        <Badge badgeContent={wishlistCount} color="error">
          <FavoriteBorderIcon />
        </Badge>
      </IconButton>

      <Typography
        variant="body2"
        sx={{
          display: { xs: "block", md: "none" },
        }}
      >
        Wishlist
      </Typography>
    </Box>
  );
};
