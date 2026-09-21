import type { ThemeOptions } from "@mui/material/styles";
import swatchDark from "../assets/brandsLogo/swatchDark.svg";
import yodyDark from "../assets/brandsLogo/yodyDark.svg";

export const darkThemeOptions: ThemeOptions = {
  palette: {
    mode: "dark",

    primary: {
      main: "#ab1d2b",
    },

    content: {
      main: "#fff",
    },

    background: {
      default: "#121212",
      paper: "#1e1e1e",
    },

    secondary: {
      main: "#fff",
    },
    brand: {
      main: "#D5DCE3",
    },
  },

  typography: {
    fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif",
  },
  brandLogos: {
    swatch: swatchDark,
    yody: yodyDark,
  },
};
