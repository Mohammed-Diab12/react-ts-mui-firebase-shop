import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Rating,
  TextField,
  Button,
  Alert,
} from "@mui/material";
import { useAuth } from "../../context/AuthContext";
import {
  getUserReview,
  addReview,
  updateReview,
} from "../../services/reviewService";
import {
  applyReviewAdded,
  applyReviewUpdated,
} from "../../services/productService";

interface ReviewFormProps {
  productId: string;
  onReviewSubmitted: () => void;
}

export const ReviewForm = ({
  productId,
  onReviewSubmitted,
}: ReviewFormProps) => {
  const { user, isAuthenticated } = useAuth();

  const [rating, setRating] = useState<number | null>(null);
  const [comment, setComment] = useState("");
  const [existingRating, setExistingRating] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isAuthenticated || !user) return;

    const loadExistingReview = async () => {
      const review = await getUserReview(productId, user.uid);
      if (review) {
        setRating(review.rating);
        setComment(review.comment);
        setExistingRating(review.rating);
      }
    };

    loadExistingReview();
  }, [productId, user, isAuthenticated]);

  const handleSubmit = async () => {
    if (!user || !rating) return;

    setLoading(true);
    setError(null);

    try {
      const isUpdate = existingRating !== null;

      if (isUpdate) {
        await updateReview(productId, user.uid, { rating, comment });
        await applyReviewUpdated(productId, existingRating, rating);
      } else {
        await addReview(productId, user.uid, {
          userName: user.displayName ?? "Anonymous",
          rating,
          comment,
        });
        await applyReviewAdded(productId, rating);
      }

      setExistingRating(rating);
      onReviewSubmitted();
    } catch (err) {
      console.error("Failed to submit review:", err);
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <Typography variant="body2" color="text.secondary">
        Sign in to leave a review.
      </Typography>
    );
  }

  return (
    <Box
      sx={{ display: "flex", flexDirection: "column", gap: 2, maxWidth: 480 }}
    >
      <Typography variant="h6">
        {existingRating !== null ? "Update Your Review" : "Write a Review"}
      </Typography>

      <Rating value={rating} onChange={(_, newValue) => setRating(newValue)} />

      <TextField
        label="Comment"
        multiline
        minRows={3}
        value={comment}
        onChange={(e) => setComment(e.target.value)}
      />

      {error && <Alert severity="error">{error}</Alert>}

      <Button
        variant="contained"
        onClick={handleSubmit}
        disabled={!rating || loading}
      >
        {existingRating !== null ? "Update Review" : "Submit Review"}
      </Button>
    </Box>
  );
};
