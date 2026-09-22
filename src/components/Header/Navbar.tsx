import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Container from "@mui/material/Container";
import Button from "@mui/material/Button";

import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import UserMenu from "./UserMenu";
import { pages } from "./pages";

function Navbar() {
  const navigate = useNavigate();
  const { isAuthenticated, loading } = useAuth();

  return (
    <AppBar
      position="sticky"
      color="transparent"
      sx={{
        top: 0,
        zIndex: 1000,
        bgcolor: { xs: "transparent", md: "brand.main" },
        boxShadow: { xs: "none" },
        display: { xs: "none", md: "flex" },
      }}
    >
      <Toolbar disableGutters>
        <Container sx={{ display: "flex" }}>
          <Box sx={{ flexGrow: 1, display: "flex", gap: 2 }}>
            {pages.map((page) => (
              <Button
                key={page.name}
                onClick={() => navigate(page.path)}
                sx={{
                  color: "background.paper",
                  fontWeight: 600,
                }}
              >
                {page.name}
              </Button>
            ))}
          </Box>
          <Box sx={{ flexGrow: 0 }}>
            {loading ? null : isAuthenticated ? (
              <UserMenu sx={{ display: "flex" }} />
            ) : (
              <Button
                onClick={() => navigate("/login")}
                sx={{
                  color: "background.paper",
                  fontWeight: 600,
                }}
              >
                LOGIN
              </Button>
            )}
          </Box>
        </Container>
      </Toolbar>
    </AppBar>
  );
}
export default Navbar;
