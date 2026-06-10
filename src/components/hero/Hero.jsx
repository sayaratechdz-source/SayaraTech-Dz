import React from "react";
import { Box, Button, Typography, Stack, Chip } from "@mui/material";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay, EffectFade } from "swiper";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/effect-fade";

const mySlider = [
  {
    title: "Pièces Auto Premium",
    subtitle: "Originales & Haute Qualité",
    tag: "Nouveautés 2025",
    image: "/images/car-banner1.jpg",
    cta: "Découvrir",
    accent: "#E63946",
  },
  {
    title: "Boostez Votre Voiture",
    subtitle: "Les Meilleures Pièces Performance",
    tag: "Top Ventes",
    image: "/images/car-banner2.jpg",
    cta: "Voir les offres",
    accent: "#3a86ff",
  },
  {
    title: "Roulez en Confiance",
    subtitle: "Performance & Sécurité Garanties",
    tag: "Livraison Gratuite",
    image: "/images/car-banner3.jpg",
    cta: "Commander",
    accent: "#2ec4b6",
  },
];

const Hero = () => {
  const navigate = useNavigate();

  return (
    <Box sx={{ position: "relative" }}>
      <Swiper
        loop
        autoplay={{ delay: 5000, disableOnInteraction: false }}
        pagination={{ dynamicBullets: true, clickable: true }}
        effect="fade"
        modules={[Pagination, Autoplay, EffectFade]}
        style={{ "--swiper-pagination-color": "#E63946" }}
      >
        {mySlider.map((item, index) => (
          <SwiperSlide key={index}>
            <Box sx={{ position: "relative", width: "100%", overflow: "hidden" }}>
              {/* Image */}
              <Box
                component="img"
                src={item.image}
                alt={item.title}
                sx={{
                  width: "100%",
                  height: { xs: "320px", md: "580px" },
                  objectFit: "cover",
                  display: "block",
                }}
              />

              {/* Gradient overlay */}
              <Box
                sx={{
                  position: "absolute",
                  inset: 0,
                  background:
                    "linear-gradient(90deg, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.3) 60%, transparent 100%)",
                }}
              />

              {/* Content */}
              <Box
                sx={{
                  position: "absolute",
                  top: "50%",
                  left: { xs: "5%", md: "8%" },
                  transform: "translateY(-50%)",
                  color: "#fff",
                  maxWidth: { xs: "90%", md: "520px" },
                }}
              >
                <motion.div
                  key={`tag-${index}`}
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6 }}
                >
                  <Chip
                    label={item.tag}
                    size="small"
                    sx={{
                      bgcolor: item.accent,
                      color: "#fff",
                      fontWeight: 700,
                      fontSize: 11,
                      mb: 2,
                      letterSpacing: 1,
                    }}
                  />
                </motion.div>

                <motion.div
                  key={`title-${index}`}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.7, delay: 0.1 }}
                >
                  <Typography
                    variant="h2"
                    sx={{
                      fontWeight: 900,
                      mb: 1.5,
                      fontSize: { xs: "1.8rem", md: "3.2rem" },
                      lineHeight: 1.1,
                      textShadow: "0 2px 20px rgba(0,0,0,0.5)",
                    }}
                  >
                    {item.title}
                  </Typography>
                </motion.div>

                <motion.div
                  key={`sub-${index}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.7, delay: 0.25 }}
                >
                  <Typography
                    sx={{
                      mb: 3,
                      fontSize: { xs: "0.95rem", md: "1.2rem" },
                      color: "rgba(255,255,255,0.8)",
                      fontWeight: 300,
                    }}
                  >
                    {item.subtitle}
                  </Typography>
                </motion.div>

                <motion.div
                  key={`btn-${index}`}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                >
                  <Stack direction="row" spacing={2}>
                    <Button
                      variant="contained"
                      onClick={() => navigate("/products")}
                      sx={{
                        bgcolor: item.accent,
                        px: { xs: 3, md: 5 },
                        py: { xs: 1.2, md: 1.6 },
                        fontWeight: 800,
                        fontSize: { xs: "0.85rem", md: "1rem" },
                        borderRadius: "30px",
                        textTransform: "none",
                        boxShadow: `0 8px 24px ${item.accent}55`,
                        "&:hover": {
                          bgcolor: item.accent,
                          transform: "translateY(-2px)",
                          boxShadow: `0 12px 30px ${item.accent}77`,
                        },
                        transition: "all 0.3s",
                      }}
                    >
                      {item.cta}
                    </Button>
                    <Button
                      variant="outlined"
                      onClick={() => navigate("/products")}
                      sx={{
                        borderColor: "rgba(255,255,255,0.5)",
                        color: "#fff",
                        px: { xs: 3, md: 4 },
                        py: { xs: 1.2, md: 1.6 },
                        fontWeight: 600,
                        fontSize: { xs: "0.85rem", md: "0.95rem" },
                        borderRadius: "30px",
                        textTransform: "none",
                        "&:hover": {
                          borderColor: "#fff",
                          bgcolor: "rgba(255,255,255,0.1)",
                        },
                      }}
                    >
                      Explorer
                    </Button>
                  </Stack>
                </motion.div>
              </Box>
            </Box>
          </SwiperSlide>
        ))}
      </Swiper>
    </Box>
  );
};

export default Hero;
