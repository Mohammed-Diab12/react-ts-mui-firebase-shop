import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Container from "@mui/material/Container";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Avatar from "@mui/material/Avatar";
import Tooltip from "@mui/material/Tooltip";
import MenuItem from "@mui/material/MenuItem";
import Menu from "@mui/material/Menu";
import Typography from "@mui/material/Typography";

import { useNavigate } from "react-router-dom";
import { logout } from "../../services/authServices";
import { useAuth } from "../../context/AuthContext";
import { useState } from "react";

const pages = [
  { name: "HOME", path: "/" },
  { name: "SHOP", path: "/" },
  { name: "PAGES", path: "/cart" },
  { name: "LOOKBOOK", path: "/cart" },
  { name: "BRANDS", path: "/cart" },
  { name: "Profile", path: "/profile" },
];

type Setting =
  | {
      name: string;
      type: "link";
      path: string;
    }
  | {
      name: string;
      type: "action";
      action: "logout";
    };

const settings: Setting[] = [
  { name: "Profile", type: "link", path: "/profile" },
  { name: "Logout", type: "action", action: "logout" as const },
];

function Navbar() {
  const navigate = useNavigate();
  const { user, isAuthenticated, loading } = useAuth();
  const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);

  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };
  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const handleSettingClick = (setting: Setting) => {
    handleCloseUserMenu();

    if (setting.type === "action") {
      handleLogout();
      return;
    }

    navigate(setting.path);
  };

  return (
    <AppBar
      position="sticky"
      color="transparent"
      sx={{
        top: 0,
        zIndex: 1000,
        bgcolor: { xs: "transparent", md: "brand.main" },
        boxShadow: { xs: "none" },
      }}
    >
      <Toolbar disableGutters>
        <Container sx={{ display: "flex"}}>
          <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}>
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
              <>
                <Tooltip title="Open settings">
                  <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                    <Avatar
                      alt={user?.displayName ?? "User"}
                      src={user?.photoURL ?? undefined}
                    />
                  </IconButton>
                </Tooltip>
                <Menu
                  sx={{ mt: "45px" }}
                  id="menu-appbar"
                  anchorEl={anchorElUser}
                  anchorOrigin={{
                    vertical: "top",
                    horizontal: "right",
                  }}
                  keepMounted
                  transformOrigin={{
                    vertical: "top",
                    horizontal: "right",
                  }}
                  open={Boolean(anchorElUser)}
                  onClose={handleCloseUserMenu}
                >
                  {settings.map((setting) => (
                    <MenuItem
                      key={setting.name}
                      onClick={() => handleSettingClick(setting)}
                    >
                      <Typography sx={{ textAlign: "center" }}>
                        {setting.name}
                      </Typography>
                    </MenuItem>
                  ))}
                </Menu>
              </>
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
