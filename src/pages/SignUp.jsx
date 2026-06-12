// @ts-nocheck
import React, { useState } from "react";
import {
  Box, Button, TextField, Typography, Stack,
  InputAdornment, IconButton, Alert, Chip, AnimatePresence,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import VisibilityOffOutlinedIcon from "@mui/icons-material/VisibilityOffOutlined";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
import StorefrontIcon from "@mui/icons-material/Storefront";
import ShoppingBagIcon from "@mui/icons-material/ShoppingBag";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { motion } from "framer-motion";
import { strapiRegister } from "../api/strapi";

const inputSx = {
  "& .MuiOutlinedInput-root": {
    borderRadius: "12px",
    bgcolor: "#f8f9fa",
    "& fieldset": { borderColor: "#e0e0e0" },
    "&:hover fieldset": { borderColor: "#E63946" },
    "&.Mui-focused fieldset": { borderColor: "#E63946", boxShadow: "0 0 0 3px rgba(230,57,70,0.08)" },
  },
  "& .MuiInputLabel-root": { color: "#999" },
  "& .MuiInputLabel-root.Mui-focused": { color: "#E63946" },
  "& input": { color: "#1a1a1a" },
};

const ACCOUNT_TYPES = [
  {
    type: "acheteur",
    icon: <ShoppingBagIcon sx={{ fontSize: 22 }} />,
    title: "Acheteur",
    titleAr: "مشتري",
    desc: "Achetez des pièces auto",
    color: "#3b82f6",
    perks: ["Accès à +500 références", "Suivi de commandes", "Messagerie vendeurs"],
  },
  {
    type: "vendeur",
    icon: <StorefrontIcon sx={{ fontSize: 22 }} />,
    title: "Vendeur",
    titleAr: "بائع",
    desc: "Vendez vos produits",
    color: "#E63946",
    perks: ["Tableau de bord complet", "Gestion des stocks", "Messagerie acheteurs"],
  },
];

export default function SignUp() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    firstName: "", lastName: "", email: "",
    password: "", confirmPassword: "",
    accountType: "acheteur",
  });
  const [showPass, setShowPass]       = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError]             = useState("");
  const [loading, setLoading]         = useState(false);

  const set = (field) => (e) => setForm({ ...form, [field]: e.target.value });
  const isVendeur = form.accountType === "vendeur";

  const handleSignUp = async () => {
    setError("");
    if (!form.firstName || !form.email || !form.password) {
      setError("Veuillez remplir les champs obligatoires."); return;
    }
    if (form.password !== form.confirmPassword) {
      setError("Les mots de passe ne correspondent pas."); return;
    }
    if (form.password.length < 6) {
      setError("Le mot de passe doit contenir au moins 6 caractères."); return;
    }
    setLoading(true);
    try {
      const username = (form.firstName + " " + form.lastName).trim();
      const vendeurStatus = isVendeur ? "vendeur" : "acheteur";
      const { jwt, user } = await strapiRegister(username, form.email, form.password, vendeurStatus);

      const userData = {
        id: user.id,
        email: user.email,
        username: user.username,
        role: user.vendeurStatus === "vendeur" ? "vendeur" : "acheteur",
        vendeurStatus: user.vendeurStatus || vendeurStatus,
      };
      localStorage.setItem("token", jwt);
      localStorage.setItem("user", JSON.stringify(userData));
      navigate(userData.role === "vendeur" ? "/vendeur" : "/");
    } catch (err) {
      const msg = err.message?.includes("already taken")
        ? "Cet email est déjà utilisé."
        : "Erreur de connexion au serveur.";
      setError(msg);
    } finally { setLoading(false); }
  };

  return (
    <Box sx={{ minHeight: "100vh", display: "flex", bgcolor: "#fff" }}>

      {/* Panneau gauche */}
      <Box sx={{
        width: { xs: 0, lg: 420 },
        display: { xs: "none", lg: "flex" },
        flexDirection: "column", alignItems: "center", justifyContent: "center",
        background: "linear-gradient(160deg, #fff5f5 0%, #fff 50%, #f0f4ff 100%)",
        borderRight: "1px solid #f0f0f0",
        position: "relative", overflow: "hidden", p: 5,
      }}>
        {[120, 240, 360, 480].map((s, i) => (
          <Box key={i} sx={{ position: "absolute", width: s, height: s, borderRadius: "50%",
            border: "1px solid rgba(230,57,70,0.06)", top: "50%", left: "50%", transform: "translate(-50%,-50%)" }} />
        ))}
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}
          style={{ position: "relative", zIndex: 1, width: "100%" }}>
          <Stack alignItems="center" spacing={4}>
            <Stack alignItems="center" spacing={2}>
              <Box sx={{ width: 76, height: 76, borderRadius: "50%",
                background: "linear-gradient(135deg, #E63946, #c1121f)",
                display: "flex", alignItems: "center", justifyContent: "center",
                boxShadow: "0 8px 32px rgba(230,57,70,0.25)" }}>
                <DirectionsCarIcon sx={{ fontSize: 38, color: "#fff" }} />
              </Box>
              <Box textAlign="center">
                <Typography sx={{ fontSize: 28, fontWeight: 900, color: "#1a1a1a", letterSpacing: 4, lineHeight: 1 }}>
                  SAYARA<Box component="span" sx={{ color: "#E63946" }}>TECH</Box>
                </Typography>
                <Typography sx={{ color: "#bbb", fontSize: 11, letterSpacing: 3, mt: 0.5 }}>VOTRE GARAGE EN LIGNE</Typography>
              </Box>
            </Stack>

            <Box sx={{ width: "100%" }}>
              <Typography sx={{ color: "#ccc", fontSize: 11, letterSpacing: 2, mb: 2, textAlign: "center" }}>CHOISISSEZ VOTRE PROFIL</Typography>
              <Stack spacing={1.5}>
                {ACCOUNT_TYPES.map(item => {
                  const active = form.accountType === item.type;
                  return (
                    <Box key={item.type} onClick={() => setForm({ ...form, accountType: item.type })}
                      sx={{
                        p: 2.5, borderRadius: 3, cursor: "pointer", transition: "all 0.3s",
                        border: active ? `1.5px solid ${item.color}50` : "1.5px solid #f0f0f0",
                        bgcolor: active ? `${item.color}08` : "#fafafa",
                        boxShadow: active ? `0 4px 16px ${item.color}15` : "none",
                        "&:hover": { border: `1.5px solid ${item.color}35`, bgcolor: `${item.color}05` },
                      }}>
                      <Stack direction="row" alignItems="center" spacing={2}>
                        <Box sx={{ width: 44, height: 44, borderRadius: 2,
                          bgcolor: active ? `${item.color}15` : "#f5f5f5",
                          border: active ? `1px solid ${item.color}30` : "1px solid #eee",
                          display: "flex", alignItems: "center", justifyContent: "center",
                          color: active ? item.color : "#ccc", transition: "all 0.3s" }}>
                          {item.icon}
                        </Box>
                        <Box flex={1}>
                          <Stack direction="row" alignItems="center" spacing={1}>
                            <Typography sx={{ color: active ? "#1a1a1a" : "#999", fontWeight: 800, fontSize: 14 }}>{item.title}</Typography>
                            <Typography sx={{ color: "#ddd", fontSize: 11 }}>{item.titleAr}</Typography>
                          </Stack>
                          <Typography sx={{ color: "#bbb", fontSize: 12, mt: 0.3 }}>{item.desc}</Typography>
                        </Box>
                        <Box sx={{ width: 20, height: 20, borderRadius: "50%",
                          border: active ? `2px solid ${item.color}` : "2px solid #ddd",
                          bgcolor: active ? item.color : "transparent",
                          display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.3s" }}>
                          {active && <Box sx={{ width: 8, height: 8, borderRadius: "50%", bgcolor: "#fff" }} />}
                        </Box>
                      </Stack>
                      {active && (
                        <Stack spacing={0.5} mt={1.5} pl={7}>
                          {item.perks.map((p, idx) => (
                            <Stack key={idx} direction="row" alignItems="center" spacing={0.8}>
                              <CheckCircleIcon sx={{ fontSize: 12, color: item.color }} />
                              <Typography sx={{ color: "#999", fontSize: 11 }}>{p}</Typography>
                            </Stack>
                          ))}
                        </Stack>
                      )}
                    </Box>
                  );
                })}
              </Stack>
            </Box>
          </Stack>
        </motion.div>
      </Box>

      {/* Formulaire droite */}
      <Box sx={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center",
        bgcolor: "#fff", p: { xs: 3, sm: 5 }, overflowY: "auto" }}>
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }} style={{ width: "100%", maxWidth: 500 }}>

          {/* Mobile logo */}
          <Stack direction="row" alignItems="center" spacing={1.5} mb={4} sx={{ display: { lg: "none" } }}>
            <Box sx={{ width: 36, height: 36, borderRadius: "50%",
              background: "linear-gradient(135deg, #E63946, #c1121f)",
              display: "flex", alignItems: "center", justifyContent: "center" }}>
              <DirectionsCarIcon sx={{ fontSize: 18, color: "#fff" }} />
            </Box>
            <Typography fontWeight={900} fontSize={17} color="#1a1a1a">
              SAYARA<Box component="span" sx={{ color: "#E63946" }}>TECH</Box>
            </Typography>
          </Stack>

          <Box mb={4}>
            <Stack direction="row" alignItems="center" spacing={1.5} mb={1}>
              <Typography variant="h5" fontWeight={900} color="#1a1a1a">
                {isVendeur ? "Devenir vendeur" : "Créer un compte"}
              </Typography>
              <Chip label={isVendeur ? "Vendeur" : "Acheteur"} size="small"
                sx={{ bgcolor: isVendeur ? "rgba(230,57,70,0.08)" : "rgba(59,130,246,0.08)",
                  color: isVendeur ? "#E63946" : "#3b82f6", fontWeight: 700, fontSize: 10,
                  border: isVendeur ? "1px solid rgba(230,57,70,0.2)" : "1px solid rgba(59,130,246,0.2)" }} />
            </Stack>
            <Typography color="#999" fontSize={13}>
              Déjà inscrit ?{" "}
              <Box component="span" sx={{ color: "#E63946", cursor: "pointer", fontWeight: 700, "&:hover": { textDecoration: "underline" } }}
                onClick={() => navigate("/login")}>
                Se connecter
              </Box>
            </Typography>
          </Box>

          {/* Sélecteur mobile */}
          <Stack direction="row" spacing={1.5} mb={3} sx={{ display: { lg: "none" } }}>
            {ACCOUNT_TYPES.map(item => (
              <Box key={item.type} onClick={() => setForm({ ...form, accountType: item.type })}
                sx={{ flex: 1, p: 1.5, borderRadius: 2.5, cursor: "pointer", textAlign: "center",
                  border: form.accountType === item.type ? `1.5px solid ${item.color}50` : "1.5px solid #eee",
                  bgcolor: form.accountType === item.type ? `${item.color}08` : "#fafafa", transition: "all 0.2s" }}>
                <Box sx={{ color: form.accountType === item.type ? item.color : "#ccc", mb: 0.5 }}>{item.icon}</Box>
                <Typography sx={{ color: form.accountType === item.type ? "#1a1a1a" : "#bbb", fontSize: 12, fontWeight: 700 }}>{item.title}</Typography>
              </Box>
            ))}
          </Stack>

          {error && (
            <Alert severity="error" sx={{ mb: 2.5, borderRadius: 2, bgcolor: "#fff5f5", border: "1px solid #fecaca", color: "#c1121f" }}>
              {error}
            </Alert>
          )}

          <Stack spacing={2}>
            <Stack direction="row" spacing={2}>
              <TextField label="Prénom *" fullWidth value={form.firstName} onChange={set("firstName")} sx={inputSx}
                InputProps={{ startAdornment: <InputAdornment position="start"><PersonOutlinedIcon sx={{ fontSize: 16, color: "#ccc" }} /></InputAdornment> }} />
              <TextField label="Nom" fullWidth value={form.lastName} onChange={set("lastName")} sx={inputSx} />
            </Stack>

            <TextField label="Email *" fullWidth value={form.email} onChange={set("email")} sx={inputSx}
              InputProps={{ startAdornment: <InputAdornment position="start"><EmailOutlinedIcon sx={{ fontSize: 16, color: "#ccc" }} /></InputAdornment> }} />

            <TextField label="Mot de passe *" type={showPass ? "text" : "password"} fullWidth
              value={form.password} onChange={set("password")} sx={inputSx}
              InputProps={{
                startAdornment: <InputAdornment position="start"><LockOutlinedIcon sx={{ fontSize: 16, color: "#ccc" }} /></InputAdornment>,
                endAdornment: <InputAdornment position="end">
                  <IconButton size="small" onClick={() => setShowPass(!showPass)} sx={{ color: "#ccc" }}>
                    {showPass ? <VisibilityOffOutlinedIcon fontSize="small" /> : <VisibilityOutlinedIcon fontSize="small" />}
                  </IconButton>
                </InputAdornment>,
              }} />

            <TextField label="Confirmer le mot de passe *" type={showConfirm ? "text" : "password"} fullWidth
              value={form.confirmPassword} onChange={set("confirmPassword")} sx={inputSx}
              InputProps={{
                startAdornment: <InputAdornment position="start"><LockOutlinedIcon sx={{ fontSize: 16, color: "#ccc" }} /></InputAdornment>,
                endAdornment: <InputAdornment position="end">
                  <IconButton size="small" onClick={() => setShowConfirm(!showConfirm)} sx={{ color: "#ccc" }}>
                    {showConfirm ? <VisibilityOffOutlinedIcon fontSize="small" /> : <VisibilityOutlinedIcon fontSize="small" />}
                  </IconButton>
                </InputAdornment>,
              }} />

            <Button variant="contained" fullWidth onClick={handleSignUp} disabled={loading}
              sx={{ mt: 1, py: 1.6, borderRadius: "14px",
                background: loading ? "#f5f5f5" : "linear-gradient(135deg, #E63946, #c1121f)",
                color: loading ? "#bbb" : "#fff", fontWeight: 800, textTransform: "none", fontSize: 15,
                boxShadow: loading ? "none" : "0 8px 24px rgba(230,57,70,0.25)",
                "&:hover": { transform: "translateY(-1px)", boxShadow: "0 12px 32px rgba(230,57,70,0.35)" },
                "&.Mui-disabled": { color: "#bbb", bgcolor: "#f5f5f5" } }}>
              {loading ? "Inscription en cours..." : isVendeur ? "Créer mon espace vendeur" : "Créer mon compte"}
            </Button>

            <Button variant="outlined" fullWidth onClick={() => navigate("/login")}
              sx={{ py: 1.4, borderRadius: "14px", borderColor: "#e0e0e0", color: "#888",
                fontWeight: 700, textTransform: "none", fontSize: 14,
                "&:hover": { borderColor: "#E63946", color: "#E63946", bgcolor: "rgba(230,57,70,0.03)" } }}>
              Se connecter à un compte existant
            </Button>
          </Stack>
        </motion.div>
      </Box>
    </Box>
  );
}
