// @ts-nocheck
import React, { useEffect, useState } from "react";
import {
  Box, Typography, Grid, Paper, Stack, Button, TextField, Chip,
  Table, TableHead, TableRow, TableCell, TableBody, Avatar,
  Dialog, DialogTitle, DialogContent, DialogActions,
  IconButton, Alert, Snackbar, Divider, CircularProgress, Tabs, Tab, Badge,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import SaveIcon from "@mui/icons-material/Save";
import InventoryIcon from "@mui/icons-material/Inventory";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import StoreIcon from "@mui/icons-material/Store";
import LogoutIcon from "@mui/icons-material/Logout";
import DashboardIcon from "@mui/icons-material/Dashboard";
import ChatIcon from "@mui/icons-material/Chat";
import { useNavigate } from "react-router-dom";
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer, Cell } from "recharts";
import MessagingPanel, { getUnreadCount } from "./Messaging";

import { getProducts, addProduct, updateProduct, deleteProduct, getAllPurchases } from "../api/strapi";

const RED = "#E63946";
const PALETTE = [RED, "#3b82f6", "#10b981", "#f59e0b", "#8b5cf6"];
const MARQUES = ["PEUGEOT","RENAULT","VOLKSWAGEN","SEAT","SKODA","MERCEDES","AUDI","KIA","HYUNDAI","CHEVROLET","FIAT","CHERY","GEELY"];
const EMPTY_FORM = { productTitle: "", productPrice: "", stock: "", category: "PEUGEOT", discount: "", productDescription: "", image: null };

function StatCard({ icon, color, label, value, sub }) {
  return (
    <Paper elevation={0} sx={{ p: 2.5, borderRadius: 3, bgcolor: "#111", border: "1px solid rgba(255,255,255,0.07)" }}>
      <Stack direction="row" alignItems="center" justifyContent="space-between">
        <Box>
          <Typography sx={{ color: "rgba(255,255,255,0.4)", fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1.2, mb: 0.8 }}>{label}</Typography>
          <Typography sx={{ color: "#fff", fontSize: 26, fontWeight: 900, lineHeight: 1 }}>{value}</Typography>
          {sub && <Typography sx={{ color: "rgba(255,255,255,0.3)", fontSize: 11, mt: 0.5 }}>{sub}</Typography>}
        </Box>
        <Box sx={{ width: 44, height: 44, borderRadius: 2, display: "flex", alignItems: "center", justifyContent: "center" }}>
          {React.cloneElement(icon, { sx: { color, fontSize: 20 } })}
        </Box>
      </Stack>
    </Paper>
  );
}

export default function VendeurDashboard() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const token = localStorage.getItem("token");
  // نستخدم user.id الرقمي كـ vendeurId للتوافق مع Strapi
  const userId = String(user.id || "");
  const userEmail = user.email || "";
  const userName = user.username || user.email || "Vendeur";

  const [tab, setTab] = useState(0);
  const [products, setProducts] = useState([]);
  const [purchases, setPurchases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dialog, setDialog] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [snack, setSnack] = useState({ open: false, msg: "", sev: "success" });
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [unread, setUnread] = useState(0);

  const headers = { "Content-Type": "application/json", ...(token ? { Authorization: "Bearer " + token } : {}) };

  const fetchData = () => {
    setLoading(true);
    Promise.all([
      getProducts({ vendeurId: userId }),
      getAllPurchases(),
    ]).then(([prods, purch]) => {
      // بيانات Strapi بالفعل بشكل { id, attributes }
      setProducts(prods);
      setPurchases(purch);
    }).catch(() => {}).finally(() => setLoading(false));
  };

  useEffect(() => { fetchData(); }, []);
  useEffect(() => {
    const t = setInterval(() => setUnread(getUnreadCount(userEmail)), 2000);
    return () => clearInterval(t);
  }, [userEmail]);

  const openAdd = () => { setEditId(null); setForm(EMPTY_FORM); setDialog(true); };
  const openEdit = p => {
    const a = p.attributes;
    setEditId(p.id);
    setForm({ productTitle: a.productTitle || "", productPrice: a.productPrice || "", stock: a.stock || "", category: a.category || "", discount: a.discount || "", productDescription: a.productDescription || "" });
    setDialog(true);
  };

  const handleSave = async () => {
    if (!form.productTitle || !form.productPrice) { setSnack({ open: true, msg: "Titre et prix obligatoires", sev: "error" }); return; }
    setSaving(true);
    try {
      const productData = {
        productTitle: form.productTitle,
        productPrice: Number(form.productPrice),
        stock: Number(form.stock) || 0,
        category: form.category,
        discount: Math.abs(Number(form.discount) || 0),
        productDescription: form.productDescription || ".",
        productRating: 0,
        vendeurId: userId,   // user.id الرقمي
      };
      if (editId) {
        await updateProduct(editId, productData, form.image || null);
      } else {
        await addProduct(productData, form.image || null);
      }
      setSnack({ open: true, msg: editId ? "Produit modifié" : "Produit ajouté", sev: "success" });
      setDialog(false);
      fetchData();
    } catch { setSnack({ open: true, msg: "Erreur lors de la sauvegarde", sev: "error" }); }
    finally { setSaving(false); }
  };

  const handleDelete = async id => {
    try {
      await deleteProduct(id);
      setProducts(prev => prev.filter(p => p.id !== id));
      setSnack({ open: true, msg: "Produit supprimé", sev: "info" });
    } catch { setSnack({ open: true, msg: "Erreur lors de la suppression", sev: "error" }); }
    setDeleteConfirm(null);
  };

  const handleLogout = () => { localStorage.removeItem("token"); localStorage.removeItem("user"); navigate("/login"); };

  if (loading) return (
    <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh", bgcolor: "#0a0a0a" }}>
      <CircularProgress sx={{ color: RED }} />
    </Box>
  );

  const totalRevenue = purchases.reduce((s, p) => s + Number(p.attributes?.totalPrice || 0), 0);
  const lowStock = products.filter(p => (p.attributes?.stock || 0) < 5).length;
  const salesData = products.map(p => ({
    name: (p.attributes?.productTitle || "?").slice(0, 14),
    sold: purchases.filter(pu => pu.attributes?.product?.data?.id === p.id).reduce((s, pu) => s + (pu.attributes?.quantity || 0), 0),
  })).sort((a, b) => b.sold - a.sold).slice(0, 6);
  const latestOrders = [...purchases].sort((a, b) => new Date(b.attributes?.createdAt) - new Date(a.attributes?.createdAt)).slice(0, 5);

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#0a0a0a" }}>

      {/* Navbar */}
      <Box sx={{ bgcolor: "#111", borderBottom: "1px solid rgba(255,255,255,0.07)", px: 4, py: 2 }}>
        <Stack direction="row" alignItems="center" justifyContent="space-between">
          <Stack direction="row" alignItems="center" spacing={2}>
            <Box sx={{ width: 36, height: 36, borderRadius: 2, bgcolor: RED, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <StoreIcon sx={{ color: "#fff", fontSize: 20 }} />
            </Box>
            <Box>
              <Typography sx={{ color: "#fff", fontWeight: 800, fontSize: 15 }}>Espace Vendeur</Typography>
              <Typography sx={{ color: "rgba(255,255,255,0.4)", fontSize: 12 }}>{userName}</Typography>
            </Box>
          </Stack>
          <Stack direction="row" spacing={1.5}>
            <Button variant="outlined" size="small" onClick={() => navigate("/")}
              sx={{ borderRadius: 2, textTransform: "none", borderColor: "rgba(255,255,255,0.15)", color: "rgba(255,255,255,0.6)", "&:hover": { borderColor: RED, color: RED } }}>
              Voir le site
            </Button>
            <Button variant="outlined" size="small" startIcon={<LogoutIcon sx={{ fontSize: 16 }} />} onClick={handleLogout}
              sx={{ borderRadius: 2, textTransform: "none", borderColor: "rgba(239,68,68,0.3)", color: "#ef4444", "&:hover": { bgcolor: "rgba(239,68,68,0.1)" } }}>
              Deconnexion
            </Button>
          </Stack>
        </Stack>
      </Box>

      {/* Tabs */}
      <Box sx={{ bgcolor: "#111", borderBottom: "1px solid rgba(255,255,255,0.07)", px: 4 }}>
        <Tabs value={tab} onChange={(_, v) => setTab(v)}
          TabIndicatorProps={{ style: { backgroundColor: RED } }}
          sx={{ "& .MuiTab-root": { color: "rgba(255,255,255,0.4)", textTransform: "none", fontWeight: 700, fontSize: 13, minHeight: 48 }, "& .Mui-selected": { color: "#fff" } }}>
          <Tab icon={<DashboardIcon sx={{ fontSize: 18 }} />} iconPosition="start" label="Tableau de bord" />
          <Tab icon={<InventoryIcon sx={{ fontSize: 18 }} />} iconPosition="start" label="Mes produits" />
          <Tab icon={<Badge badgeContent={unread} color="error"><ChatIcon sx={{ fontSize: 18 }} /></Badge>} iconPosition="start" label="Messages" />
        </Tabs>
      </Box>

      <Box sx={{ p: 4 }}>

        {/* TAB 0 - Tableau de bord */}
        {tab === 0 && (
          <Box>
            <Grid container spacing={2} mb={4}>
              <Grid item xs={12} sm={6} md={3}><StatCard icon={<InventoryIcon />}    color={RED}     label="Mes produits"  value={products.length}  sub="en ligne" /></Grid>
              <Grid item xs={12} sm={6} md={3}><StatCard icon={<ShoppingCartIcon />} color="#3b82f6" label="Commandes"     value={purchases.length} sub="recues" /></Grid>
              <Grid item xs={12} sm={6} md={3}><StatCard icon={<AttachMoneyIcon />}  color="#10b981" label="Revenus"       value={totalRevenue.toLocaleString() + " DA"} sub="total" /></Grid>
              <Grid item xs={12} sm={6} md={3}><StatCard icon={<WarningAmberIcon />} color="#f59e0b" label="Stock faible"  value={lowStock}         sub="produits < 5" /></Grid>
            </Grid>
            <Grid container spacing={3}>
              <Grid item xs={12} md={5}>
                <Paper elevation={0} sx={{ p: 3, bgcolor: "#111", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 3 }}>
                  <Typography sx={{ color: "#fff", fontWeight: 800, fontSize: 14, mb: 2.5 }}>Ventes par produit</Typography>
                  {salesData.length === 0
                    ? <Box sx={{ height: 180, display: "flex", alignItems: "center", justifyContent: "center" }}><Typography sx={{ color: "rgba(255,255,255,0.2)", fontSize: 13 }}>Aucune vente</Typography></Box>
                    : <ResponsiveContainer width="100%" height={180}>
                        <BarChart data={salesData} margin={{ top: 0, right: 10, bottom: 0, left: -10 }}>
                          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                          <XAxis dataKey="name" tick={{ fill: "rgba(255,255,255,0.35)", fontSize: 10 }} axisLine={false} tickLine={false} />
                          <YAxis tick={{ fill: "rgba(255,255,255,0.35)", fontSize: 10 }} axisLine={false} tickLine={false} />
                          <Tooltip contentStyle={{ background: "#1a1a1a", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, color: "#fff", fontSize: 12 }} />
                          <Bar dataKey="sold" name="Vendus" radius={[6, 6, 0, 0]}>
                            {salesData.map((_, i) => <Cell key={i} fill={PALETTE[i % PALETTE.length]} />)}
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                  }
                </Paper>
              </Grid>
              <Grid item xs={12} md={7}>
                <Paper elevation={0} sx={{ bgcolor: "#111", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 3, overflow: "hidden" }}>
                  <Box sx={{ px: 3, py: 2 }}><Typography sx={{ color: "#fff", fontWeight: 800, fontSize: 14 }}>Dernieres commandes</Typography></Box>
                  <Divider sx={{ borderColor: "rgba(255,255,255,0.06)" }} />
                  <Table size="small">
                    <TableHead>
                      <TableRow sx={{ bgcolor: "#0d0d0d" }}>
                        {["Produit", "Qte", "Total", "Wilaya", "Date"].map(h => (
                          <TableCell key={h} sx={{ color: "rgba(255,255,255,0.3)", fontWeight: 700, fontSize: 10, letterSpacing: 1, textTransform: "uppercase", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>{h}</TableCell>
                        ))}
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {latestOrders.length === 0 && <TableRow><TableCell colSpan={5} sx={{ textAlign: "center", py: 4, color: "rgba(255,255,255,0.2)", borderBottom: "none" }}>Aucune commande</TableCell></TableRow>}
                      {latestOrders.map(p => (
                        <TableRow key={p.id} sx={{ "&:hover": { bgcolor: "rgba(255,255,255,0.02)" } }}>
                          <TableCell sx={{ borderBottom: "none", color: "#fff", fontSize: 12, fontWeight: 600 }}>{p.attributes?.product?.data?.attributes?.productTitle || "inconnu"}</TableCell>
                          <TableCell sx={{ borderBottom: "none", color: "rgba(255,255,255,0.5)", fontSize: 12 }}>{p.attributes?.quantity}</TableCell>
                          <TableCell sx={{ borderBottom: "none", color: "#10b981", fontWeight: 700, fontSize: 12 }}>{Number(p.attributes?.totalPrice || 0).toLocaleString()} DA</TableCell>
                          <TableCell sx={{ borderBottom: "none", color: "rgba(255,255,255,0.4)", fontSize: 12 }}>{p.attributes?.wilaya || "—"}</TableCell>
                          <TableCell sx={{ borderBottom: "none", color: "rgba(255,255,255,0.3)", fontSize: 11 }}>{new Date(p.attributes?.createdAt).toLocaleDateString("fr-DZ")}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </Paper>
              </Grid>
            </Grid>
          </Box>
        )}

        {/* TAB 1 - Mes produits */}
        {tab === 1 && (
          <Paper elevation={0} sx={{ bgcolor: "#111", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 3, overflow: "hidden" }}>
            <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ px: 3, py: 2 }}>
              <Typography sx={{ color: "#fff", fontWeight: 800, fontSize: 14 }}>Mes produits ({products.length})</Typography>
              <Button variant="contained" size="small" startIcon={<AddIcon />} onClick={openAdd}
                sx={{ bgcolor: RED, borderRadius: 2, textTransform: "none", fontWeight: 700, "&:hover": { bgcolor: "#c1121f" } }}>
                Ajouter un produit
              </Button>
            </Stack>
            <Divider sx={{ borderColor: "rgba(255,255,255,0.06)" }} />
            <Table>
              <TableHead>
                <TableRow sx={{ bgcolor: "#0d0d0d" }}>
                  {["Produit", "Prix", "Stock", "Remise", "Statut", "Actions"].map(h => (
                    <TableCell key={h} sx={{ color: "rgba(255,255,255,0.3)", fontWeight: 700, fontSize: 10, letterSpacing: 1, textTransform: "uppercase", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>{h}</TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {products.length === 0 && <TableRow><TableCell colSpan={6} sx={{ textAlign: "center", py: 6, color: "rgba(255,255,255,0.2)", borderBottom: "none" }}>Aucun produit — cliquez sur "Ajouter un produit" pour commencer</TableCell></TableRow>}
                {products.map(p => {
                  const a = p.attributes;
                  const stock = a.stock || 0;
                  const imgUrl = a.productimg?.data?.[0]?.attributes?.url;
                  return (
                    <TableRow key={p.id} sx={{ "&:hover": { bgcolor: "rgba(255,255,255,0.02)" }, borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                      <TableCell sx={{ borderBottom: "none" }}>
                        <Stack direction="row" alignItems="center" spacing={1.5}>
                          <Avatar src={imgUrl || undefined} variant="rounded" sx={{ width: 36, height: 36, bgcolor: "#222" }}>
                            <InventoryIcon sx={{ fontSize: 16, color: "#555" }} />
                          </Avatar>
                          <Typography fontSize={13} fontWeight={600} color="#fff">{a.productTitle}</Typography>
                        </Stack>
                      </TableCell>
                      <TableCell sx={{ borderBottom: "none", color: "#fff", fontWeight: 700, fontSize: 13 }}>{a.productPrice} DA</TableCell>
                      <TableCell sx={{ borderBottom: "none" }}>
                        <Typography fontSize={13} fontWeight={700} color={stock <= 5 ? "#f59e0b" : "#fff"}>{stock}</Typography>
                      </TableCell>
                      <TableCell sx={{ borderBottom: "none" }}>
                        {a.discount > 0 ? <Chip label={"-" + a.discount + "%"} size="small" sx={{ bgcolor: "rgba(230,57,70,0.15)", color: RED, fontWeight: 800, fontSize: 11 }} /> : <Typography fontSize={12} color="rgba(255,255,255,0.3)">—</Typography>}
                      </TableCell>
                      <TableCell sx={{ borderBottom: "none" }}>
                        <Chip label={stock > 0 ? "En stock" : "Rupture"} size="small"
                          sx={{ bgcolor: stock > 0 ? "rgba(16,185,129,0.1)" : "rgba(239,68,68,0.1)", color: stock > 0 ? "#10b981" : "#ef4444", fontWeight: 700, fontSize: 11 }} />
                      </TableCell>
                      <TableCell sx={{ borderBottom: "none" }}>
                        <Stack direction="row" spacing={0.5}>
                          <IconButton size="small" onClick={() => openEdit(p)} sx={{ color: "rgba(255,255,255,0.4)", "&:hover": { color: "#3b82f6" } }}><EditIcon sx={{ fontSize: 16 }} /></IconButton>
                          <IconButton size="small" onClick={() => setDeleteConfirm(p.id)} sx={{ color: "rgba(255,255,255,0.4)", "&:hover": { color: "#ef4444" } }}><DeleteIcon sx={{ fontSize: 16 }} /></IconButton>
                        </Stack>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </Paper>
        )}

        {/* TAB 2 - Messages */}
        {tab === 2 && (
          <Box>
            <Typography sx={{ color: "#fff", fontWeight: 800, fontSize: 16, mb: 3 }}>Messages avec les acheteurs</Typography>
            <MessagingPanel currentUser={userEmail} currentUserName={userName} />
          </Box>
        )}

      </Box>

      {/* Dialog ajouter/modifier */}
      <Dialog open={dialog} onClose={() => setDialog(false)} maxWidth="sm" fullWidth
        PaperProps={{ sx: { bgcolor: "#111", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 3 } }}>
        <DialogTitle sx={{ color: "#fff", fontWeight: 800 }}>{editId ? "Modifier le produit" : "Ajouter un produit"}</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 0.5 }}>
            {[
              { key: "productTitle", label: "Titre *", xs: 12 },
              { key: "productPrice", label: "Prix (DA) *", xs: 6, type: "number" },
              { key: "stock", label: "Stock", xs: 6, type: "number" },
              { key: "discount", label: "Remise (%)", xs: 6, type: "number" },
              { key: "productDescription", label: "Description", xs: 12, multiline: true },
            ].map(f => (
              <Grid item xs={f.xs} key={f.key}>
                <TextField fullWidth label={f.label} type={f.type || "text"} value={form[f.key]}
                  onChange={e => setForm({ ...form, [f.key]: e.target.value })}
                  multiline={f.multiline} rows={f.multiline ? 3 : 1}
                  sx={{ "& .MuiOutlinedInput-root": { color: "#fff", "& fieldset": { borderColor: "rgba(255,255,255,0.15)" }, "&:hover fieldset": { borderColor: RED } }, "& .MuiInputLabel-root": { color: "rgba(255,255,255,0.5)" } }} />
              </Grid>
            ))}
            <Grid item xs={6}>
              <TextField select fullWidth label="Marque *" value={form.category}
                onChange={e => setForm({ ...form, category: e.target.value })}
                SelectProps={{ native: true }}
                sx={{ "& .MuiOutlinedInput-root": { color: "#fff", "& fieldset": { borderColor: "rgba(255,255,255,0.15)" }, "&:hover fieldset": { borderColor: RED } }, "& .MuiInputLabel-root": { color: "rgba(255,255,255,0.5)" } }}>
                {MARQUES.map(m => <option key={m} value={m} style={{ background: "#111" }}>{m}</option>)}
              </TextField>
            </Grid>
            <Grid item xs={12}>
              <Box sx={{ p: 2, borderRadius: 2, border: "1px dashed rgba(255,255,255,0.2)", textAlign: "center", cursor: "pointer", "&:hover": { borderColor: RED } }}
                onClick={() => document.getElementById("img-upload-vendeur").click()}>
                <input id="img-upload-vendeur" type="file" accept="image/*" hidden onChange={e => setForm({ ...form, image: e.target.files[0] })} />
                {form.image
                  ? <Typography fontSize={12} color="#10b981">✓ {form.image.name}</Typography>
                  : <Typography fontSize={12} color="rgba(255,255,255,0.3)">📷 Cliquez pour ajouter une image</Typography>
                }
              </Box>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ p: 2.5 }}>
          <Button onClick={() => setDialog(false)} sx={{ color: "rgba(255,255,255,0.5)", textTransform: "none" }}>Annuler</Button>
          <Button variant="contained" onClick={handleSave} disabled={saving} startIcon={<SaveIcon />}
            sx={{ bgcolor: RED, borderRadius: 2, textTransform: "none", fontWeight: 700, "&:hover": { bgcolor: "#c1121f" } }}>
            {saving ? "Sauvegarde..." : "Sauvegarder"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Confirm delete */}
      <Dialog open={!!deleteConfirm} onClose={() => setDeleteConfirm(null)}
        PaperProps={{ sx: { bgcolor: "#111", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 3 } }}>
        <DialogTitle sx={{ color: "#fff", fontWeight: 800 }}>Confirmer la suppression</DialogTitle>
        <DialogContent><Typography color="rgba(255,255,255,0.6)">Cette action est irreversible.</Typography></DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setDeleteConfirm(null)} sx={{ color: "rgba(255,255,255,0.5)", textTransform: "none" }}>Annuler</Button>
          <Button variant="contained" onClick={() => handleDelete(deleteConfirm)}
            sx={{ bgcolor: "#ef4444", borderRadius: 2, textTransform: "none", fontWeight: 700, "&:hover": { bgcolor: "#dc2626" } }}>
            Supprimer
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar open={snack.open} autoHideDuration={3000} onClose={() => setSnack({ ...snack, open: false })} anchorOrigin={{ vertical: "bottom", horizontal: "center" }}>
        <Alert severity={snack.sev} sx={{ borderRadius: 2 }}>{snack.msg}</Alert>
      </Snackbar>

    </Box>
  );
}
