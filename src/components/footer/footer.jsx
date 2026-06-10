import React from "react";
import {
  Box,
  Container,
  Grid,
  Typography,
  IconButton,
  Stack,
  Link,
  Divider,
} from "@mui/material";
import FacebookIcon from "@mui/icons-material/Facebook";
import TwitterIcon from "@mui/icons-material/Twitter";
import InstagramIcon from "@mui/icons-material/Instagram";
import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";

const Footer = () => {
  return (
    <Box
      sx={{
        background: "linear-gradient(180deg, #0d0d0d 0%, #111 100%)",
        color: "#fff",
        mt: 8,
        pt: 6,
        pb: 3,
        borderTop: "1px solid rgba(230,57,70,0.2)",
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={{ xs: 3, md: 5 }}>
          {/* Brand */}
          <Grid item xs={12} md={4}>
            <Stack direction="row" alignItems="center" spacing={1.5} mb={2}>
              <Box
                sx={{
                  width: 40,
                  height: 40,
                  borderRadius: "50%",
                  bgcolor: "#E63946",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: "0 0 16px rgba(230,57,70,0.5)",
                }}
              >
                <DirectionsCarIcon sx={{ fontSize: 22, color: "#fff" }} />
              </Box>
              <Typography sx={{ fontWeight: 900, fontSize: 18, letterSpacing: 2 }}>
                SAYARA<Box component="span" sx={{ color: "#E63946" }}>TECH</Box>
                <Box component="span" sx={{ color: "#666", fontSize: 12, ml: 0.5 }}>DZ</Box>
              </Typography>
              <Typography sx={{ color: "rgba(255,255,255,0.35)", fontSize: 11, letterSpacing: 0.5 }}>
                Votre garage en ligne
              </Typography>
            </Stack>
            <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.45)", lineHeight: 1.8, maxWidth: 280 }}>
              Votre boutique en ligne de référence pour les pièces auto originales avec un service de qualité supérieure.
            </Typography>
            <Stack direction="row" spacing={1} mt={3}>
              {[
                { Icon: FacebookIcon, href: "https://www.facebook.com/abderrahman.aref", color: "#1877f2" },
                { Icon: TwitterIcon, href: "https://twitter.com", color: "#1da1f2" },
                { Icon: InstagramIcon, href: "https://instagram.com", color: "#e1306c" },
              ].map(({ Icon, href, color }, i) => (
                <IconButton
                  key={i}
                  component="a"
                  href={href}
                  target="_blank"
                  size="small"
                  sx={{
                    bgcolor: "rgba(255,255,255,0.05)",
                    border: "1px solid rgba(255,255,255,0.08)",
                    borderRadius: 2,
                    transition: "0.3s",
                    "&:hover": { bgcolor: color, borderColor: color, transform: "translateY(-2px)" },
                  }}
                >
                  <Icon sx={{ fontSize: 18, color: "#fff" }} />
                </IconButton>
              ))}
            </Stack>
          </Grid>

          {/* Links */}
          <Grid item xs={6} md={2}>
            <Typography sx={{ fontWeight: 700, fontSize: 13, mb: 2, color: "rgba(255,255,255,0.7)", letterSpacing: 1, textTransform: "uppercase" }}>
              Navigation
            </Typography>
            <Stack spacing={1.2}>
              {["À propos", "Contact", "Conditions", "Confidentialité"].map((text) => (
                <Link
                  key={text}
                  href={text === "À propos" ? "/about" : "#"}
                  underline="none"
                  sx={{
                    color: "rgba(255,255,255,0.4)",
                    fontSize: 13,
                    transition: "0.2s",
                    "&:hover": { color: "#E63946", pl: 0.5 },
                  }}
                >
                  {text}
                </Link>
              ))}
            </Stack>
          </Grid>

          {/* Categories */}
          <Grid item xs={6} md={2}>
            <Typography sx={{ fontWeight: 700, fontSize: 13, mb: 2, color: "rgba(255,255,255,0.7)", letterSpacing: 1, textTransform: "uppercase" }}>
              Marques
            </Typography>
            <Stack spacing={1.2}>
              {["PEUGEOT", "RENAULT", "VOLKSWAGEN", "KIA", "HYUNDAI"].map((brand) => (
                <Link
                  key={brand}
                  href={`/products?category=${brand}`}
                  underline="none"
                  sx={{
                    color: "rgba(255,255,255,0.4)",
                    fontSize: 13,
                    transition: "0.2s",
                    "&:hover": { color: "#E63946", pl: 0.5 },
                  }}
                >
                  {brand}
                </Link>
              ))}
            </Stack>
          </Grid>

          {/* Contact */}
          <Grid item xs={12} md={4}>
            <Typography sx={{ fontWeight: 700, fontSize: 13, mb: 2, color: "rgba(255,255,255,0.7)", letterSpacing: 1, textTransform: "uppercase" }}>
              Contact
            </Typography>
            <Stack spacing={1.5}>
              {[
                { Icon: PhoneIcon, text: "+213 656 313 351" },
                { Icon: EmailIcon, text: "abderrahmanearef4@gmail.com" },
                { Icon: PhoneIcon, text: "+213 792 927 036" },
                { Icon: EmailIcon, text: "abdallahgheribi@gmail.com" },
              ].map(({ Icon, text }, i) => (
                <Stack key={i} direction="row" alignItems="center" spacing={1.5}>
                  <Box
                    sx={{
                      width: 28,
                      height: 28,
                      borderRadius: "8px",
                      bgcolor: "rgba(230,57,70,0.15)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    <Icon sx={{ fontSize: 14, color: "#E63946" }} />
                  </Box>
                  <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.45)", fontSize: 12 }}>
                    {text}
                  </Typography>
                </Stack>
              ))}
            </Stack>
          </Grid>
        </Grid>

        <Divider sx={{ borderColor: "rgba(255,255,255,0.06)", mt: 5, mb: 3 }} />

        <Stack
          direction={{ xs: "column", sm: "row" }}
          justifyContent="space-between"
          alignItems="center"
          spacing={1}
        >
          <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.25)", fontSize: 12 }}>
            © 2025 SAYARATECH DZ — Votre garage en ligne. Tous droits réservés.
          </Typography>
          <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.15)", fontSize: 11 }}>
            Fait avec ❤️ en Algérie
          </Typography>
        </Stack>
      </Container>
    </Box>
  );
};

export default Footer;
