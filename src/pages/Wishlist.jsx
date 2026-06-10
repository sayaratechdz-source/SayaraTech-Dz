// @ts-nocheck
import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { selectWishlistItems, removeFromWishlist } from "../Redux/wishlist";
import { addToCart } from "../Redux/cart";
import { useNavigate } from "react-router-dom";
import {
  Box, Container, Typography, Grid, Card, CardMedia, CardContent,
  CardActions, Button, IconButton, Stack, Chip, useTheme,
} from "@mui/material";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import FavoriteIcon from "@mui/icons-material/Favorite";
import { motion, AnimatePresence } from "framer-motion";

export default function Wishlist() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const items = useSelector(selectWishlistItems);

  const handleRemove = (id) => dispatch(removeFromWishlist(id));

  const handleAddToCart = (item) => {
    dispatch(addToCart({ ...item, quantity: 1 }));
    dispatch(removeFromWishlist(item.id));
  };

  return (
    <Box sx={{ minHeight: "80vh", bgcolor: isDark ? "#0a0a0a" : "#f8f9fb", py: 6 }}>
      <Container maxWidth="lg">
        {/* Header */}
        <Stack direction="row" alignItems="center" spacing={1.5} mb={4}>
          <FavoriteIcon sx={{ color: "#E63946", fontSize: 28 }} />
          <Typography variant="h5" fontWeight={800}>
            Mes Favoris
          </Typography>
          <Chip
            label={items.length}
            size="small"
            sx={{ bgcolor: "#E63946", color: "#fff", fontWeight: 700 }}
          />
        </Stack>

        {items.length === 0 ? (
          <Box sx={{ textAlign: "center", py: 10 }}>
            <FavoriteIcon sx={{ fontSize: 64, color: "rgba(0,0,0,0.1)", mb: 2 }} />
            <Typography variant="h6" color="text.secondary" mb={3}>
              Votre liste de favoris est vide
            </Typography>
            <Button
              variant="contained"
              onClick={() => navigate("/products")}
              sx={{
                bgcolor: "#E63946",
                borderRadius: "30px",
                px: 4,
                textTransform: "none",
                fontWeight: 700,
                "&:hover": { bgcolor: "#c1121f" },
              }}
            >
              Découvrir les produits
            </Button>
          </Box>
        ) : (
          <Grid container spacing={3}>
            <AnimatePresence>
              {items.map((item) => {
                const price = item.productPrice;
                const discount = item.discount || 0;
                const finalPrice = discount > 0 ? price - (price * discount) / 100 : price;
                const imgUrl = item.productimg?.data?.[0]?.attributes?.url || "/fallback-image.jpg";

                return (
                  <Grid item xs={12} sm={6} md={4} lg={3} key={item.id}>
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ duration: 0.25 }}
                    >
                      <Card
                        sx={{
                          borderRadius: 3,
                          overflow: "hidden",
                          bgcolor: isDark ? "#161616" : "#fff",
                          border: `1px solid ${isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.06)"}`,
                          transition: "all 0.3s",
                          "&:hover": {
                            transform: "translateY(-4px)",
                            boxShadow: "0 16px 40px rgba(0,0,0,0.12)",
                          },
                        }}
                      >
                        {/* Image */}
                        <Box sx={{ position: "relative", bgcolor: isDark ? "#1a1a1a" : "#f5f5f5" }}>
                          <CardMedia
                            component="img"
                            image={imgUrl}
                            alt={item.productTitle}
                            sx={{ height: 180, objectFit: "contain", p: 2, cursor: "pointer" }}
                            onClick={() => navigate(`/product/${item.id}`)}
                          />
                          {discount > 0 && (
                            <Chip
                              label={`-${discount}%`}
                              size="small"
                              sx={{
                                position: "absolute", top: 10, left: 10,
                                bgcolor: "#E63946", color: "#fff", fontWeight: 700, fontSize: 11,
                              }}
                            />
                          )}
                          <IconButton
                            size="small"
                            onClick={() => handleRemove(item.id)}
                            sx={{
                              position: "absolute", top: 8, right: 8,
                              bgcolor: "rgba(255,255,255,0.9)",
                              "&:hover": { bgcolor: "#E63946", color: "#fff" },
                              transition: "0.2s",
                            }}
                          >
                            <DeleteOutlineIcon fontSize="small" />
                          </IconButton>
                        </Box>

                        <CardContent sx={{ pb: 1, px: 2 }}>
                          <Typography
                            variant="body2"
                            fontWeight={700}
                            fontSize={13}
                            sx={{
                              cursor: "pointer",
                              display: "-webkit-box",
                              WebkitLineClamp: 2,
                              WebkitBoxOrient: "vertical",
                              overflow: "hidden",
                              mb: 1,
                            }}
                            onClick={() => navigate(`/product/${item.id}`)}
                          >
                            {item.productTitle}
                          </Typography>
                          <Stack direction="row" spacing={1} alignItems="center">
                            {discount > 0 && (
                              <Typography variant="caption" sx={{ textDecoration: "line-through", color: "text.secondary" }}>
                                {price} DA
                              </Typography>
                            )}
                            <Typography variant="subtitle2" sx={{ color: "#E63946", fontWeight: 800 }}>
                              {finalPrice.toFixed(2)} DA
                            </Typography>
                          </Stack>
                        </CardContent>

                        <CardActions sx={{ px: 2, pb: 2, pt: 0 }}>
                          <Button
                            fullWidth
                            variant="contained"
                            size="small"
                            startIcon={<ShoppingCartOutlinedIcon />}
                            onClick={() => handleAddToCart(item)}
                            disabled={item.stock === 0}
                            sx={{
                              bgcolor: "#1a1a2e",
                              borderRadius: "20px",
                              textTransform: "none",
                              fontWeight: 700,
                              fontSize: "0.8rem",
                              "&:hover": { bgcolor: "#E63946" },
                              transition: "background 0.3s",
                            }}
                          >
                            {item.stock === 0 ? "Rupture de stock" : "Ajouter au panier"}
                          </Button>
                        </CardActions>
                      </Card>
                    </motion.div>
                  </Grid>
                );
              })}
            </AnimatePresence>
          </Grid>
        )}
      </Container>
    </Box>
  );
}
