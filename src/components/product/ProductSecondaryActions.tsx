import { IconButton, Stack } from "@mui/material";
import { useNavigate } from "react-router-dom";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import CompareArrowsIcon from "@mui/icons-material/CompareArrows";
import { useProductFeatures } from "../../context/ProductFeaturesContext";
import { useAuth } from "../../context/AuthContext";

interface ProductSecondaryActionsProps {
  productId: string;
}

export const ProductSecondaryActions = ({
  productId,
}: ProductSecondaryActionsProps) => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const { isInWishlist, toggleWishlist, isInCompare, toggleCompare } =
    useProductFeatures();

  const isWishlisted = isInWishlist(productId);
  const isCompared = isInCompare(productId);

  const requireAuth = (action: () => Promise<void>) => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    action();
  };

  return (
    <Stack direction="row" spacing={1}>
      <IconButton
        aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
        onClick={() => requireAuth(() => toggleWishlist(productId))}
        sx={{
          border: "1px solid",
          borderColor: "divider",
          borderRadius: 1,
          color: isWishlisted ? "primary.main" : "text.primary",
        }}
      >
        {isWishlisted ? (
          <FavoriteIcon fontSize="small" />
        ) : (
          <FavoriteBorderIcon fontSize="small" />
        )}
      </IconButton>

      <IconButton
        aria-label={isCompared ? "Remove from compare" : "Add to compare"}
        onClick={() => requireAuth(() => toggleCompare(productId))}
        sx={{
          border: "1px solid",
          borderColor: "divider",
          borderRadius: 1,
          color: isCompared ? "primary.main" : "text.primary",
        }}
      >
        <CompareArrowsIcon fontSize="small" />
      </IconButton>
    </Stack>
  );
};
