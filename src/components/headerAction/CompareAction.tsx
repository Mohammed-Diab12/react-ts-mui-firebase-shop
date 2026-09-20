import { IconButton, Typography, Box, Badge } from "@mui/material";
import { Link } from "react-router-dom";
import CompareArrowsIcon from "@mui/icons-material/CompareArrows";
import { useProductFeatures } from "../../context/ProductFeaturesContext";

export const CompareAction = () => {
  const { compareCount } = useProductFeatures();

  return (
    <Box
      component={Link}
      to="/compare"
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 0.5,
        textDecoration: "none",
        color: "inherit",
      }}
    >
      <IconButton aria-label="Compare products" component="span">
        <Badge badgeContent={compareCount} color="error">
          <CompareArrowsIcon />
        </Badge>
      </IconButton>

      <Typography
        variant="body2"
        sx={{
          display: { xs: "block", md: "none" },
        }}
      >
        Compare
      </Typography>
    </Box>
  );
};
