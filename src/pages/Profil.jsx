// @ts-nocheck
import React, { useState, useEffect } from "react";
import {
  Box, Container, Typography, Stack, Paper, TextField, Button,
  Avatar, Chip, Divider, Alert, Snackbar, Grid, useTheme, IconButton,
} from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";
import LockIcon from "@mui/icons-material/Lock";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import FavoriteIcon from "@mui/icons-material/Favorite";
import ReceiptIcon from "@mui/icons-material/Receipt";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

import { getPurchasesByPhone } from "../firebase/purchases";
import { updateUserProfile } from "../firebase/user";
import { auth } from "../firebase/auth";
import { updateProfile } from "firebase/auth";

const API = "firebase";

export default function Profil() {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const navigate = useNavigate();

  const [user, setUser]       = useState(null);
  const [editing, setEditing] = useState(false);
  const [form, setForm]       = useState({ username: "", email: "", phone: "" });
  const [pwForm, setPwForm]   = useState({ current: "", newPw: "", confirm: "" });
  const [snack, setSnack]     = useState({ open: false, msg: "", sev: "success" });
  const [saving, setSaving]   = useState(false);
  const [orders, setOrders]   = useState([]);

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (!stored) { navigate("/login"); return; }
    const u = JSON.parse(stored);
    setUser(u);
    setForm({ username: u.username || "", email: u.email || "", phone: u.phone || "" });

    // Charger commandes
    const phone = localStorage.getItem("lastOrderPhone");
    if (phone) {
      getPurchasesByPhone(phone)
        .then(data => {
          const mapped = data.slice(0, 5).map(p => ({
            id: p.id,
            attributes: {
              totalPrice: p.totalPrice,
              status: p.status,
              createdAt: p.createdAt?.toDate?.()?.toISOString() || new Date().toISOString(),
              product: { data: p.productId ? { attributes: { productTitle: p.productTitle } } : null },
            },
          }));
          setOrders(mapped);
        })
        .catch(() => {});
    }
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      await updateUserProfile(user.uid, { username: form.username });
      const updated = { ...user, username: form.username };
      localStorage.setItem("user", JSON.stringify(updated));
      setUser(updated);
      setEditing(false);
      setSnack({ open: true, msg: "Profil mis à jour", sev: "success" });
    } catch {
      setSnack({ open: true, msg: "Erreur lors de la mise à jour", sev: "error" });
    } finally { setSaving(false); }
  };

  const isVendeur = user?.role === "vendeur";
  const initials  = (user?.username || user?.email || "U")[0].toUpperCase();

  const inputSx = {
    "& .MuiOutlinedInput-root": {
      borderRadius: "12px",
      bgcolor: isDark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.03)",
      "&:hover fieldset": { borderColor: "#E63946" },
      "&.Mui-focused fieldset": { borderColor: "#E63946" },
    },
  };

  const STATUS_COLORS = {
    pending:   { color: "#f59e0b", label: "En attente" },
    confirmed: { color: "#3b82f6", label: "Confirmee" },
    shipped:   { color: "#8b5cf6", label: "Expediee" },
    delivered: { color: "#10b981", label: "Livree" },
    cancelled: { color: "#ef4444", label: "Annulee" },
  };

  if (!user) return null;

  return (
    <Box sx={{ minHeight: "80vh", bgcolor: isDark ? "#0a0a0a" : "#f8f9fb", py: 5 }}>
      <Container maxWidth="md">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>

          {/* Header profil */}
          <Paper elevation={0} sx={{ p: 4, borderRadius: 4, mb: 3, bgcolor: isDark ? "#111" : "#fff", border: `1px solid ${isDark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.06)"}` }}>
            <Stack direction={{ xs: "column", sm: "row" }} alignItems={{ xs: "center", sm: "flex-start" }} spacing={3}>
              <Avatar sx={{ width: 80, height: 80, bgcolor: isVendeur ? "#8b5cf6" : "#E63946", fontSize: 32, fontWeight: 900 }}>
                {initials}
              </Avatar>
              <Box sx={{ flex: 1 }}>
                <Stack direction="row" alignItems="center" spacing={1.5} mb={0.5}>
                  <Typography variant="h5" fontWeight={800}>{user.username || "Utilisateur"}</Typography>
                  <Chip label={isVendeur ? "Vendeur" : "Acheteur"} size="small"
                    sx={{ bgcolor: isVendeur ? "rgba(139,92,246,0.15)" : "rgba(230,57,70,0.12)", color: isVendeur ? "#8b5cf6" : "#E63946", fontWeight: 700, fontSize: 11 }} />
                </Stack>
                <Typography color="text.secondary" fontSize={13}>{user.email}</Typography>
                <Typography color="text.secondary" fontSize={12} mt={0.3}>
                  Membre depuis {new Date(user.createdAt || Date.now()).toLocaleDateString("fr-DZ", { month: "long", year: "numeric" })}
                </Typography>
              </Box>
              <Button variant="outlined" startIcon={editing ? <SaveIcon /> : <EditIcon />}
                onClick={editing ? handleSave : () => setEditing(true)} disabled={saving}
                sx={{ borderRadius: 2.5, textTransform: "none", fontWeight: 700, borderColor: "#E63946", color: "#E63946", "&:hover": { bgcolor: "rgba(230,57,70,0.06)" } }}>
                {editing ? (saving ? "Sauvegarde..." : "Sauvegarder") : "Modifier"}
              </Button>
            </Stack>
          </Paper>

          <Grid container spacing={3}>
            {/* Infos personnelles */}
            <Grid item xs={12} md={7}>
              <Paper elevation={0} sx={{ p: 3, borderRadius: 4, bgcolor: isDark ? "#111" : "#fff", border: `1px solid ${isDark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.06)"}` }}>
                <Typography fontWeight={800} fontSize={15} mb={2.5}>Informations personnelles</Typography>
                <Stack spacing={2}>
                  <TextField label="Nom d utilisateur" fullWidth value={form.username}
                    onChange={e => setForm({ ...form, username: e.target.value })}
                    disabled={!editing} sx={inputSx}
                    InputProps={{ startAdornment: <Box sx={{ mr: 1, color: "text.secondary" }}><PersonIcon sx={{ fontSize: 18 }} /></Box> }} />
                  <TextField label="Email" fullWidth value={form.email} disabled sx={inputSx}
                    InputProps={{ startAdornment: <Box sx={{ mr: 1, color: "text.secondary" }}><EmailIcon sx={{ fontSize: 18 }} /></Box> }}
                    helperText="L email ne peut pas etre modifie" />
                  <TextField label="Telephone" fullWidth value={form.phone}
                    onChange={e => setForm({ ...form, phone: e.target.value })}
                    disabled={!editing} placeholder="0555 123 456" sx={inputSx}
                    InputProps={{ startAdornment: <Box sx={{ mr: 1, color: "text.secondary" }}><PhoneIcon sx={{ fontSize: 18 }} /></Box> }} />
                </Stack>
              </Paper>
            </Grid>

            {/* Stats rapides */}
            <Grid item xs={12} md={5}>
              <Stack spacing={2}>
                {[
                  { label: "Mes commandes", value: orders.length, icon: <ReceiptIcon />, color: "#E63946", to: "/orders" },
                  { label: "Mes favoris",   value: "Voir",         icon: <FavoriteIcon />, color: "#ec4899", to: "/wishlist" },
                  { label: "Mon panier",    value: "Voir",         icon: <ShoppingCartIcon />, color: "#3b82f6", to: "/cart" },
                  ...(isVendeur ? [{ label: "Espace vendeur", value: "Acceder", icon: <PersonIcon />, color: "#8b5cf6", to: "/vendeur" }] : []),
                ].map(item => (
                  <Paper key={item.label} elevation={0} onClick={() => navigate(item.to)}
                    sx={{ p: 2.5, borderRadius: 3, cursor: "pointer", bgcolor: isDark ? "#111" : "#fff", border: `1px solid ${isDark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.06)"}`, transition: "all 0.2s", "&:hover": { borderColor: item.color, transform: "translateX(4px)" } }}>
                    <Stack direction="row" alignItems="center" spacing={2}>
                      <Box sx={{ width: 40, height: 40, borderRadius: 2, bgcolor: `${item.color}18`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                        {React.cloneElement(item.icon, { sx: { color: item.color, fontSize: 20 } })}
                      </Box>
                      <Box sx={{ flex: 1 }}>
                        <Typography fontSize={13} fontWeight={700}>{item.label}</Typography>
                      </Box>
                      <Typography fontSize={13} fontWeight={800} sx={{ color: item.color }}>{item.value}</Typography>
                    </Stack>
                  </Paper>
                ))}
              </Stack>
            </Grid>

            {/* Dernières commandes */}
            {orders.length > 0 && (
              <Grid item xs={12}>
                <Paper elevation={0} sx={{ p: 3, borderRadius: 4, bgcolor: isDark ? "#111" : "#fff", border: `1px solid ${isDark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.06)"}` }}>
                  <Stack direction="row" alignItems="center" justifyContent="space-between" mb={2}>
                    <Typography fontWeight={800} fontSize={15}>Dernieres commandes</Typography>
                    <Button size="small" onClick={() => navigate("/orders")} sx={{ color: "#E63946", textTransform: "none", fontWeight: 700 }}>Voir tout</Button>
                  </Stack>
                  <Stack spacing={1.5}>
                    {orders.slice(0, 3).map(o => {
                      const a = o.attributes;
                      const sc = STATUS_COLORS[a.status] || STATUS_COLORS.pending;
                      return (
                        <Stack key={o.id} direction="row" alignItems="center" justifyContent="space-between"
                          sx={{ p: 1.5, borderRadius: 2, bgcolor: isDark ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.02)" }}>
                          <Box>
                            <Typography fontSize={13} fontWeight={600}>{a.product?.data?.attributes?.productTitle || "Produit"}</Typography>
                            <Typography fontSize={11} color="text.secondary">{new Date(a.createdAt).toLocaleDateString("fr-DZ")}</Typography>
                          </Box>
                          <Stack direction="row" alignItems="center" spacing={1.5}>
                            <Typography fontSize={13} fontWeight={700} sx={{ color: "#E63946" }}>{Number(a.totalPrice || 0).toLocaleString()} DA</Typography>
                            <Chip label={sc.label} size="small" sx={{ bgcolor: `${sc.color}18`, color: sc.color, fontWeight: 700, fontSize: 10, height: 20 }} />
                          </Stack>
                        </Stack>
                      );
                    })}
                  </Stack>
                </Paper>
              </Grid>
            )}
          </Grid>
        </motion.div>
      </Container>

      <Snackbar open={snack.open} autoHideDuration={3000} onClose={() => setSnack({ ...snack, open: false })} anchorOrigin={{ vertical: "bottom", horizontal: "center" }}>
        <Alert severity={snack.sev} sx={{ borderRadius: 2 }}>{snack.msg}</Alert>
      </Snackbar>
    </Box>
  );
}
