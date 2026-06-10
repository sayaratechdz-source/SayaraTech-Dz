// @ts-nocheck
import React, { useEffect, useState } from "react";
import {
  Box, Container, Typography, Stack, Chip, Divider,
  CircularProgress, Button, Collapse, IconButton, Tabs, Tab, Badge,
} from "@mui/material";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import HourglassEmptyIcon from "@mui/icons-material/HourglassEmpty";
import ChatIcon from "@mui/icons-material/Chat";
import ShoppingBagIcon from "@mui/icons-material/ShoppingBag";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import MessagingPanel, { getUnreadCount } from "./Messaging";

import { getPurchasesByPhone } from "../api/strapi";

const statusConfig = {
  pending:   { label: "En attente",  labelAr: "قيد الانتظار", color: "#f59e0b", bg: "#fffbeb", border: "#fde68a", icon: <HourglassEmptyIcon sx={{ fontSize: 14 }} /> },
  shipped:   { label: "Expédié",     labelAr: "تم الشحن",     color: "#3b82f6", bg: "#eff6ff", border: "#bfdbfe", icon: <LocalShippingIcon sx={{ fontSize: 14 }} /> },
  delivered: { label: "Livré",       labelAr: "تم التسليم",   color: "#10b981", bg: "#f0fdf4", border: "#bbf7d0", icon: <CheckCircleIcon sx={{ fontSize: 14 }} /> },
  cancelled: { label: "Annulé",      labelAr: "ملغى",         color: "#E63946", bg: "#fff5f5", border: "#fecaca", icon: null },
};

export default function MyOrders() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const userId = user.email || String(user.id || "acheteur");
  const userName = user.username || user.email || "Acheteur";

  const [tab, setTab] = useState(0);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(null);
  const [unread, setUnread] = useState(0);

  useEffect(() => {
    const phone = localStorage.getItem("lastOrderPhone");
    if (!phone) { setLoading(false); return; }
    getPurchasesByPhone(phone)
      .then(data => {
        // بيانات Strapi بالفعل بشكل { id, attributes }
        setOrders(data);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    const t = setInterval(() => setUnread(getUnreadCount(userId)), 2000);
    return () => clearInterval(t);
  }, [userId]);

  if (loading) return (
    <Box sx={{ py: 10, textAlign: "center", bgcolor: "#fff", minHeight: "100vh" }}>
      <CircularProgress sx={{ color: "#E63946" }} />
    </Box>
  );

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#f8f9fa", py: 5 }}>
      <Container maxWidth="md">

        {/* Header */}
        <Box sx={{ mb: 4, p: 3, borderRadius: 3, bgcolor: "#fff", border: "1px solid #f0f0f0", boxShadow: "0 2px 12px rgba(0,0,0,0.04)" }}>
          <Stack direction="row" alignItems="center" spacing={2}>
            <Box sx={{ width: 48, height: 48, borderRadius: 2, background: "linear-gradient(135deg, #E63946, #c1121f)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 4px 12px rgba(230,57,70,0.2)" }}>
              <ReceiptLongIcon sx={{ color: "#fff", fontSize: 24 }} />
            </Box>
            <Box>
              <Typography variant="h6" fontWeight={800} color="#1a1a1a">
                Mes Commandes
              </Typography>
              <Typography fontSize={12} color="#bbb">
                طلباتي — {orders.length} commande{orders.length !== 1 ? "s" : ""}
              </Typography>
            </Box>
            <Chip label={orders.length} size="small"
              sx={{ ml: "auto", bgcolor: "rgba(230,57,70,0.08)", color: "#E63946", fontWeight: 800, border: "1px solid rgba(230,57,70,0.2)" }} />
          </Stack>
        </Box>

        {/* Tabs */}
        <Box sx={{ bgcolor: "#fff", borderRadius: 3, border: "1px solid #f0f0f0", mb: 3, overflow: "hidden", boxShadow: "0 2px 8px rgba(0,0,0,0.03)" }}>
          <Tabs value={tab} onChange={(_, v) => setTab(v)}
            TabIndicatorProps={{ style: { backgroundColor: "#E63946", height: 3 } }}
            sx={{
              px: 2,
              "& .MuiTab-root": { color: "#bbb", textTransform: "none", fontWeight: 700, fontSize: 13, minHeight: 52 },
              "& .Mui-selected": { color: "#E63946" },
            }}>
            <Tab icon={<ReceiptLongIcon sx={{ fontSize: 17 }} />} iconPosition="start" label="Mes commandes" />
            <Tab icon={<Badge badgeContent={unread} color="error"><ChatIcon sx={{ fontSize: 17 }} /></Badge>} iconPosition="start" label="Messages" />
          </Tabs>
        </Box>

        {/* TAB 0 — Commandes */}
        {tab === 0 && (
          orders.length === 0 ? (
            <Box sx={{ textAlign: "center", py: 8, bgcolor: "#fff", borderRadius: 3, border: "1px solid #f0f0f0" }}>
              <Box sx={{ width: 80, height: 80, borderRadius: "50%", bgcolor: "#f8f9fa", border: "1px solid #f0f0f0", display: "flex", alignItems: "center", justifyContent: "center", mx: "auto", mb: 2 }}>
                <ShoppingBagIcon sx={{ fontSize: 36, color: "#e0e0e0" }} />
              </Box>
              <Typography variant="h6" color="#888" mb={1} fontWeight={700}>Aucune commande trouvée</Typography>
              <Typography color="#bbb" fontSize={13} mb={3}>
                لا توجد طلبات — Vos commandes apparaîtront ici après votre premier achat
              </Typography>
              <Button variant="contained" onClick={() => navigate("/products")}
                sx={{ bgcolor: "#E63946", borderRadius: "30px", px: 4, textTransform: "none", fontWeight: 700, boxShadow: "0 4px 16px rgba(230,57,70,0.25)", "&:hover": { bgcolor: "#c1121f" } }}>
                Commencer mes achats
              </Button>
            </Box>
          ) : (
            <Stack spacing={2}>
              {orders.map((order, i) => {
                const a = order.attributes;
                const status = statusConfig[a.status] || statusConfig.pending;
                const isOpen = expanded === order.id;
                return (
                  <motion.div key={order.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}>
                    <Box sx={{ borderRadius: 3, overflow: "hidden", bgcolor: "#fff", border: "1px solid #f0f0f0", boxShadow: "0 2px 8px rgba(0,0,0,0.03)", transition: "box-shadow 0.2s", "&:hover": { boxShadow: "0 4px 20px rgba(0,0,0,0.08)" } }}>
                      <Stack direction="row" alignItems="center" justifyContent="space-between"
                        sx={{ p: 2.5, cursor: "pointer" }}
                        onClick={() => setExpanded(isOpen ? null : order.id)}>
                        <Stack spacing={0.3}>
                          <Typography fontWeight={800} fontSize={14} color="#1a1a1a">
                            Commande #{order.id}
                          </Typography>
                          <Typography variant="caption" color="#bbb">
                            {new Date(a.createdAt).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })}
                          </Typography>
                        </Stack>
                        <Stack direction="row" alignItems="center" spacing={1.5}>
                          <Typography fontWeight={800} sx={{ color: "#E63946", fontSize: 15 }}>
                            {(a.totalPrice || 0).toFixed(2)} DA
                          </Typography>
                          <Chip label={status.label} size="small" icon={status.icon}
                            sx={{ bgcolor: status.bg, color: status.color, fontWeight: 700, fontSize: 11, border: "1px solid " + status.border }} />
                          <IconButton size="small" sx={{ color: "#ccc" }}>
                            {isOpen ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                          </IconButton>
                        </Stack>
                      </Stack>
                      <Collapse in={isOpen}>
                        <Divider sx={{ borderColor: "#f5f5f5" }} />
                        <Box sx={{ p: 2.5, bgcolor: "#fafafa" }}>
                          <Stack spacing={1}>
                            {[
                              ["Nom", a.name],
                              ["Téléphone", a.phone],
                              ["Wilaya", a.wilaya],
                              ["Commune", a.commune],
                              ["Quantité", a.quantity],
                              ["Prix unitaire", a.unitPrice ? (a.unitPrice.toFixed(2) + " DA") : null],
                            ].map(([label, value]) => value && (
                              <Stack key={label} direction="row" justifyContent="space-between" alignItems="center">
                                <Typography variant="caption" color="#bbb" fontWeight={600}>{label}</Typography>
                                <Typography variant="caption" fontWeight={700} color="#444">{value}</Typography>
                              </Stack>
                            ))}
                          </Stack>
                          {a.product?.data && (
                            <Button size="small" onClick={() => navigate("/product/" + a.product.data.id)}
                              sx={{ mt: 1.5, color: "#E63946", textTransform: "none", fontWeight: 700, p: 0, "&:hover": { textDecoration: "underline" } }}>
                              Voir le produit →
                            </Button>
                          )}
                        </Box>
                      </Collapse>
                    </Box>
                  </motion.div>
                );
              })}
            </Stack>
          )
        )}

        {/* TAB 1 — Messages */}
        {tab === 1 && (
          <Box>
            <Typography sx={{ color: "#999", fontSize: 13, mb: 3 }}>
              Contactez directement un vendeur pour poser vos questions sur un produit ou une commande.
            </Typography>
            <MessagingPanel currentUser={userId} currentUserName={userName} />
          </Box>
        )}

      </Container>
    </Box>
  );
}
