import { Link as RouterLink } from "react-router-dom";
import type { Product } from "../../types";
import { formatPrice } from "../cart/utils";
import { CardContent, CardMedia, Typography, Box } from "@mui/material";

type ProductProps = Pick<
  Product,
  "id" | "category" | "thumbnail" | "title" | "price" | "discountPercentage"
>;

function ProductCard({
  id,
  category,
  thumbnail,
  title,
  price,
  discountPercentage,
}: ProductProps) {
  const hasDiscount = !!discountPercentage && discountPercentage > 0;
  const discountedPrice = hasDiscount
    ? price - (price * discountPercentage) / 100
    : price;
  const formattedPrice = formatPrice(discountedPrice);
  const formattedOriginalPrice = formatPrice(price);

  const isHorizontal = category === "Laptop";

  return (
    <Box
      component={RouterLink}
      to={`/products/${id}`}
      sx={{
        position: "relative",
        display: "flex",
        flexDirection: isHorizontal ? "row" : "column",
        alignItems: isHorizontal ? "center" : "stretch",
        backgroundColor: "background.paper",
        textDecoration: "none",
        color: "inherit",
        p: isHorizontal ? 1 : 0,
        gap: isHorizontal ? 2 : 0,
        border: "none",
        width: "100%",
        height: "100%",
        boxSizing: "border-box",
      }}
    >
      {hasDiscount && (
        <Box
          sx={{
            position: "absolute",
            top: 12,
            left: 12,
            backgroundColor: "error.main",
            color: "white",
            px: 1,
            py: 0.2,
            fontSize: "0.8rem",
            fontWeight: 700,
            zIndex: 1,
          }}
        >
          -{discountPercentage}%
        </Box>
      )}

      <CardMedia
        component="img"
        image={thumbnail}
        alt={title}
        sx={
          isHorizontal
            ? { width: 90, height: "100%", objectFit: "contain", flexShrink: 0 }
            : { height: 140, objectFit: "contain" }
        }
      />

      <CardContent
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: isHorizontal ? "flex-start" : "center",
          textAlign: isHorizontal ? "left" : "center",
          width: "100%",
          p: isHorizontal ? 0 : undefined,
          "&:last-child": { pb: isHorizontal ? 0 : undefined },
        }}
      >
        <Typography
          variant="body2"
          sx={{ wordBreak: "break-word" }}
        >
          {title}
        </Typography>

        <Box sx={{ display: "flex", gap: 1, mt: isHorizontal ? 0.5 : 1.5 }}>
          <Typography
            variant="body1"
            sx={{ color: "primary.main", fontWeight: 700 }}
          >
            {formattedPrice}
          </Typography>
          {hasDiscount && (
            <Typography
              variant="body1"
              sx={{
                color: "text.secondary",
                textDecorationLine: "line-through",
                fontWeight: 700,
              }}
            >
              {formattedOriginalPrice}
            </Typography>
          )}
        </Box>
      </CardContent>
    </Box>
  );
}

export default ProductCard;