import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Rating,
  Divider,
  IconButton,
  CircularProgress,
  Alert,
} from "@mui/material";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutlineOutlined";
import { useAuth } from "../../context/AuthContext";
import { getProductReviews } from "../../services/reviewService";
import { deleteReviewAndUpdateRating } from "../../services/productService";
import type { Review } from "../../types";

interface ProductReviewsProps {
  productId: string;
  refreshKey: number;
}

export const ProductReviews = ({
  productId,
  refreshKey,
}: ProductReviewsProps) => {
  const { user } = useAuth();

  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  useEffect(() => {
    const loadReviews = async () => {
      setLoading(true);
      const data = await getProductReviews(productId);
      setReviews(data);
      setLoading(false);
    };

    loadReviews();
  }, [productId, refreshKey]);

  const handleDelete = async (review: Review) => {
    setDeletingId(review.id);
    setDeleteError(null);

    try {
      await deleteReviewAndUpdateRating(productId, review.id, review.rating);
      setReviews((prev) => prev.filter((r) => r.id !== review.id));
    } catch (err) {
      console.error("Failed to delete review:", err);
      setDeleteError("Couldn't delete your review. Please try again.");
    } finally {
      setDeletingId(null);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
        <CircularProgress size={24} />
      </Box>
    );
  }

  if (reviews.length === 0) {
    return (
      <Typography variant="body2" color="text.secondary">
        No reviews yet. Be the first to review this product.
      </Typography>
    );
  }

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
      <Typography variant="h6">Customer Reviews</Typography>

      {deleteError && <Alert severity="error">{deleteError}</Alert>}

      {reviews.map((review) => (
        <Box key={review.id}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Box>
              <Rating value={review.rating} readOnly size="small" />
              <Typography variant="subtitle2">{review.userName}</Typography>
            </Box>

            {user?.uid === review.userId && (
              <IconButton
                aria-label="Delete review"
                size="small"
                onClick={() => handleDelete(review)}
                disabled={deletingId === review.id}
              >
                <DeleteOutlineIcon fontSize="small" />
              </IconButton>
            )}
          </Box>

          <Typography variant="body2" sx={{ mt: 0.5 }}>
            {review.comment}
          </Typography>

          {review.createdAt && (
            <Typography variant="caption" color="text.secondary">
              {review.createdAt.toLocaleDateString()}
            </Typography>
          )}

          <Divider sx={{ mt: 2 }} />
        </Box>
      ))}
    </Box>
  );
};
