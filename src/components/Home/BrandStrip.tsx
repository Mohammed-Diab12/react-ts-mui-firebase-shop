import { Box, useTheme } from "@mui/material";
import startUpSocks from "../../assets/brandsLogo/startUpSocks.svg";
import swachhBharat from "../../assets/brandsLogo/swachhBharat.svg";
import gardenLandScaping from "../../assets/brandsLogo/gardenLandScaping.svg";
import toshiba from "../../assets/brandsLogo/toshiba.svg";
function BrandStrip() {
  const theme = useTheme();

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        flexWrap: "wrap",
        alignItems: "center",
      }}
    >
      <Box>
        <img src={startUpSocks} alt="Start Up Socks" height={100} width={100} />
      </Box>

      <Box>
        <img src={swachhBharat} alt="swachh Bharat" height={100} width={100} />
      </Box>
      <Box>
        <img
          src={theme.brandLogos.swatch}
          alt="Swatch"
          height={100}
          width={100}
        />
      </Box>
      <Box>
        <img
          src={gardenLandScaping}
          alt="garden Land Scaping"
          height={100}
          width={120}
        />
      </Box>
      <Box>
        <img src={toshiba} alt="Toshiba" height={100} width={100} />
      </Box>
      <Box>
        <img
          src={theme.brandLogos.yody}
          alt="yody young and dynamic"
          height={100}
          width={100}
        />
      </Box>
    </Box>
  );
}

export default BrandStrip;
