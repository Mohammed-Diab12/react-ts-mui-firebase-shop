import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Avatar,
  Box,
  Button,
  CircularProgress,
  Container,
  Divider,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import { useAuth } from "../context/AuthContext";
import { logout } from "../services/authServices";

function ProfilePage() {
  const navigate = useNavigate();
  const { user, isAuthenticated, loading } = useAuth();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      navigate("/login", { replace: true });
    }
  }, [loading, isAuthenticated, navigate]);

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", py: 10 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!isAuthenticated || !user) {
    return null;
  }
  const providerId = user.providerData[0]?.providerId ?? "";
  const providerLabel = providerId.includes("google")
    ? "Google"
    : providerId.includes("github")
      ? "GitHub"
      : "your account";

  return (
    <Container maxWidth="sm" sx={{ py: { xs: 4, md: 8 } }}>
      <Paper variant="outlined" sx={{ p: { xs: 3, sm: 4 }, borderRadius: 2 }}>
        <Stack spacing={3} sx={{ textAlign: "center", alignItems: "center" }}>
          <Avatar
            alt={user.displayName ?? "User"}
            src={user.photoURL ?? undefined}
            sx={{ width: 88, height: 88 }}
          />

          <Box>
            <Typography variant="h5" sx={{ fontWeight: 700, pb: 1 }}>
              {user.displayName ?? "Unnamed User"}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {user.email}
            </Typography>
            {user.phoneNumber && (
              <Typography variant="body1" color="text.secondary">
                {user.phoneNumber}
              </Typography>
            )}
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ display: "block", mt: 0.5 }}
            >
              Signed in with {providerLabel}
            </Typography>
          </Box>

          <Divider sx={{ width: "100%" }} />

          <Button
            variant="contained"
            color="primary"
            onClick={handleLogout}
            sx={{ px: 4, fontWeight: 600 }}
          >
            LOGOUT
          </Button>
        </Stack>
      </Paper>
    </Container>
  );
}

export default ProfilePage;
