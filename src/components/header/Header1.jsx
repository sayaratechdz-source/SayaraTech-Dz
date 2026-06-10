import { useContext, useState } from "react";
import { ColorModeContext } from "../../theme";
import {
  Box,
  Container,
  IconButton,
  Stack,
  Typography,
  useTheme,
  Menu,
  MenuItem,
} from "@mui/material";
import {
  DarkModeOutlined,
  LightModeOutlined,
  DirectionsCar as DirectionsCarIcon,
  ExpandMore,
} from "@mui/icons-material";
import TwitterIcon from "@mui/icons-material/Twitter";
import FacebookIcon from "@mui/icons-material/Facebook";
import InstagramIcon from "@mui/icons-material/Instagram";
import { Link } from "react-router-dom";

const options = ["AR", "EN"];

const Header1 = () => {
  const colorMode = useContext(ColorModeContext);
  const theme = useTheme();
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const open = Boolean(anchorEl);

  return (
    <Box
      sx={{
        background: "linear-gradient(90deg, #0a0a0a 0%, #1a0000 50%, #0a0a0a 100%)",
        borderBottom: "1px solid rgba(230,57,70,0.2)",
        py: 0.8,
      }}
    >
      <Container>
        <Stack direction="row" alignItems="center" spacing={2}>
          {/* Logo */}
          <Stack
            direction="row"
            alignItems="center"
            spacing={1}
            component={Link}
            to="/"
            sx={{ textDecoration: "none", flexGrow: 1 }}
          >
            <Box
              sx={{
                width: 36,
                height: 36,
                borderRadius: "50%",
                bgcolor: "#E63946",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 0 12px rgba(230,57,70,0.6)",
              }}
            >
              <DirectionsCarIcon sx={{ fontSize: 20, color: "#fff" }} />
            </Box>
            <Typography
              sx={{
                fontSize: "18px",
                fontWeight: 800,
                color: "#ffffff",
                letterSpacing: "3px",
                textTransform: "uppercase",
              }}
            >
              SAYARA
              <Box component="span" sx={{ color: "#E63946" }}>TECH</Box>
              <Box component="span" sx={{ color: "#aaa", fontSize: 13, ml: 0.5 }}>DZ</Box>
            </Typography>
            <Typography sx={{ fontSize: 10, color: "rgba(255,255,255,0.35)", letterSpacing: 1, ml: 0.5, display: { xs: "none", sm: "block" } }}>
              Votre garage en ligne
            </Typography>
          </Stack>

          {/* Promo text */}
          <Typography
            sx={{
              display: { xs: "none", md: "block" },
              fontSize: 12,
              color: "rgba(255,255,255,0.5)",
              letterSpacing: 1,
            }}
          >
            🚗 Livraison gratuite sur toute l'Algérie
          </Typography>

          {/* Dark mode */}
          <IconButton
            size="small"
            onClick={() => {
              colorMode.toggleColorMode();
              const newMode = theme.palette.mode === "dark" ? "light" : "dark";
              localStorage.setItem("mode", newMode);
            }}
          >
            {theme.palette.mode === "light" ? (
              <LightModeOutlined sx={{ color: "rgba(255,255,255,0.6)", fontSize: 18 }} />
            ) : (
              <DarkModeOutlined sx={{ color: "rgba(255,255,255,0.6)", fontSize: 18 }} />
            )}
          </IconButton>

          {/* Language */}
          <Stack
            direction="row"
            alignItems="center"
            onClick={(e) => setAnchorEl(e.currentTarget)}
            sx={{ cursor: "pointer" }}
          >
            <Typography sx={{ fontSize: 12, color: "rgba(255,255,255,0.6)" }}>
              {options[selectedIndex]}
            </Typography>
            <ExpandMore sx={{ color: "rgba(255,255,255,0.4)", fontSize: 16 }} />
          </Stack>
          <Menu anchorEl={anchorEl} open={open} onClose={() => setAnchorEl(null)}>
            {options.map((option, index) => (
              <MenuItem
                key={option}
                selected={index === selectedIndex}
                onClick={() => { setSelectedIndex(index); setAnchorEl(null); }}
              >
                {option}
              </MenuItem>
            ))}
          </Menu>

          {/* Social */}
          <Stack direction="row" spacing={0.5}>
            {[TwitterIcon, FacebookIcon, InstagramIcon].map((Icon, i) => (
              <IconButton key={i} size="small">
                <Icon sx={{ fontSize: 16, color: "rgba(255,255,255,0.4)", "&:hover": { color: "#E63946" } }} />
              </IconButton>
            ))}
          </Stack>
        </Stack>
      </Container>
    </Box>
  );
};

export default Header1;
