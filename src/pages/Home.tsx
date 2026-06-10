// @ts-nocheck
import React, { useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box, Container, Typography, Button, Grid, Card, CardContent,
  Stack, useTheme, Chip, Avatar, Divider,
} from "@mui/material";
import { motion, useScroll, useTransform } from "framer-motion";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import VerifiedUserIcon from "@mui/icons-material/VerifiedUser";
import SupportAgentIcon from "@mui/icons-material/SupportAgent";
import BoltIcon from "@mui/icons-material/Bolt";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import StarIcon from "@mui/icons-material/Star";
import { useGetProductsQuery } from "../Redux/product";

const features = [
  { icon: <LocalShippingIcon sx={{ fontSize: 30 }} />, title: "Livraison Gratuite", description: "Partout en Algérie", color: "#3b82f6", gradient: "linear-gradient(135deg,#3b82f6,#1d4ed8)" },
  { icon: <VerifiedUserIcon sx={{ fontSize: 30 }} />, title: "100% Originaux", description: "Garantis authentiques", color: "#10b981", gradient: "linear-gradient(135deg,#10b981,#059669)" },
  { icon: <SupportAgentIcon sx={{ fontSize: 30 }} />, title: "Support 24/7", description: "Toujours disponible", color: "#E63946", gradient: "linear-gradient(135deg,#E63946,#c1121f)" },
  { icon: <BoltIcon sx={{ fontSize: 30 }} />, title: "Achat Rapide", description: "Commande sécurisée", color: "#f59e0b", gradient: "linear-gradient(135deg,#f59e0b,#d97706)" },
];

const brands = [
  { name: "PEUGEOT",    logo: "/logos/peugeot.png" },
  { name: "RENAULT",    logo: "/logos/renault.png" },
  { name: "VOLKSWAGEN", logo: "/logos/volkswagen.png" },
  { name: "SEAT",       logo: "/logos/seat.png" },
  { name: "SKODA",      logo: "/logos/skoda.png" },
  { name: "MERCEDES",   logo: "/logos/mercedes.png" },
  { name: "AUDI",       logo: "/logos/audi.png" },
  { name: "KIA",        logo: "/logos/kia.png" },
  { name: "HYUNDAI",    logo: "/logos/hyundai.png" },
  { name: "CHEVROLET",  logo: "/logos/chevrolet.png" },
  { name: "FIAT",       logo: "/logos/fiat.png" },
  { name: "CHERY",      logo: "/logos/chery.png" },
  { name: "GEELY",      logo: "/logos/geely.png" },
];

const stats = [
  { value: "500+", label: "Références" },
  { value: "13", label: "Marques" },
  { value: "48h", label: "Livraison" },
  { value: "100%", label: "Authentique" },
];

export default function Home() {
  const navigate = useNavigate();
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const { data, isLoading } = useGetProductsQuery("products?populate=*");
  const featuredProducts = data?.data?.slice(0, 4) || [];
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);

  return (
    <Box sx={{ bgcolor: isDark ? "#080808" : "#f0f2f5", overflow: "hidden" }}>

      {/* ── STATS BAR ── */}
      <Box sx={{ bgcolor: isDark ? "#111" : "#fff", borderBottom: `1px solid ${isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)"}` }}>
        <Container maxWidth="lg">
          <Stack direction="row" justifyContent="center" divider={<Divider orientation="vertical" flexItem sx={{ my: 1.5 }} />} sx={{ py: 2 }} flexWrap="wrap" gap={0}>
            {stats.map((s, i) => (
              <Box key={i} sx={{ px: { xs: 3, md: 6 }, textAlign: "center" }}>
                <Typography variant="h5" fontWeight={900} sx={{ color: "#E63946", lineHeight: 1 }}>{s.value}</Typography>
                <Typography variant="caption" color="text.secondary" fontWeight={600} sx={{ letterSpacing: 1, textTransform: "uppercase", fontSize: 10 }}>{s.label}</Typography>
              </Box>
            ))}
          </Stack>
        </Container>
      </Box>

      {/* ── FEATURES ── */}
      <Container maxWidth="lg" sx={{ py: { xs: 6, md: 9 } }}>
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <Stack alignItems="center" mb={6}>
            <Chip label="Pourquoi nous choisir" size="small" sx={{ bgcolor: "rgba(230,57,70,0.12)", color: "#E63946", fontWeight: 700, mb: 1.5, px: 1 }} />
            <Typography variant="h3" fontWeight={900} textAlign="center" sx={{ color: isDark ? "#fff" : "#0a0a0a", lineHeight: 1.1 }}>
              Nos Avantages
            </Typography>
            <Box sx={{ width: 60, height: 4, bgcolor: "#E63946", borderRadius: 2, mt: 2 }} />
          </Stack>
        </motion.div>

        <Grid container spacing={{ xs: 2, md: 3 }}>
          {features.map((f, i) => (
            <Grid item xs={6} sm={6} md={3} key={i}>
              <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.12 }} viewport={{ once: true }}>
                <Box sx={{
                  p: { xs: 2, md: 3.5 }, borderRadius: 4, height: "100%",
                  bgcolor: isDark ? "#111" : "#fff",
                  border: `1px solid ${isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)"}`,
                  position: "relative", overflow: "hidden",
                  transition: "all 0.4s cubic-bezier(0.4,0,0.2,1)",
                  "&:hover": {
                    transform: "translateY(-8px)",
                    boxShadow: `0 24px 48px ${f.color}30`,
                    borderColor: f.color,
                    "& .feat-icon": { transform: "scale(1.1) rotate(-5deg)" },
                  },
                }}>
                  <Box sx={{ position: "absolute", top: -20, right: -20, width: 100, height: 100, borderRadius: "50%", background: f.gradient, opacity: 0.06 }} />
                  <Box className="feat-icon" sx={{
                    width: 60, height: 60, borderRadius: 3, background: f.gradient,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    color: "#fff", mb: 2.5, transition: "transform 0.3s",
                    boxShadow: `0 8px 20px ${f.color}40`,
                  }}>{f.icon}</Box>
                  <Typography fontWeight={800} fontSize={16} mb={0.8} color={isDark ? "#fff" : "#0a0a0a"}>{f.title}</Typography>
                  <Typography variant="body2" color="text.secondary" fontSize={13} lineHeight={1.6}>{f.description}</Typography>
                </Box>
              </motion.div>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* ── BRANDS ── */}
      <Box sx={{ py: { xs: 5, md: 7 }, bgcolor: isDark ? "#0d0d0d" : "#fff", borderTop: `1px solid ${isDark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.05)"}`, borderBottom: `1px solid ${isDark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.05)"}` }}>
        <Container maxWidth="lg">
          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
            <Typography variant="overline" sx={{ display: "block", textAlign: "center", color: "text.secondary", mb: 4, letterSpacing: 3, fontSize: 11 }}>
              Marques disponibles
            </Typography>
          </motion.div>
          <Stack direction="row" justifyContent="center" flexWrap="wrap" gap={2}>
            {brands.map((b, i) => (
              <motion.div key={b.name} initial={{ opacity: 0, scale: 0.8 }} whileInView={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.05 }} viewport={{ once: true }}>
                <Box onClick={() => navigate(`/products?category=${b.name}`)} sx={{
                  display: "flex", flexDirection: "column", alignItems: "center", gap: 1,
                  cursor: "pointer", p: 2, borderRadius: 3, minWidth: 80,
                  bgcolor: isDark ? "#161616" : "#f8f9fb",
                  border: `1px solid ${isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)"}`,
                  transition: "all 0.3s",
                  "&:hover": {
                    borderColor: "#E63946", bgcolor: "rgba(230,57,70,0.06)",
                    transform: "translateY(-4px)", boxShadow: "0 12px 24px rgba(230,57,70,0.15)",
                  },
                }}>
                  <Box sx={{ width: 56, height: 56, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <img src={b.logo} alt={b.name} style={{ width: "100%", height: "100%", objectFit: "contain" }} />
                  </Box>
                  <Typography sx={{ fontSize: 10, fontWeight: 800, color: "text.secondary", letterSpacing: 0.8, textTransform: "uppercase" }}>{b.name}</Typography>
                </Box>
              </motion.div>
            ))}
          </Stack>
        </Container>
      </Box>

      {/* ── FEATURED PRODUCTS ── */}
      {!isLoading && featuredProducts.length > 0 && (
        <Container maxWidth="lg" sx={{ py: { xs: 6, md: 9 } }}>
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <Stack direction="row" justifyContent="space-between" alignItems="flex-end" mb={5}>
              <Box>
                <Chip label="Sélection" size="small" sx={{ bgcolor: "rgba(230,57,70,0.12)", color: "#E63946", fontWeight: 700, mb: 1.5, px: 1 }} />
                <Typography variant="h3" fontWeight={900} sx={{ color: isDark ? "#fff" : "#0a0a0a", lineHeight: 1.1 }}>
                  Produits Vedettes
                </Typography>
                <Box sx={{ width: 60, height: 4, bgcolor: "#E63946", borderRadius: 2, mt: 1.5 }} />
              </Box>
              <Button endIcon={<ArrowForwardIcon />} onClick={() => navigate("/products")}
                sx={{ color: "#E63946", fontWeight: 700, textTransform: "none", fontSize: 15, "&:hover": { bgcolor: "rgba(230,57,70,0.06)" }, borderRadius: 2 }}>
                Voir tout
              </Button>
            </Stack>
          </motion.div>

          <Grid container spacing={{ xs: 2, md: 3 }}>
            {featuredProducts.map((item, index) => {
              const product = item.attributes;
              const price = product.productPrice;
              const discount = product.discount || 0;
              const finalPrice = discount > 0 ? price - (price * discount) / 100 : price;
              return (
                <Grid item xs={6} sm={6} md={3} key={item.id}>
                  <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }} viewport={{ once: true }}>
                    <Card onClick={() => navigate(`/product/${item.id}`)} sx={{
                      cursor: "pointer", borderRadius: 4, overflow: "hidden",
                      bgcolor: isDark ? "#111" : "#fff",
                      border: `1px solid ${isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.06)"}`,
                      transition: "all 0.4s cubic-bezier(0.4,0,0.2,1)",
                      "&:hover": {
                        transform: "translateY(-10px)",
                        boxShadow: isDark ? "0 24px 48px rgba(0,0,0,0.5)" : "0 24px 48px rgba(0,0,0,0.12)",
                        borderColor: "rgba(230,57,70,0.4)",
                        "& .prod-img": { transform: "scale(1.08)" },
                      },
                    }}>
                      <Box sx={{ position: "relative", bgcolor: isDark ? "#1a1a1a" : "#f5f5f5", overflow: "hidden", height: 200 }}>
                        <Box className="prod-img" component="img"
                          src={product.productimg?.data?.[0]?.attributes?.url || "/fallback-image.jpg"}
                          alt={product.productTitle}
                          sx={{ width: "100%", height: "100%", objectFit: "contain", p: 2, transition: "transform 0.4s" }} />
                        {discount > 0 && (
                          <Box sx={{ position: "absolute", top: 12, left: 12, bgcolor: "#E63946", color: "#fff", borderRadius: "20px", px: 1.5, py: 0.4, fontSize: 11, fontWeight: 800 }}>
                            -{discount}%
                          </Box>
                        )}
                      </Box>
                      <CardContent sx={{ p: 2.5 }}>
                        <Typography variant="body2" fontWeight={700} noWrap mb={1.5} fontSize={13} color={isDark ? "#fff" : "#0a0a0a"}>
                          {product.productTitle}
                        </Typography>
                        <Stack direction="row" spacing={1} alignItems="center" mb={1.5}>
                          {discount > 0 && (
                            <Typography variant="caption" sx={{ textDecoration: "line-through", color: "text.secondary" }}>{price} DA</Typography>
                          )}
                          <Typography variant="subtitle1" sx={{ color: "#E63946", fontWeight: 900, fontSize: 16 }}>
                            {finalPrice.toFixed(0)} DA
                          </Typography>
                        </Stack>
                        <Button fullWidth variant="contained" size="small"
                          sx={{ bgcolor: isDark ? "#1a1a1a" : "#0a0a0a", color: "#fff", borderRadius: 2, textTransform: "none", fontWeight: 700, fontSize: 12, py: 0.9, "&:hover": { bgcolor: "#E63946" }, transition: "background 0.3s" }}>
                          Voir le produit
                        </Button>
                      </CardContent>
                    </Card>
                  </motion.div>
                </Grid>
              );
            })}
          </Grid>
        </Container>
      )}

      {/* ── CTA BANNER ── */}
      <Box sx={{ py: { xs: 6, md: 8 }, px: 2 }}>
        <Container maxWidth="lg">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <Box sx={{
              position: "relative", overflow: "hidden", borderRadius: 5,
              background: "linear-gradient(135deg, #1a0000 0%, #E63946 50%, #c1121f 100%)",
              p: { xs: 5, md: 8 }, textAlign: "center", color: "#fff",
              boxShadow: "0 30px 80px rgba(230,57,70,0.4)",
            }}>
              {/* Decorative circles */}
              <Box sx={{ position: "absolute", top: -60, right: -60, width: 250, height: 250, borderRadius: "50%", bgcolor: "rgba(255,255,255,0.05)" }} />
              <Box sx={{ position: "absolute", bottom: -40, left: -40, width: 180, height: 180, borderRadius: "50%", bgcolor: "rgba(255,255,255,0.04)" }} />

              <Chip label="Catalogue complet" size="small" sx={{ bgcolor: "rgba(255,255,255,0.15)", color: "#fff", fontWeight: 700, mb: 2.5, backdropFilter: "blur(10px)" }} />
              <Typography variant="h3" fontWeight={900} mb={1.5} sx={{ lineHeight: 1.1, position: "relative" }}>
                Trouvez la pièce<br />qu'il vous faut
              </Typography>
              <Typography sx={{ opacity: 0.8, mb: 4, fontSize: 16, position: "relative" }}>
                Plus de 500 références pour toutes les marques
              </Typography>
              <Stack direction={{ xs: "column", sm: "row" }} spacing={2} justifyContent="center" sx={{ position: "relative" }}>
                <Button variant="contained" onClick={() => navigate("/products")}
                  sx={{ bgcolor: "#fff", color: "#E63946", fontWeight: 800, px: 5, py: 1.6, borderRadius: "30px", textTransform: "none", fontSize: 15, "&:hover": { bgcolor: "rgba(255,255,255,0.9)", transform: "scale(1.03)" }, transition: "all 0.3s" }}>
                  Parcourir le catalogue
                </Button>
                <Button variant="outlined" onClick={() => navigate("/promotions")}
                  sx={{ borderColor: "rgba(255,255,255,0.5)", color: "#fff", fontWeight: 700, px: 4, py: 1.6, borderRadius: "30px", textTransform: "none", fontSize: 15, "&:hover": { bgcolor: "rgba(255,255,255,0.1)", borderColor: "#fff" }, transition: "all 0.3s" }}>
                  🔥 Voir les promos
                </Button>
              </Stack>
            </Box>
          </motion.div>
        </Container>
      </Box>

    </Box>
  );
}
