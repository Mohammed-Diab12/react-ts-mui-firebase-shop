import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Container,
  MenuItem,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import BlockOutlinedIcon from "@mui/icons-material/BlockOutlined";
import { useAuth } from "../context/AuthContext";
import { createProduct } from "../services/productService";
import type { Product, ProductCategory } from "../types";

const CATEGORIES: ProductCategory[] = [
  "Smartphone",
  "Tablet",
  "Audio & Sound",
  "Laptop",
];

interface FormState {
  title: string;
  category: ProductCategory | "";
  description: string;
  thumbnail: string;
  images: string;
  price: string;
  discountPercentage: string;
  stock: string;
  sku: string;
}

const initialForm: FormState = {
  title: "",
  category: "",
  description: "",
  thumbnail: "",
  images: "",
  price: "",
  discountPercentage: "",
  stock: "",
  sku: "",
};

// --- Gate screens --------
const AnonymousGate = ({ onLogin }: { onLogin: () => void }) => (
  <Paper
    variant="outlined"
    sx={{
      p: 5,
      borderRadius: 2,
      textAlign: "center",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
    }}
  >
    <LockOutlinedIcon sx={{ fontSize: 56, color: "text.disabled", mb: 2 }} />
    <Typography variant="h6" sx={{ mb: 1 }}>
      Sign in required
    </Typography>
    <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
      You need to sign in to add a new product.
    </Typography>
    <Button
      variant="contained"
      onClick={onLogin}
      sx={{ px: 4, fontWeight: 600 }}
    >
      GO TO LOGIN
    </Button>
  </Paper>
);

const NotAdminGate = () => (
  <Paper
    variant="outlined"
    sx={{
      p: 5,
      borderRadius: 2,
      textAlign: "center",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
    }}
  >
    <BlockOutlinedIcon sx={{ fontSize: 56, color: "error.main", mb: 2 }} />
    <Typography variant="h6" sx={{ mb: 1 }}>
      Admins only
    </Typography>
    <Typography variant="body2" color="text.secondary">
      Only store administrators can add new products. If you believe this is a
      mistake, contact your admin.
    </Typography>
  </Paper>
);

// --- Main page -------
function CreateProductPage() {
  const navigate = useNavigate();
  const { isAuthenticated, isAdmin, loading: authLoading } = useAuth();
  const [formUnlocked, setFormUnlocked] = useState(false);
  const [form, setForm] = useState<FormState>(initialForm);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    setFormUnlocked(false);
  }, [isAdmin]);

  const handleChange =
    (field: keyof FormState) =>
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setForm((prev) => ({ ...prev, [field]: event.target.value }));
    };

  const validate = (): string | null => {
    if (!form.title.trim()) return "Title is required.";
    if (!form.category) return "Category is required.";
    if (!form.description.trim()) return "Description is required.";
    if (!form.thumbnail.trim()) return "Thumbnail URL is required.";
    if (!form.images.trim()) return "At least one image URL is required.";
    if (!form.sku.trim()) return "SKU is required.";
    const price = Number(form.price);
    if (!form.price || Number.isNaN(price) || price <= 0)
      return "Price must be a positive number.";
    const stock = Number(form.stock);
    if (!form.stock || Number.isNaN(stock) || stock < 0)
      return "Stock must be a non-negative number.";
    if (form.discountPercentage) {
      const discount = Number(form.discountPercentage);
      if (Number.isNaN(discount) || discount < 0 || discount > 100)
        return "Discount must be a number between 0 and 100.";
    }
    return null;
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    setSuccess(false);

    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    setSubmitting(true);
    try {
      const images = form.images
        .split(",")
        .map((url) => url.trim())
        .filter(Boolean);

      const newProduct: Omit<Product, "id"> = {
        title: form.title.trim(),
        category: form.category as ProductCategory,
        description: form.description.trim(),
        thumbnail: form.thumbnail.trim(),
        images,
        price: Number(form.price),
        stock: Number(form.stock),
        sku: form.sku.trim(),
        rating: 0,
        ratingCount: 0,
        ...(form.discountPercentage
          ? { discountPercentage: Number(form.discountPercentage) }
          : {}),
      };

      const id = await createProduct(newProduct);
      setSuccess(true);
      setForm(initialForm);
      navigate(`/products/${id}`);
    } catch (err) {
      console.error("Failed to create product:", err);
      setError(
        "Something went wrong while creating the product. Please try again.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (authLoading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", py: 10 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="sm" sx={{ py: { xs: 4, md: 8 } }}>
      {!isAuthenticated ? (
        <AnonymousGate onLogin={() => navigate("/login")} />
      ) : !isAdmin ? (
        <NotAdminGate />
      ) : !formUnlocked ? (
        <Paper
          variant="outlined"
          sx={{
            p: 5,
            borderRadius: 2,
            textAlign: "center",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Typography variant="h6" sx={{ mb: 1 }}>
            Add a New Product
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            You're signed in as an admin. Ready to create a new listing?
          </Typography>
          <Button
            variant="contained"
            onClick={() => setFormUnlocked(true)}
            sx={{ px: 4, fontWeight: 600 }}
          >
            CREATE PRODUCT
          </Button>
        </Paper>
      ) : (
        <Paper variant="outlined" sx={{ p: { xs: 3, sm: 4 }, borderRadius: 2 }}>
          <Typography variant="h5" sx={{ fontWeight: 700, mb: 3 }}>
            Add a New Product
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
          {success && (
            <Alert severity="success" sx={{ mb: 2 }}>
              Product created successfully.
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit}>
            <Stack spacing={2.5}>
              <TextField
                label="Title"
                value={form.title}
                onChange={handleChange("title")}
                fullWidth
                required
              />

              <TextField
                select
                label="Category"
                value={form.category}
                onChange={handleChange("category")}
                fullWidth
                required
              >
                {CATEGORIES.map((category) => (
                  <MenuItem key={category} value={category}>
                    {category}
                  </MenuItem>
                ))}
              </TextField>

              <TextField
                label="Description"
                value={form.description}
                onChange={handleChange("description")}
                fullWidth
                required
                multiline
                minRows={3}
              />

              <TextField
                label="Thumbnail URL"
                value={form.thumbnail}
                onChange={handleChange("thumbnail")}
                fullWidth
                required
                helperText="Shown on product cards and homepage listings."
              />

              <TextField
                label="Image URLs"
                value={form.images}
                onChange={handleChange("images")}
                fullWidth
                required
                multiline
                minRows={2}
                helperText="Separate multiple image URLs with commas — shown in the product gallery."
              />

              <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                <TextField
                  label="Price"
                  type="number"
                  value={form.price}
                  onChange={handleChange("price")}
                  fullWidth
                  required
                  slotProps={{ htmlInput: { min: 0, step: "0.01" } }}
                />
                <TextField
                  label="Discount %"
                  type="number"
                  value={form.discountPercentage}
                  onChange={handleChange("discountPercentage")}
                  fullWidth
                  helperText="Optional — leave blank if not on sale."
                  slotProps={{ htmlInput: { min: 0, max: 100 } }}
                />
              </Stack>

              <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                <TextField
                  label="Stock"
                  type="number"
                  value={form.stock}
                  onChange={handleChange("stock")}
                  fullWidth
                  required
                  slotProps={{ htmlInput: { min: 0 } }}
                />
                <TextField
                  label="SKU"
                  value={form.sku}
                  onChange={handleChange("sku")}
                  fullWidth
                  required
                />
              </Stack>

              <Button
                type="submit"
                variant="contained"
                size="large"
                disabled={submitting}
                sx={{ py: 1.3, fontWeight: 700 }}
              >
                {submitting ? "CREATING..." : "CREATE PRODUCT"}
              </Button>
            </Stack>
          </Box>
        </Paper>
      )}
    </Container>
  );
}

export default CreateProductPage;
