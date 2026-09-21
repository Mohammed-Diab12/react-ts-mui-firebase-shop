import type { ThemeOptions } from "@mui/material/styles";
import swatchLight from "../assets/brandsLogo/swatchLight.svg";
import yodyLight from "../assets/brandsLogo/yodyLight.svg";


export const lightThemeOptions: ThemeOptions = {
  palette: {
    mode: "light",
    primary: {
      main: "#ab1d2b",
    },
    content: {
      main: "#424242",
    },
    background: {
      default: "#ffffff",
      paper: "#f5f5f5",
    },
    secondary: {
      main: "#000",
    },
    brand: {
      main: "#1C242E",
    },
  
  
},
  typography: {
    fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif",
  },
  brandLogos: {
    swatch: swatchLight,
    yody: yodyLight,

  }
};