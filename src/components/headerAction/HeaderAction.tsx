import { Box, IconButton, Badge, Typography } from "@mui/material";
import { Link } from "react-router-dom";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import { useCart } from "../../context/CartContext";
import { formatPrice } from "../cart/utils";
import { WishlistAction } from "./WishlistAction";
import { CompareAction } from "./CompareAction";

export const HeaderActions = () => {
  const { items, itemCount } = useCart();

  const subtotal = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: { xs: "column", md: "row" },
        alignItems: { xs: "stretch", md: "center" },
        gap: { xs: 1.5, md: 1 },
      }}
    >
      <CompareAction />
      <WishlistAction />

      <Box
        component={Link}
        to="/cart"
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 2,
          textDecoration: "none",
          color: "inherit",
        }}
      >
        <IconButton aria-label="Shopping cart" component="span">
          <Badge badgeContent={itemCount} color="error">
            <ShoppingCartOutlinedIcon />
          </Badge>
        </IconButton>

        <Box sx={{ lineHeight: 1.3 }}>
          <Typography
            variant="body2"
            sx={{
              fontWeight: 500,
              color: "text.primary",
              fontSize: "0.870rem",
            }}
          >
            Your Cart
          </Typography>
          <Typography
            variant="body2"
            sx={{
              color: "text.secondary",
              display: { xs: "none", md: "block" },
            }}
          >
            {formatPrice(subtotal)}
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};
