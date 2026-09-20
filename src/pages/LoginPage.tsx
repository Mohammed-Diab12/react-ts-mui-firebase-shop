import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  Container,
  Divider,
  Paper,
  Stack,
  Typography,
  Alert,
  CircularProgress,
} from "@mui/material";
import GoogleIcon from "@mui/icons-material/Google";
import GitHubIcon from "@mui/icons-material/GitHub";
import { signInWithGoogle, signInWithGithub } from "../services/authServices";

type ActiveProvider = "google" | "github" | null;

function LoginPage() {
  const navigate = useNavigate();
  const [activeProvider, setActiveProvider] = useState<ActiveProvider>(null);
  const [error, setError] = useState<string | null>(null);

  const handleGoogleLogin = async () => {
    setError(null);
    setActiveProvider("google");
    try {
      await signInWithGoogle();
      navigate("/");
    } catch (err) {
      console.error("Google login failed:", err);
      setError("Couldn't sign in with Google. Please try again.");
    } finally {
      setActiveProvider(null);
    }
  };

  const handleGithubLogin = async () => {
    setError(null);
    setActiveProvider("github");
    try {
      await signInWithGithub();
      navigate("/");
    } catch (err) {
      console.error("GitHub login failed:", err);
      setError("Couldn't sign in with GitHub. Please try again.");
    } finally {
      setActiveProvider(null);
    }
  };

  const isBusy = activeProvider !== null;

  return (
    <Box
      sx={{
        minHeight: "70vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        bgcolor: "background.default",
        px: 2,
      }}
    >
      <Container maxWidth="xs" disableGutters>
        <Paper
          variant="outlined"
          sx={{
            p: { xs: 3, sm: 4 },
            borderRadius: 2,
          }}
        >
          <Stack spacing={0.5} sx={{ mb: 3, textAlign: "center" }}>
            <Typography variant="h5" sx={{ fontWeight: 700 }}>
              Welcome back
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Sign in to continue to your account
            </Typography>
          </Stack>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <Stack spacing={1.5}>
            <Button
              variant="outlined"
              size="large"
              onClick={handleGoogleLogin}
              disabled={isBusy}
              startIcon={
                activeProvider === "google" ? (
                  <CircularProgress size={18} color="inherit" />
                ) : (
                  <GoogleIcon />
                )
              }
              sx={{
                py: 1.2,
                borderColor: "divider",
                color: "text.primary",
                textTransform: "none",
                fontWeight: 600,
                "&:hover": {
                  borderColor: "text.primary",
                  bgcolor: "action.hover",
                },
              }}
            >
              {activeProvider === "google"
                ? "Signing in..."
                : "Continue with Google"}
            </Button>

            <Button
              variant="contained"
              size="large"
              onClick={handleGithubLogin}
              disabled={isBusy}
              startIcon={
                activeProvider === "github" ? (
                  <CircularProgress size={18} color="inherit" />
                ) : (
                  <GitHubIcon />
                )
              }
              sx={{
                py: 1.2,
                bgcolor: "text.primary",
                color: "background.default",
                textTransform: "none",
                fontWeight: 600,
                "&:hover": {
                  bgcolor: "text.secondary",
                },
              }}
            >
              {activeProvider === "github"
                ? "Signing in..."
                : "Continue with GitHub"}
            </Button>
          </Stack>

          <Divider sx={{ my: 3 }} />

          <Typography
            variant="caption"
            color="text.secondary"
            sx={{ display: "block", textAlign: "center" }}
          >
            By continuing you agree to our Terms & Policy.
          </Typography>
        </Paper>
      </Container>
    </Box>
  );
}

export default LoginPage;
