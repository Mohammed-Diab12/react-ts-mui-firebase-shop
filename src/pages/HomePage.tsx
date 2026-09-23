import ProductCategoryCarousel from "../components/Home/category/ProductCategoryCarousel";
import bluetoothSpeaker from "../../public/bluetoothSpeaker.jpg";
import PromoBanner from "../components/Home/PromoBanner";
import BrandStrip from "../components/Home/BrandStrip";
import { Container, Box } from "@mui/material";
import type { Product } from "../types";

const SMARTPHONE_TABLET_CATEGORIES: Product["category"][] = [
  "Smartphone",
  "Tablet",
];
const AUDIO_SOUND_CATEGORIES: Product["category"][] = ["Audio & Sound"];
const LAPTOP_CATEGORIES: Product["category"][] = ["Laptop"];

function HomePage() {
  return (
    <Container sx={{ display: "flex", gap: 3, flexDirection: "column" }}>
      <ProductCategoryCarousel
        categoryTitle="Smartphone & Tablet"
        categories={SMARTPHONE_TABLET_CATEGORIES}
      />

      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          width: "100%",
          alignItems: "center",
          gap: 1,
        }}
      >
        <Box sx={{ flex: 1, minWidth: 0, width: "100%" }}>
          <ProductCategoryCarousel
            categoryTitle="Audio & Sound"
            categories={AUDIO_SOUND_CATEGORIES}
          />
        </Box>

        <Box
          component="img"
          src={bluetoothSpeaker}
          alt="Bluetooth Speaker"
          sx={{
            width: { xs: "70%", md: 250 },
            maxWidth: 250,
            objectFit: "contain",
          }}
        />
      </Box>
      <PromoBanner />

      <ProductCategoryCarousel
        categoryTitle="Laptop"
        categories={LAPTOP_CATEGORIES}
        rows={2}
        slidesPerView={{ 0: 1, 600: 2, 900: 2, 1200: 3 }}
      />

      <BrandStrip />
    </Container>
  );
}

export default HomePage;
