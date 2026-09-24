import { useState } from "react";
import { Box, Divider, Tab, Tabs, Typography } from "@mui/material";
import type { Product } from "../../types";
import { ReviewForm } from "./ReviewForm";
import { ProductReviews } from "./ProductReviews";

export interface ProductTabsProps {
  product: Product;
  onReviewSubmitted: () => void;
  reviewsRefreshKey: number;
}

export const ProductTabs = ({
  product,
  onReviewSubmitted,
  reviewsRefreshKey,
}: ProductTabsProps) => {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <Box>
      <Tabs
        value={activeTab}
        onChange={(_, newValue) => setActiveTab(newValue)}
        centered
        sx={{
          "& .MuiTab-root": {
            color: "text.secondary",
          },
          "& .MuiTab-root.Mui-selected": {
            color: "secondary.main",
          },
          "& .MuiTabs-indicator": {
            backgroundColor: "secondary.main",
          },
        }}
      >
        <Tab label="DETAILS" />
        <Tab label="MORE INFORMATION" />
        <Tab label="REVIEWS" />
      </Tabs>

      <Divider />

      <Box sx={{ mt: 3 }}>
        {activeTab === 0 && (
          <Typography
            variant="body1"
            sx={{
              color: "text.primary",
              fontSize: "0.875rem",
              lineHeight: 1.7,
            }}
          >
            {product.description}
          </Typography>
        )}
        {activeTab === 1 && (
          <Typography variant="body2" sx={{ color: "text.secondary" }}>
            No additional information available.
          </Typography>
        )}
        {activeTab === 2 && (
          <Box sx={{ display: "flex", flexDirection: "column", gap: 4 }}>
            <ReviewForm
              productId={product.id}
              onReviewSubmitted={onReviewSubmitted}
            />
            <ProductReviews
              productId={product.id}
              refreshKey={reviewsRefreshKey}
            />
          </Box>
        )}
      </Box>
    </Box>
  );
};
