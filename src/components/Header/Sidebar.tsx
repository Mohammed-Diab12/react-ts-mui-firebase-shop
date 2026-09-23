import { useState } from "react";
import {
  Drawer,
  Box,
  List,
  ListItemButton,
  ListItemText,
  IconButton,
  Divider,
  Typography,
  Stack,
  Snackbar,
  Alert,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import { useNavigate } from "react-router-dom";
import { HeaderActions } from "../headerAction/HeaderAction";
import { ThemeToggleButton } from "../themeToggleButton/ThemeToggleButton";
import { pages } from "./pages";
import { logout } from "../../services/authServices";
import { useAuth } from "../../context/AuthContext";

function Sidebar() {
  const [open, setOpen] = useState(false);
  const [logoutError, setLogoutError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const handleToggle = () => setOpen((prev) => !prev);

  const handleNavigate = (path: string) => {
    navigate(path);
    setOpen(false);
  };

  const handleLogout = async () => {
    try {
      await logout();
      setOpen(false);
      navigate("/");
    } catch (error) {
      console.error("Logout failed:", error);
      setLogoutError("Failed to log out. Please try again.");
    }
  };

  return (
    <>
      <IconButton
        aria-label="Open menu"
        onClick={handleToggle}
        sx={{ display: { xs: "inline-flex", md: "none" } }}
      >
        <MenuIcon />
      </IconButton>

      <Drawer anchor="left" open={open} onClose={handleToggle}>
        <Box
          sx={{
            width: 280,
            display: "flex",
            flexDirection: "column",
            height: "100%",
          }}
        >
          {/* Logo row */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              px: 2,
              py: 1.5,
            }}
          >
            <Typography
              variant="h6"
              sx={{ fontWeight: 600, color: "brand.main" }}
            >
              CAMARO
            </Typography>
            <IconButton aria-label="Close menu" onClick={handleToggle}>
              <CloseIcon />
            </IconButton>
          </Box>

          <Divider />

          {/* Nav links, stacked */}
          <List sx={{ py: 0 }}>
            {pages.map((page) => (
              <ListItemButton
                key={page.name}
                onClick={() => handleNavigate(page.path)}
              >
                <ListItemText primary={page.name} />
              </ListItemButton>
            ))}
          </List>

          <Divider />

          {/* Theme toggle row */}
          <Box sx={{ px: 1, py: 0.5 }}>
            <ThemeToggleButton />
          </Box>

          {/* Header actions, stacked vertically */}
          <Stack spacing={0.5} sx={{ px: 2, py: 1.5, flexGrow: 1 }}>
            <HeaderActions />
          </Stack>

          {/* Logout*/}
          {isAuthenticated && (
            <>
              <Divider />
              <List sx={{ py: 0 }}>
                <ListItemButton onClick={handleLogout}>
                  <ListItemText primary="Logout" />
                </ListItemButton>
              </List>
            </>
          )}
        </Box>
      </Drawer>

      <Snackbar
        open={!!logoutError}
        autoHideDuration={4000}
        onClose={() => setLogoutError(null)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={() => setLogoutError(null)}
          severity="error"
          sx={{ width: "100%" }}
        >
          {logoutError}
        </Alert>
      </Snackbar>
    </>
  );
}

export default Sidebar;
