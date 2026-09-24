import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Rating,
  TextField,
  Button,
  Alert,
  CircularProgress,
} from "@mui/material";
import { useAuth } from "../../context/AuthContext";
import { getUserReview } from "../../services/reviewService";
import {
  addReviewAndUpdateRating,
  updateReviewAndRating,
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
  const [loadingExisting, setLoadingExisting] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    if (!isAuthenticated || !user) {
      setLoadingExisting(false);
      return;
    }

    let isMounted = true;

    const loadExistingReview = async () => {
      setLoadingExisting(true);
      setLoadError(null);
      try {
        const review = await getUserReview(productId, user.uid);
        if (isMounted && review) {
          setRating(review.rating);
          setComment(review.comment);
          setExistingRating(review.rating);
        }
      } catch (err) {
        console.error("Failed to load existing review:", err);
        if (isMounted) {
          setLoadError(
            "Couldn't load your existing review. You can still write a new one.",
          );
        }
      } finally {
        if (isMounted) {
          setLoadingExisting(false);
        }
      }
    };

    loadExistingReview();

    return () => {
      isMounted = false;
    };
  }, [productId, user, isAuthenticated]);

  const handleSubmit = async () => {
    if (!user || !rating) return;

    setLoading(true);
    setError(null);

    try {
      const isUpdate = existingRating !== null;

      if (isUpdate) {
        await updateReviewAndRating(productId, user.uid, existingRating, {
          rating,
          comment,
        });
      } else {
        await addReviewAndUpdateRating(productId, user.uid, {
          userName: user.displayName ?? "Anonymous",
          rating,
          comment,
        });
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

  if (loadingExisting) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", py: 2 }}>
        <CircularProgress size={20} />
      </Box>
    );
  }

  return (
    <Box
      sx={{ display: "flex", flexDirection: "column", gap: 2, maxWidth: 480 }}
    >
      <Typography variant="h6">
        {existingRating !== null ? "Update Your Review" : "Write a Review"}
      </Typography>

      {loadError && <Alert severity="warning">{loadError}</Alert>}

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
