// @ts-nocheck
import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Box, Container, Typography, Grid, Card, CardMedia, CardContent,
  CardActions, Button, Chip, Stack, useTheme, LinearProgress,
} from "@mui/material";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import TimerIcon from "@mui/icons-material/Timer";
import { motion } from "framer-motion";
import { useGetProductsQuery } from "../Redux/product";

export default function Promotions() {
  const navigate = useNavigate();
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const { data, isLoading } = useGetProductsQuery("products?populate=*");

  const promoProducts = (data?.data || []).filter(item => (item.attributes.discount || 0) > 0)
    .sort((a, b) => (b.attributes.discount || 0) - (a.attributes.discount || 0));

  return (
    <Box sx={{ minHeight: "80vh", bgcolor: isDark ? "#0a0a0a" : "#f8f9fb", pb: 8 }}>
      {/* Hero banner */}
      <Box sx={{
        background: "linear-gradient(135deg, #1a0000 0%, #E63946 50%, #ff6b6b 100%)",
        py: { xs: 5, md: 8 }, textAlign: "center", color: "#fff", position: "relative", overflow: "hidden",
      }}>
        {[300, 500, 700].map((s, i) => (
          <Box key={i} sx={{ position: "absolute", width: s, height: s, borderRadius: "50%", border: "1px solid rgba(255,255,255,0.08)", top: "50%", left: "50%", transform: "translate(-50%,-50%)" }} />
        ))}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <Stack direction="row" justifyContent="center" alignItems="center" spacing={1.5} mb={1}>
            <LocalOfferIcon sx={{ fontSize: 32 }} />
            <Typography variant="h3" fontWeight={900} sx={{ fontSize: { xs: "1.8rem", md: "2.8rem" } }}>
              Promotions & Soldes
            </Typography>
          </Stack>
          <Typography sx={{ opacity: 0.85, fontSize: { xs: 14, md: 16 }, mb: 2 }}>
            Les meilleures offres sur les pièces auto — économisez jusqu'à {Math.max(...(promoProducts.map(p => p.attributes.discount || 0)), 0)}%
          </Typography>
          <Chip label={`${promoProducts.length} offres disponibles`} sx={{ bgcolor: "rgba(255,255,255,0.2)", color: "#fff", fontWeight: 700, fontSize: 13 }} />
        </motion.div>
      </Box>

      <Container maxWidth="lg" sx={{ mt: 5 }}>
        {isLoading ? (
          <Box sx={{ py: 4 }}><LinearProgress sx={{ borderRadius: 2 }} /></Box>
        ) : promoProducts.length === 0 ? (
          <Box sx={{ textAlign: "center", py: 8 }}>
            <Typography color="text.secondary">Aucune promotion disponible pour le moment</Typography>
          </Box>
        ) : (
          <Grid container spacing={3}>
            {promoProducts.map((item, index) => {
              const a = item.attributes;
              const price = a.productPrice;
              const discount = a.discount || 0;
              const finalPrice = (price - (price * discount) / 100).toFixed(2);
              const saved = (price - parseFloat(finalPrice)).toFixed(2);

              return (
                <Grid item xs={12} sm={6} md={4} lg={3} key={item.id}>
                  <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.06 }} viewport={{ once: true }}>
                    <Card sx={{
                      borderRadius: 3, overflow: "hidden",
                      bgcolor: isDark ? "#161616" : "#fff",
                      border: `1px solid ${isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.06)"}`,
                      transition: "all 0.3s",
                      "&:hover": { transform: "translateY(-6px)", boxShadow: "0 20px 40px rgba(230,57,70,0.15)", borderColor: "rgba(230,57,70,0.3)" },
                    }}>
                      <Box sx={{ position: "relative", bgcolor: isDark ? "#1a1a1a" : "#f5f5f5" }}>
                        <CardMedia component="img"
                          image={a.productimg?.data?.[0]?.attributes?.url || "/fallback-image.jpg"}
                          alt={a.productTitle}
                          sx={{ height: 180, objectFit: "contain", p: 2, cursor: "pointer" }}
                          onClick={() => navigate(`/product/${item.id}`)} />
                        {/* Big discount badge */}
                        <Box sx={{
                          position: "absolute", top: 0, right: 0,
                          bgcolor: "#E63946", color: "#fff",
                          width: 56, height: 56, borderRadius: "0 0 0 100%",
                          display: "flex", alignItems: "flex-start", justifyContent: "flex-end",
                          pr: 0.8, pt: 0.5,
                        }}>
                          <Typography fontWeight={900} fontSize={13}>-{discount}%</Typography>
                        </Box>
                      </Box>

                      <CardContent sx={{ px: 2, pt: 1.5, pb: 1 }}>
                        <Typography fontWeight={700} fontSize={13} sx={{ display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden", mb: 1, cursor: "pointer" }}
                          onClick={() => navigate(`/product/${item.id}`)}>
                          {a.productTitle}
                        </Typography>
                        <Stack direction="row" spacing={1} alignItems="center" mb={0.5}>
                          <Typography variant="caption" sx={{ textDecoration: "line-through", color: "#aaa" }}>{price} DA</Typography>
                          <Typography fontWeight={900} fontSize={16} sx={{ color: "#E63946" }}>{finalPrice} DA</Typography>
                        </Stack>
                        <Chip label={`Économie: ${saved} DA`} size="small"
                          sx={{ bgcolor: "rgba(16,185,129,0.1)", color: "#10b981", fontWeight: 700, fontSize: 10, height: 20 }} />
                      </CardContent>

                      <CardActions sx={{ px: 2, pb: 2, pt: 0 }}>
                        <Button fullWidth variant="contained" size="small"
                          onClick={() => navigate(`/product/${item.id}`)}
                          sx={{ bgcolor: "#E63946", borderRadius: "20px", textTransform: "none", fontWeight: 700, fontSize: "0.8rem", "&:hover": { bgcolor: "#c1121f" } }}>
                          Profiter de l'offre
                        </Button>
                      </CardActions>
                    </Card>
                  </motion.div>
                </Grid>
              );
            })}
          </Grid>
        )}
      </Container>
    </Box>
  );
}
