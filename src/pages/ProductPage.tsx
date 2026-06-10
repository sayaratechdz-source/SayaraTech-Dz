// @ts-nocheck
import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useGetProductsQuery } from "../Redux/product";
import { useDispatch } from "react-redux";
import { addToCart } from "../Redux/cart";
import {
  Box, Typography, TextField, MenuItem, Button, Stack, Divider,
  Paper, Chip, Snackbar, Alert, IconButton, Tooltip, Radio,
  RadioGroup, FormControlLabel, FormControl, FormLabel, Collapse,
  useTheme, Grid, Avatar,
} from "@mui/material";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import FavoriteIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteFilledIcon from "@mui/icons-material/Favorite";
import ShareIcon from "@mui/icons-material/Share";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import VerifiedIcon from "@mui/icons-material/Verified";
import SupportAgentIcon from "@mui/icons-material/SupportAgent";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import PhoneAndroidIcon from "@mui/icons-material/PhoneAndroid";
import CreditCardIcon from "@mui/icons-material/CreditCard";
import LocalAtmIcon from "@mui/icons-material/LocalAtm";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { motion } from "framer-motion";
import { WILAYAS_COMMUNES } from "../data/wilayas_communes";

import { createPurchase } from "../firebase/purchases";

const PAYMENT_METHODS = [
  { id: "livraison",  label: "Paiement a la livraison", desc: "Payez en cash a la reception",         icon: <LocalAtmIcon />,       color: "#10b981" },
  { id: "ccp",        label: "CCP / Algerie Poste",     desc: "Virement CCP 00123456789 cle 78",      icon: <AccountBalanceIcon />, color: "#3b82f6" },
  { id: "baridimob",  label: "BaridiMob",               desc: "Paiement via application BaridiMob",   icon: <PhoneAndroidIcon />,   color: "#8b5cf6" },
  { id: "virement",   label: "Virement bancaire",       desc: "BNA / BEA / CPA — RIB fourni apres",   icon: <CreditCardIcon />,     color: "#f59e0b" },
];

export default function ProductPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const { data, isLoading } = useGetProductsQuery(`products/${id}?populate=*`);

  const [clientName, setClientName]       = useState("");
  const [phone, setPhone]                 = useState("");
  const [quantity, setQuantity]           = useState(1);
  const [selectedWilaya, setSelectedWilaya]   = useState("");
  const [selectedCommune, setSelectedCommune] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("livraison");
  const [loading, setLoading]             = useState(false);
  const [message, setMessage]             = useState({ text: "", type: "success" });
  const [showCartSuccess, setShowCartSuccess] = useState(false);
  const [wishlisted, setWishlisted]       = useState(false);
  const [activeImg, setActiveImg]         = useState(0);
  const [orderDone, setOrderDone]         = useState(false);

  if (isLoading) return (
    <Box sx={{ minHeight: "60vh", display: "flex", alignItems: "center", justifyContent: "center", bgcolor: isDark ? "#0a0a0a" : "#f4f6f8" }}>
      <Stack alignItems="center" spacing={2}>
        <Box sx={{ width: 48, height: 48, borderRadius: "50%", border: "3px solid #E63946", borderTopColor: "transparent", animation: "spin 0.8s linear infinite", "@keyframes spin": { to: { transform: "rotate(360deg)" } } }} />
        <Typography sx={{ color: "rgba(255,255,255,0.4)", fontSize: 13 }}>Chargement...</Typography>
      </Stack>
    </Box>
  );
  if (!data) return (
    <Box sx={{ minHeight: "60vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <Typography color="error">Produit introuvable</Typography>
    </Box>
  );

  const product    = data.data?.attributes || {};
  const discount   = product.discount || 0;
  const price      = product.productPrice || 0;
  const finalPrice = discount > 0 ? price - (price * discount) / 100 : price;
  const totalPrice = finalPrice * quantity;
  const stock      = product.stock || 0;
  const images     = product.productimg?.data || [];

  const handleAddToCart = () => {
    dispatch(addToCart({ id: data.data.id, productTitle: product.productTitle, productPrice: product.productPrice, discount: product.discount, productimg: product.productimg, category: product.category, stock: product.stock, quantity }));
    setShowCartSuccess(true);
  };

  const handlePurchase = async () => {
    if (!clientName || !phone || !selectedWilaya || !selectedCommune) {
      setMessage({ text: "Veuillez remplir tous les champs obligatoires", type: "error" }); return;
    }
    setLoading(true); setMessage({ text: "", type: "success" });
    try {
      const paymentMap = { livraison: "cash_on_delivery", ccp: "bank_transfer", baridimob: "bank_transfer", virement: "bank_transfer" };
      const mappedPayment = paymentMap[paymentMethod] || "cash_on_delivery";
      await createPurchase({
        name: clientName,
        phone: String(phone),
        wilaya: selectedWilaya,
        commune: selectedCommune,
        quantity,
        totalPrice,
        productId: id,
        productTitle: product.productTitle,
        paymentMethod: mappedPayment,
        status: paymentMethod === "livraison" ? "confirmed" : "pending",
      });
      localStorage.setItem("lastOrderPhone", phone);
      setOrderDone(true);
      setMessage({ text: "Commande enregistrée avec succès ! Nous vous contacterons sous 24h.", type: "success" });
      setClientName(""); setPhone(""); setSelectedWilaya(""); setSelectedCommune(""); setQuantity(1);
    } catch {
      setMessage({ text: "Erreur lors de l'enregistrement. Réessayez.", type: "error" });
    } finally { setLoading(false); }
  };

  const inputSx = {
    "& .MuiOutlinedInput-root": {
      borderRadius: "12px",
      bgcolor: isDark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.03)",
      color: isDark ? "#fff" : "inherit",
      "& fieldset": { borderColor: isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.15)" },
      "&:hover fieldset": { borderColor: "#E63946" },
      "&.Mui-focused fieldset": { borderColor: "#E63946" },
    },
    "& .MuiInputLabel-root": { color: isDark ? "rgba(255,255,255,0.5)" : undefined },
    "& .MuiSelect-icon": { color: isDark ? "rgba(255,255,255,0.5)" : undefined },
  };

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: isDark ? "#0a0a0a" : "#f4f6f8", py: { xs: 3, md: 6 } }}>
      <Box sx={{ maxWidth: 1200, mx: "auto", px: { xs: 2, md: 4 } }}>
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <Grid container spacing={{ xs: 2, md: 4 }}>

            {/* ── LEFT: Image ── */}
            <Grid item xs={12} md={5}>
              <Paper elevation={0} sx={{ borderRadius: 4, overflow: "hidden", bgcolor: isDark ? "#111" : "#fff", border: `1px solid ${isDark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.06)"}`, position: { md: "sticky" }, top: 90 }}>
                {/* Main image */}
                <Box sx={{ position: "relative", p: 3, display: "flex", alignItems: "center", justifyContent: "center", minHeight: 340, bgcolor: isDark ? "#0d0d0d" : "#fafafa" }}>
                  {discount > 0 && (
                    <Chip label={`-${discount}%`} size="small" sx={{ position: "absolute", top: 16, left: 16, bgcolor: "#E63946", color: "#fff", fontWeight: 800, fontSize: 12, zIndex: 1 }} />
                  )}
                  {stock === 0 && (
                    <Chip label="Rupture de stock" size="small" sx={{ position: "absolute", top: 16, right: 16, bgcolor: "rgba(239,68,68,0.15)", color: "#ef4444", fontWeight: 700, fontSize: 11, border: "1px solid rgba(239,68,68,0.3)" }} />
                  )}
                  <img
                    src={images[activeImg]?.attributes?.url || "/fallback-image.jpg"}
                    alt={product.productTitle}
                    style={{ maxWidth: "100%", maxHeight: 320, objectFit: "contain", borderRadius: 8 }}
                  />
                  {/* Actions */}
                  <Stack direction="row" spacing={1} sx={{ position: "absolute", top: 16, right: 16 }}>
                    <Tooltip title={wishlisted ? "Retirer des favoris" : "Ajouter aux favoris"}>
                      <IconButton size="small" onClick={() => setWishlisted(!wishlisted)}
                        sx={{ bgcolor: isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.06)", backdropFilter: "blur(8px)", "&:hover": { bgcolor: "rgba(230,57,70,0.15)" } }}>
                        {wishlisted ? <FavoriteFilledIcon sx={{ fontSize: 18, color: "#E63946" }} /> : <FavoriteIcon sx={{ fontSize: 18 }} />}
                      </IconButton>
                    </Tooltip>
                  </Stack>
                </Box>
                {/* Thumbnails */}
                {images.length > 1 && (
                  <Stack direction="row" spacing={1} sx={{ p: 2, overflowX: "auto" }}>
                    {images.map((img, i) => (
                      <Box key={i} onClick={() => setActiveImg(i)} sx={{ width: 60, height: 60, borderRadius: 2, overflow: "hidden", cursor: "pointer", border: `2px solid ${activeImg === i ? "#E63946" : "transparent"}`, flexShrink: 0, transition: "0.2s" }}>
                        <img src={img.attributes.url} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                      </Box>
                    ))}
                  </Stack>
                )}
                {/* Trust badges */}
                <Stack direction="row" divider={<Divider orientation="vertical" flexItem />} sx={{ borderTop: `1px solid ${isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)"}` }}>
                  {[
                    { icon: <LocalShippingIcon sx={{ fontSize: 16 }} />, label: "Livraison rapide" },
                    { icon: <VerifiedIcon sx={{ fontSize: 16 }} />,      label: "100% original" },
                    { icon: <SupportAgentIcon sx={{ fontSize: 16 }} />,  label: "Support 24/7" },
                  ].map(b => (
                    <Stack key={b.label} alignItems="center" spacing={0.5} sx={{ flex: 1, py: 1.5, color: "rgba(255,255,255,0.4)" }}>
                      {b.icon}
                      <Typography sx={{ fontSize: 10, fontWeight: 600, color: isDark ? "rgba(255,255,255,0.35)" : "rgba(0,0,0,0.45)", textAlign: "center" }}>{b.label}</Typography>
                    </Stack>
                  ))}
                </Stack>
              </Paper>
            </Grid>

            {/* ── RIGHT: Details + Form ── */}
            <Grid item xs={12} md={7}>
              <Stack spacing={3}>

                {/* Product info */}
                <Paper elevation={0} sx={{ p: 3.5, borderRadius: 4, bgcolor: isDark ? "#111" : "#fff", border: `1px solid ${isDark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.06)"}` }}>
                  {product.category && (
                    <Chip label={product.category} size="small" sx={{ mb: 1.5, bgcolor: "rgba(230,57,70,0.1)", color: "#E63946", fontWeight: 700, fontSize: 11 }} />
                  )}
                  <Typography variant="h5" fontWeight={900} sx={{ color: isDark ? "#fff" : "#111", lineHeight: 1.3, mb: 1.5 }}>
                    {product.productTitle}
                  </Typography>

                  {/* Price */}
                  <Stack direction="row" alignItems="center" spacing={2} mb={2}>
                    <Typography sx={{ fontSize: 30, fontWeight: 900, color: "#E63946" }}>
                      {finalPrice.toLocaleString("fr-DZ")} DA
                    </Typography>
                    {discount > 0 && (
                      <Typography sx={{ fontSize: 18, textDecoration: "line-through", color: "rgba(255,255,255,0.3)" }}>
                        {price.toLocaleString("fr-DZ")} DA
                      </Typography>
                    )}
                  </Stack>

                  {/* Stock */}
                  <Stack direction="row" alignItems="center" spacing={1} mb={2}>
                    <Box sx={{ width: 8, height: 8, borderRadius: "50%", bgcolor: stock > 10 ? "#10b981" : stock > 0 ? "#f59e0b" : "#ef4444" }} />
                    <Typography sx={{ fontSize: 13, color: stock > 10 ? "#10b981" : stock > 0 ? "#f59e0b" : "#ef4444", fontWeight: 600 }}>
                      {stock > 10 ? `En stock (${stock} disponibles)` : stock > 0 ? `Stock faible — ${stock} restants` : "Rupture de stock"}
                    </Typography>
                  </Stack>

                  <Typography sx={{ fontSize: 14, color: isDark ? "rgba(255,255,255,0.55)" : "rgba(0,0,0,0.55)", lineHeight: 1.8 }}>
                    {product.productDescription || "Piece de rechange de qualite superieure."}
                  </Typography>

                  {/* Quick add to cart */}
                  <Stack direction="row" spacing={2} mt={3} alignItems="center">
                    {/* Qty */}
                    <Stack direction="row" alignItems="center" sx={{ border: `1px solid ${isDark ? "rgba(255,255,255,0.12)" : "rgba(0,0,0,0.12)"}`, borderRadius: 2.5, overflow: "hidden" }}>
                      <IconButton size="small" onClick={() => setQuantity(q => Math.max(1, q - 1))} sx={{ borderRadius: 0, px: 1.5, "&:hover": { bgcolor: "rgba(230,57,70,0.1)" } }}><RemoveIcon sx={{ fontSize: 16 }} /></IconButton>
                      <Typography sx={{ px: 2, fontWeight: 800, minWidth: 32, textAlign: "center" }}>{quantity}</Typography>
                      <IconButton size="small" onClick={() => setQuantity(q => Math.min(stock, q + 1))} sx={{ borderRadius: 0, px: 1.5, "&:hover": { bgcolor: "rgba(230,57,70,0.1)" } }}><AddIcon sx={{ fontSize: 16 }} /></IconButton>
                    </Stack>
                    <Button variant="outlined" startIcon={<AddShoppingCartIcon />} onClick={handleAddToCart} disabled={stock === 0}
                      sx={{ flex: 1, borderRadius: 2.5, py: 1.2, textTransform: "none", fontWeight: 700, borderColor: "#E63946", color: "#E63946", "&:hover": { bgcolor: "rgba(230,57,70,0.08)" } }}>
                      Ajouter au panier
                    </Button>
                  </Stack>
                </Paper>

                {/* Order form */}
                <Paper elevation={0} sx={{ p: 3.5, borderRadius: 4, bgcolor: isDark ? "#111" : "#fff", border: `1px solid ${isDark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.06)"}` }}>
                  <Stack direction="row" alignItems="center" spacing={1.5} mb={3}>
                    <Box sx={{ width: 36, height: 36, borderRadius: 2, bgcolor: "rgba(230,57,70,0.12)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <ShoppingCartIcon sx={{ color: "#E63946", fontSize: 18 }} />
                    </Box>
                    <Typography fontWeight={800} fontSize={16}>Commander maintenant</Typography>
                  </Stack>

                  <Stack spacing={2}>
                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={6}>
                        <TextField label="Nom complet *" fullWidth value={clientName} onChange={e => setClientName(e.target.value)} sx={inputSx} />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField label="Telephone *" fullWidth value={phone} onChange={e => setPhone(e.target.value.replace(/\D/g, ""))} placeholder="0555 123 456" inputProps={{ maxLength: 10 }} sx={inputSx} />
                      </Grid>
                    </Grid>

                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={6}>
                        <TextField select label="Wilaya *" fullWidth value={selectedWilaya} onChange={e => { setSelectedWilaya(e.target.value); setSelectedCommune(""); }} sx={inputSx}
                          SelectProps={{ MenuProps: { PaperProps: { sx: { bgcolor: isDark ? "#1a1a1a" : "#fff", maxHeight: 280 } } } }}>
                          {Object.keys(WILAYAS_COMMUNES).map(w => <MenuItem key={w} value={w}>{w}</MenuItem>)}
                        </TextField>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField select label="Commune *" fullWidth value={selectedCommune} onChange={e => setSelectedCommune(e.target.value)} disabled={!selectedWilaya} sx={inputSx}
                          SelectProps={{ MenuProps: { PaperProps: { sx: { bgcolor: isDark ? "#1a1a1a" : "#fff", maxHeight: 280 } } } }}>
                          {(WILAYAS_COMMUNES[selectedWilaya] || []).map(c => <MenuItem key={c} value={c}>{c}</MenuItem>)}
                        </TextField>
                      </Grid>
                    </Grid>

                    {/* Payment methods */}
                    <Box sx={{ p: 2.5, borderRadius: 3, bgcolor: isDark ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.02)", border: `1px solid ${isDark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.07)"}` }}>
                      <Typography fontWeight={800} fontSize={14} mb={2}>Mode de paiement</Typography>
                      <Grid container spacing={1.5}>
                        {PAYMENT_METHODS.map(pm => (
                          <Grid item xs={6} sm={6} key={pm.id}>
                            <Box onClick={() => setPaymentMethod(pm.id)} sx={{
                              p: 1.8, borderRadius: 2.5, cursor: "pointer", transition: "all 0.2s",
                              border: `2px solid ${paymentMethod === pm.id ? pm.color : isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)"}`,
                              bgcolor: paymentMethod === pm.id ? `${pm.color}12` : "transparent",
                              "&:hover": { borderColor: pm.color, bgcolor: `${pm.color}08` },
                            }}>
                              <Stack direction="row" alignItems="center" spacing={1.5}>
                                <Box sx={{ color: paymentMethod === pm.id ? pm.color : isDark ? "rgba(255,255,255,0.35)" : "rgba(0,0,0,0.35)", display: "flex" }}>
                                  {React.cloneElement(pm.icon, { sx: { fontSize: 20 } })}
                                </Box>
                                <Box sx={{ flex: 1 }}>
                                  <Typography fontSize={12} fontWeight={700} sx={{ color: paymentMethod === pm.id ? pm.color : isDark ? "#fff" : "#111" }}>{pm.label}</Typography>
                                  <Typography fontSize={10} sx={{ color: isDark ? "rgba(255,255,255,0.35)" : "rgba(0,0,0,0.45)" }}>{pm.desc}</Typography>
                                </Box>
                                {paymentMethod === pm.id && <CheckCircleIcon sx={{ fontSize: 16, color: pm.color, flexShrink: 0 }} />}
                              </Stack>
                            </Box>
                          </Grid>
                        ))}
                      </Grid>
                    </Box>

                    {/* Order summary */}
                    <Box sx={{ p: 2.5, borderRadius: 3, background: isDark ? "linear-gradient(135deg, rgba(230,57,70,0.08), rgba(230,57,70,0.04))" : "linear-gradient(135deg, rgba(230,57,70,0.06), rgba(230,57,70,0.02))", border: "1px solid rgba(230,57,70,0.2)" }}>
                      <Typography fontWeight={800} fontSize={14} mb={1.5} sx={{ color: "#E63946" }}>Recapitulatif</Typography>
                      <Stack spacing={0.8}>
                        <Stack direction="row" justifyContent="space-between">
                          <Typography fontSize={13} sx={{ color: isDark ? "rgba(255,255,255,0.5)" : "rgba(0,0,0,0.5)" }}>Prix unitaire</Typography>
                          <Typography fontSize={13} fontWeight={600}>{finalPrice.toLocaleString("fr-DZ")} DA</Typography>
                        </Stack>
                        <Stack direction="row" justifyContent="space-between">
                          <Typography fontSize={13} sx={{ color: isDark ? "rgba(255,255,255,0.5)" : "rgba(0,0,0,0.5)" }}>Quantite</Typography>
                          <Typography fontSize={13} fontWeight={600}>x{quantity}</Typography>
                        </Stack>
                        <Stack direction="row" justifyContent="space-between">
                          <Typography fontSize={13} sx={{ color: isDark ? "rgba(255,255,255,0.5)" : "rgba(0,0,0,0.5)" }}>Livraison</Typography>
                          <Typography fontSize={13} fontWeight={600} sx={{ color: "#10b981" }}>Gratuite</Typography>
                        </Stack>
                        <Divider sx={{ borderColor: "rgba(230,57,70,0.15)", my: 0.5 }} />
                        <Stack direction="row" justifyContent="space-between" alignItems="center">
                          <Typography fontSize={15} fontWeight={800}>Total</Typography>
                          <Typography fontSize={20} fontWeight={900} sx={{ color: "#E63946" }}>{totalPrice.toLocaleString("fr-DZ")} DA</Typography>
                        </Stack>
                      </Stack>
                    </Box>

                    {message.text && (
                      <Alert severity={message.type} sx={{ borderRadius: 2.5 }}>{message.text}</Alert>
                    )}

                    <Button variant="contained" fullWidth onClick={handlePurchase}
                      disabled={loading || !clientName || !phone || !selectedWilaya || !selectedCommune || stock === 0}
                      sx={{ bgcolor: "#E63946", borderRadius: 2.5, py: 1.6, fontWeight: 800, textTransform: "none", fontSize: 15, "&:hover": { bgcolor: "#c1121f" }, boxShadow: "0 8px 24px rgba(230,57,70,0.35)", "&:disabled": { bgcolor: "rgba(230,57,70,0.3)", color: "rgba(255,255,255,0.5)" } }}>
                      {loading ? "Envoi en cours..." : stock === 0 ? "Rupture de stock" : `Commander — ${totalPrice.toLocaleString("fr-DZ")} DA`}
                    </Button>
                  </Stack>
                </Paper>

              </Stack>
            </Grid>
          </Grid>
        </motion.div>
      </Box>

      <Snackbar open={showCartSuccess} autoHideDuration={3000} onClose={() => setShowCartSuccess(false)} anchorOrigin={{ vertical: "bottom", horizontal: "center" }}>
        <Alert onClose={() => setShowCartSuccess(false)} severity="success" sx={{ width: "100%" }}
          action={<Button color="inherit" size="small" onClick={() => navigate("/cart")}>Voir panier</Button>}>
          {quantity} article(s) ajoute(s) au panier
        </Alert>
      </Snackbar>
    </Box>
  );
}
