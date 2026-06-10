import React from "react";
import { Box, Container, Button } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { Link } from "react-router-dom";

const Header3 = () => {
  const theme = useTheme();
  const bgMain =
    theme?.palette?.bg?.main ?? theme?.palette?.background?.default ?? "#fff";

  return (
    <Box sx={{ bgcolor: bgMain, py: 0.5, boxShadow: "0 2px 5px rgba(0,0,0,0.08)" }}>
      <Container sx={{ display: "flex", justifyContent: "center", gap: 2 }}>
        <Button
          component={Link}
          to="/products"
          sx={{
            textTransform: "capitalize",
            fontWeight: "bold",
            "&:hover": { bgcolor: "#E63946", color: "#fff" },
          }}
        >
          الكل
        </Button>
        <Button
          component={Link}
          to="/products?category=men"
          sx={{
            textTransform: "capitalize",
            fontWeight: "bold",
            "&:hover": { bgcolor: "#E63946", color: "#fff" },
          }}
        >
          رجال
        </Button>
        <Button
          component={Link}
          to="/products?category=women"
          sx={{
            textTransform: "capitalize",
            fontWeight: "bold",
            "&:hover": { bgcolor: "#E63946", color: "#fff" },
          }}
        >
          نساء
        </Button>
      </Container>
    </Box>
  );
};

export default Header3;