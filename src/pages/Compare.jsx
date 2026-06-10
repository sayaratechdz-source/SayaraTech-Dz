// @ts-nocheck
import React, { useState } from "react";
import { useGetProductsQuery } from "../Redux/product";
import { useDispatch } from "react-redux";
import { addToCart } from "../Redux/cart";
import {
  Box, Container, Typography, Grid, Card, CardMedia, CardContent,
  Button, Chip, Stack, Divider, IconButton, Autocomplete, TextField,
  Paper, Tooltip,
} from "@mui/material";
import { motion, AnimatePresence } from "framer-motion";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import CloseIcon from "@mui/icons-material/Close";
import CompareArrowsIcon from "@mui/icons-material/CompareArrows";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";

const ATTRS = [
  { key: "productPrice", label: "Prix" },
  { key: "discount", label: "Remise" },
  { key: "stock", label: "Stock" },
  { key: "category", label: "Catégorie" },
  { key: "productDescription", label: "Description" },
];

export default function Compare() {
  const dispatch = useDispatch();
  const { data, isLoading } = useGetProductsQuery("products?populate=*&pagination[limit]=200");
  const products = data?.data || [];

  const [selected, setSelected] = useState([null, null, null]);

  const handleSelect = (index, product) => {
    const updated = [...selected];
    updated[index] = product;
    setSelected(updated);
  };

  const handleRemove = (index) => {
    const updated = [...selected];
    updated[index] = null;
    setSelected(updated);
  };

  const activeProducts = selected.filter(Boolean);

  const getAttrValue = (product, key) => {
    const val = product?.attributes?.[key];
    if (val === undefined || val === null || val === "") return "—";
    if (key === "productPrice") return `${val} DA`;
    if (key === "discount") return val > 0 ? `${val}%` : "Aucune";
    if (key === "stock") return val > 0 ? `${val} en stock` : "Rupture";
    return String(val);
  };

  const getBestValue = (key) => {
    if (activeProducts.length < 2) return null;
    if (key === "productPrice") {
      const prices = activeProducts.map((p) => p.attributes?.productPrice || Infinity);
      return Math.min(...prices);
    }
    if (key === "discount") {
      const discounts = activeProducts.map((p) => p.attributes?.discount || 0);
      return Math.max(...discounts);
    }
    if (key === "stock") {
      const stocks = activeProducts.map((p) => p.attributes?.stock || 0);
      return Math.max(...stocks);
    }
    return null;
  };

  const isBest = (product, key) => {
    const best = getBestValue(key);
    if (best === null) return false;
    const val = product?.attributes?.[key];
    if (key === "productPrice") return val === best;
    if (key === "discount") return val === best && val > 0;
    if (key === "stock") return val === best;
    return false;
  };

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#0a0a0a", py: 6 }}>
      <Container maxWidth="xl">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
          <Stack direction="row" alignItems="center" spacing={2} mb={5}>
            <Box sx={{ p: 1.5, bgcolor: "rgba(230,57,70,0.15)", borderRadius: 2 }}>
              <CompareArrowsIcon sx={{ color: "#E63946", fontSize: 32 }} />
            </Box>
            <Box>
              <Typography variant="h4" fontWeight={800} color="#fff">
                Comparer les produits
              </Typography>
              <Typography variant="body2" color="rgba(255,255,255,0.5)">
                Sélectionnez jusqu'à 3 produits pour les comparer côte à côte
              </Typography>
            </Box>
          </Stack>
        </motion.div>

        {/* Selectors */}
        <Grid container spacing={3} mb={5}>
          {[0, 1, 2].map((index) => (
            <Grid item xs={12} md={4} key={index}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Paper
                  sx={{
                    p: 2,
                    bgcolor: "#111",
                    border: selected[index]
                      ? "1px solid #E63946"
                      : "1px solid rgba(255,255,255,0.08)",
                    borderRadius: 3,
                    transition: "all 0.3s",
                  }}
                >
                  {selected[index] ? (
                    <Box>
                      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={1}>
                        <Typography variant="caption" color="#E63946" fontWeight={700}>
                          Produit {index + 1}
                        </Typography>
                        <IconButton size="small" onClick={() => handleRemove(index)} sx={{ color: "rgba(255,255,255,0.4)" }}>
                          <CloseIcon fontSize="small" />
                        </IconButton>
                      </Stack>
                      <Box
                        component="img"
                        src={selected[index].attributes?.productimg?.data?.[0]?.attributes?.url || "/fallback-image.jpg"}
                        alt={selected[index].attributes?.productTitle}
                        sx={{ width: "100%", height: 120, objectFit: "contain", mb: 1 }}
                      />
                      <Typography variant="body2" fontWeight={700} color="#fff" noWrap>
                        {selected[index].attributes?.productTitle}
                      </Typography>
                      <Typography variant="h6" color="#E63946" fontWeight={800}>
                        {selected[index].attributes?.productPrice} DA
                      </Typography>
                    </Box>
                  ) : (
                    <Box>
                      <Typography variant="caption" color="rgba(255,255,255,0.4)" fontWeight={700} display="block" mb={1}>
                        Produit {index + 1}
                      </Typography>
                      <Autocomplete
                        options={products.filter(
                          (p) => !selected.some((s) => s?.id === p.id)
                        )}
                        getOptionLabel={(opt) => opt.attributes?.productTitle || ""}
                        loading={isLoading}
                        onChange={(_, val) => handleSelect(index, val)}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            placeholder="Rechercher un produit..."
                            size="small"
                            sx={{
                              "& .MuiOutlinedInput-root": {
                                color: "#fff",
                                "& fieldset": { borderColor: "rgba(255,255,255,0.15)" },
                                "&:hover fieldset": { borderColor: "#E63946" },
                              },
                              "& .MuiInputBase-input::placeholder": { color: "rgba(255,255,255,0.3)" },
                            }}
                          />
                        )}
                        renderOption={(props, option) => (
                          <Box component="li" {...props} sx={{ fontSize: 13 }}>
                            {option.attributes?.productTitle}
                          </Box>
                        )}
                      />
                    </Box>
                  )}
                </Paper>
              </motion.div>
            </Grid>
          ))}
        </Grid>

        {/* Comparison Table */}
        <AnimatePresence>
          {activeProducts.length >= 2 && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
            >
              <Paper sx={{ bgcolor: "#111", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 3, overflow: "hidden" }}>
                {/* Product headers */}
                <Grid container>
                  <Grid item xs={3}>
                    <Box sx={{ p: 2, bgcolor: "#0d0d0d", height: "100%", display: "flex", alignItems: "center" }}>
                      <Typography variant="body2" color="rgba(255,255,255,0.4)" fontWeight={700}>
                        CARACTÉRISTIQUE
                      </Typography>
                    </Box>
                  </Grid>
                  {activeProducts.map((product, i) => (
                    <Grid item xs key={product.id}>
                      <Box sx={{ p: 2, bgcolor: "#0d0d0d", textAlign: "center", borderLeft: "1px solid rgba(255,255,255,0.06)" }}>
                        <Box
                          component="img"
                          src={product.attributes?.productimg?.data?.[0]?.attributes?.url || "/fallback-image.jpg"}
                          alt={product.attributes?.productTitle}
                          sx={{ width: 80, height: 80, objectFit: "contain", mb: 1 }}
                        />
                        <Typography variant="body2" fontWeight={700} color="#fff" sx={{ fontSize: 12 }}>
                          {product.attributes?.productTitle}
                        </Typography>
                        <Button
                          size="small"
                          variant="contained"
                          startIcon={<AddShoppingCartIcon />}
                          onClick={() => dispatch(addToCart({
                            id: product.id,
                            productTitle: product.attributes?.productTitle,
                            productPrice: product.attributes?.productPrice,
                            discount: product.attributes?.discount,
                            productimg: product.attributes?.productimg,
                            stock: product.attributes?.stock,
                            quantity: 1,
                          }))}
                          sx={{
                            mt: 1, bgcolor: "#E63946", fontSize: 11,
                            "&:hover": { bgcolor: "#c62828" },
                          }}
                        >
                          Ajouter
                        </Button>
                      </Box>
                    </Grid>
                  ))}
                </Grid>

                <Divider sx={{ borderColor: "rgba(255,255,255,0.06)" }} />

                {/* Attribute rows */}
                {ATTRS.map((attr, rowIdx) => (
                  <Grid
                    container
                    key={attr.key}
                    sx={{ bgcolor: rowIdx % 2 === 0 ? "#111" : "#0e0e0e" }}
                  >
                    <Grid item xs={3}>
                      <Box sx={{ p: 2, display: "flex", alignItems: "center" }}>
                        <Typography variant="body2" color="rgba(255,255,255,0.6)" fontWeight={600}>
                          {attr.label}
                        </Typography>
                      </Box>
                    </Grid>
                    {activeProducts.map((product) => {
                      const best = isBest(product, attr.key);
                      return (
                        <Grid item xs key={product.id}>
                          <Box
                            sx={{
                              p: 2,
                              textAlign: "center",
                              borderLeft: "1px solid rgba(255,255,255,0.06)",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              gap: 0.5,
                            }}
                          >
                            <Typography
                              variant="body2"
                              fontWeight={best ? 800 : 400}
                              color={best ? "#4caf50" : "rgba(255,255,255,0.7)"}
                            >
                              {getAttrValue(product, attr.key)}
                            </Typography>
                            {best && <CheckCircleIcon sx={{ color: "#4caf50", fontSize: 16 }} />}
                          </Box>
                        </Grid>
                      );
                    })}
                  </Grid>
                ))}
              </Paper>

              <Typography variant="caption" color="rgba(255,255,255,0.3)" sx={{ mt: 2, display: "block", textAlign: "center" }}>
                ✅ = Meilleure valeur dans la comparaison
              </Typography>
            </motion.div>
          )}
        </AnimatePresence>

        {activeProducts.length < 2 && (
          <Box sx={{ textAlign: "center", py: 8 }}>
            <CompareArrowsIcon sx={{ fontSize: 80, color: "rgba(255,255,255,0.1)", mb: 2 }} />
            <Typography color="rgba(255,255,255,0.3)" variant="h6">
              Sélectionnez au moins 2 produits pour commencer la comparaison
            </Typography>
          </Box>
        )}
      </Container>
    </Box>
  );
}
