import { ThemeToggleButton } from "../themeToggleButton/ThemeToggleButton";
import { Container, Stack, Typography, Box } from "@mui/material";
import { HeaderActions } from "../headerAction/HeaderAction";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";

function Header() {
  return (
    <Box
      sx={{
        width: "100%",
        bgcolor: "background.default",
        position: "sticky",
        top: 0,
        zIndex: 1000,
      }}
    >
      <Container>
        <Stack
          direction="row"
          spacing={2}
          sx={{
            justifyContent: "space-between",
            alignItems: "center",
            py: 1,
            height: "50px",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Sidebar />
            <Typography
              variant="h2"
              sx={{
                fontWeight: 800,
                fontSize: "1.9rem",
                color: "brand.main",
              }}
            >
              CAMARO
            </Typography>
          </Box>

          <Box
            sx={{
              display: { xs: "none", md: "flex" },
              flexDirection: "row",
              alignItems: "center",
              gap: 2,
            }}
          >
            <ThemeToggleButton />
            <HeaderActions />
          </Box>
        </Stack>
      </Container>

      <Navbar />
    </Box>
  );
}

export default Header;
