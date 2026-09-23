import Tooltip from "@mui/material/Tooltip";
import IconButton from "@mui/material/IconButton";
import Avatar from "@mui/material/Avatar";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Typography from "@mui/material/Typography";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { logout } from "../../services/authServices";
import { useAuth } from "../../context/AuthContext";
import type { SxProps, Theme } from "@mui/material";
import { Box } from "@mui/material";

type Setting =
  | { name: string; type: "link"; path: string }
  | { name: string; type: "action"; action: "logout" };

const settings: Setting[] = [
  { name: "Profile", type: "link", path: "/profile" },
  { name: "Logout", type: "action", action: "logout" as const },
];

interface UserMenuProps {
  sx?: SxProps<Theme>;
}

function UserMenu({ sx }: UserMenuProps) {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);
  const [logoutError, setLogoutError] = useState<string | null>(null);

  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };
  const handleCloseUserMenu = () => setAnchorElUser(null);

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/");
    } catch (error) {
      console.error("Logout failed:", error);
      setLogoutError("Failed to log out. Please try again.");
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
    <Box sx={sx}>
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
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        keepMounted
        transformOrigin={{ vertical: "top", horizontal: "right" }}
        open={Boolean(anchorElUser)}
        onClose={handleCloseUserMenu}
      >
        {settings.map((setting) => (
          <MenuItem
            key={setting.name}
            onClick={() => handleSettingClick(setting)}
          >
            <Typography sx={{ textAlign: "center" }}>{setting.name}</Typography>
          </MenuItem>
        ))}
      </Menu>

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
    </Box>
  );
}

export default UserMenu;
