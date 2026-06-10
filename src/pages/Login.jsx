// @ts-nocheck
import React, { useState } from "react";
import {
  Box, Button, TextField, Typography, Stack,
  InputAdornment, IconButton, Alert, Divider, useTheme, Chip, Modal,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import VisibilityOffOutlinedIcon from "@mui/icons-material/VisibilityOffOutlined";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
import GoogleIcon from "@mui/icons-material/Google";
import FacebookIcon from "@mui/icons-material/Facebook";
import ShoppingBagIcon from "@mui/icons-material/ShoppingBag";
import StorefrontIcon from "@mui/icons-material/Storefront";
import { motion } from "framer-motion";
import { login, loginWithGoogle, loginWithFacebook } from "../firebase/auth";
import { getUserProfile, createUserProfile } from "../firebase/user";

export default function Login() {
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [error, setError]       = useState("");
  const [loading, setLoading]   = useState(false);
  const [roleModal, setRoleModal] = useState({ open: false, provider: "" });
  const [pendingCredential, setPendingCredential] = useState(null);
  const navigate = useNavigate();
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";

  // ── تسجيل دخول بالإيميل ──────────────────────────────
  const handleLogin = async () => {
    if (!email || !password) { setError("Veuillez remplir tous les champs"); return; }
    setLoading(true); setError("");
    try {
      const result = await login(email, password);
      const profile = await getUserProfile(result.user.uid);
      const userData = {
        uid: result.user.uid,
        email: result.user.email,
        username: profile?.username || result.user.displayName || email.split("@")[0],
        role: profile?.role || "acheteur",
        vendeurStatus: profile?.vendeurStatus || "none",
      };
      localStorage.setItem("user", JSON.stringify(userData));
      navigate(userData.role === "vendeur" ? "/vendeur" : "/");
    } catch (err) {
      const msg = err.code === "auth/invalid-credential" || err.code === "auth/wrong-password"
        ? "Email ou mot de passe incorrect"
        : "Erreur de connexion, réessayez.";
      setError(msg);
    } finally { setLoading(false); }
  };

  // ── تسجيل دخول بـ Google / Facebook ──────────────────
  const handleSocialClick = (provider) => {
    setRoleModal({ open: true, provider });
  };

  const handleRoleSelect = async (role) => {
    setRoleModal({ open: false, provider: "" });
    setLoading(true); setError("");
    try {
      const result = roleModal.provider === "google"
        ? await loginWithGoogle()
        : await loginWithFacebook();

      const uid = result.user.uid;
      let profile = await getUserProfile(uid);

      // إنشاء الملف إذا كان جديداً
      if (!profile) {
        await createUserProfile(uid, {
          uid,
          email: result.user.email,
          username: result.user.displayName || result.user.email?.split("@")[0] || "User",
          role: role === "vendeur" ? "vendeur" : "acheteur",
          vendeurStatus: role === "vendeur" ? "approved" : "none",
        });
        profile = await getUserProfile(uid);
      }

      const userData = {
        uid,
        email: result.user.email,
        username: profile?.username || result.user.displayName,
        role: profile?.role || "acheteur",
        vendeurStatus: profile?.vendeurStatus || "none",
      };
      localStorage.setItem("user", JSON.stringify(userData));
      navigate(userData.role === "vendeur" ? "/vendeur" : "/");
    } catch (err) {
      setError("Erreur de connexion sociale. Réessayez.");
    } finally { setLoading(false); }
  };

  const inputSx = {
    "& .MuiOutlinedInput-root": {
      borderRadius: "14px",
      bgcolor: isDark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.03)",
      "&:hover fieldset": { borderColor: "#E63946" },
      "&.Mui-focused fieldset": { borderColor: "#E63946" },
    },
  };

  return (
    <Box sx={{ minHeight: "100vh", display: "flex" }}>

      {/* Modal اختيار نوع الحساب */}
      <Modal open={roleModal.open} onClose={() => setRoleModal({ open: false, provider: "" })}>
        <Box sx={{
          position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)",
          bgcolor: "#fff", borderRadius: 4, p: 4, width: { xs: "90%", sm: 420 },
          boxShadow: "0 24px 64px rgba(0,0,0,0.15)", outline: "none",
        }}>
          <Typography fontWeight={900} fontSize={20} color="#1a1a1a" mb={0.5}>
            Choisissez votre profil
          </Typography>
          <Typography color="#999" fontSize={13} mb={3}>
            Avant de continuer avec {roleModal.provider === "google" ? "Google" : "Facebook"}
          </Typography>
          <Stack spacing={2}>
            {[
              { role: "acheteur", icon: <ShoppingBagIcon sx={{ fontSize: 28 }} />, title: "Acheteur", desc: "J'achète des pièces auto", color: "#3b82f6" },
              { role: "vendeur",  icon: <StorefrontIcon  sx={{ fontSize: 28 }} />, title: "Vendeur",  desc: "Je vends mes produits",   color: "#E63946" },
            ].map(item => (
              <Box key={item.role} onClick={() => handleRoleSelect(item.role)}
                sx={{
                  p: 2.5, borderRadius: 3, cursor: "pointer", transition: "all 0.2s",
                  border: "1.5px solid #f0f0f0",
                  "&:hover": { border: `1.5px solid ${item.color}50`, bgcolor: `${item.color}08`, transform: "translateY(-1px)" },
                }}>
                <Stack direction="row" alignItems="center" spacing={2}>
                  <Box sx={{ width: 50, height: 50, borderRadius: 2, bgcolor: `${item.color}12`, display: "flex", alignItems: "center", justifyContent: "center", color: item.color }}>
                    {item.icon}
                  </Box>
                  <Box>
                    <Typography fontWeight={800} fontSize={15} color="#1a1a1a">{item.title}</Typography>
                    <Typography fontSize={12} color="#999">{item.desc}</Typography>
                  </Box>
                </Stack>
              </Box>
            ))}
          </Stack>
        </Box>
      </Modal>

      {/* Left branding */}
      <Box sx={{
        display: { xs: "none", md: "flex" }, flex: 1,
        background: "linear-gradient(145deg, #0d0d0d 0%, #1a0000 60%, #2d0000 100%)",
        flexDirection: "column", alignItems: "center", justifyContent: "center",
        p: 6, position: "relative", overflow: "hidden",
      }}>
        {[200, 350, 500].map((size, i) => (
          <Box key={i} sx={{ position: "absolute", width: size, height: size, borderRadius: "50%",
            border: "1px solid rgba(230,57,70,0.15)", top: "50%", left: "50%", transform: "translate(-50%,-50%)" }} />
        ))}
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
          <Stack alignItems="center" spacing={3}>
            <Box sx={{ width: 80, height: 80, borderRadius: "50%", bgcolor: "#E63946", display: "flex",
              alignItems: "center", justifyContent: "center", boxShadow: "0 0 40px rgba(230,57,70,0.5)" }}>
              <DirectionsCarIcon sx={{ fontSize: 40, color: "#fff" }} />
            </Box>
            <Typography sx={{ fontSize: 32, fontWeight: 900, color: "#fff", letterSpacing: 3 }}>
              SAYARA<Box component="span" sx={{ color: "#E63946" }}>TECH</Box>
            </Typography>
            <Typography sx={{ color: "rgba(255,255,255,0.4)", fontSize: 13, letterSpacing: 1, mt: 0.3 }}>
              Votre garage en ligne
            </Typography>
            <Stack spacing={1.5} mt={2} sx={{ width: "100%", maxWidth: 280 }}>
              {["Livraison gratuite partout", "Produits 100% originaux", "Support 24/7"].map(t => (
                <Stack key={t} direction="row" alignItems="center" spacing={1.5}>
                  <Box sx={{ width: 6, height: 6, borderRadius: "50%", bgcolor: "#E63946", flexShrink: 0 }} />
                  <Typography sx={{ color: "rgba(255,255,255,0.5)", fontSize: 13 }}>{t}</Typography>
                </Stack>
              ))}
            </Stack>
          </Stack>
        </motion.div>
      </Box>

      {/* Right form */}
      <Box sx={{ flex: { xs: 1, md: "0 0 480px" }, display: "flex", alignItems: "center",
        justifyContent: "center", bgcolor: isDark ? "#0a0a0a" : "#fff", p: { xs: 3, sm: 5 } }}>
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }} style={{ width: "100%", maxWidth: 380 }}>

          {/* Mobile logo */}
          <Stack direction="row" alignItems="center" spacing={1} mb={4} sx={{ display: { md: "none" } }}>
            <Box sx={{ width: 36, height: 36, borderRadius: "50%", bgcolor: "#E63946", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <DirectionsCarIcon sx={{ fontSize: 20, color: "#fff" }} />
            </Box>
            <Typography fontWeight={900} fontSize={18}>SAYARA<Box component="span" sx={{ color: "#E63946" }}>TECH</Box></Typography>
          </Stack>

          <Typography variant="h5" fontWeight={800} mb={0.5}>Connexion</Typography>
          <Typography color="text.secondary" fontSize={13} mb={3}>
            Pas encore de compte ?{" "}
            <Box component="span" sx={{ color: "#E63946", cursor: "pointer", fontWeight: 700 }}
              onClick={() => navigate("/signup")}>
              S'inscrire
            </Box>
          </Typography>

          {error && <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>{error}</Alert>}

          {/* Social buttons */}
          <Stack spacing={1.5} mb={3}>
            <Button fullWidth variant="outlined" startIcon={<GoogleIcon sx={{ color: "#EA4335" }} />}
              onClick={() => handleSocialClick("google")} disabled={loading}
              sx={{ borderRadius: "14px", py: 1.3, textTransform: "none", fontWeight: 600, fontSize: 14,
                borderColor: "rgba(0,0,0,0.15)", color: "text.primary",
                "&:hover": { borderColor: "#EA4335", bgcolor: "rgba(234,67,53,0.04)" } }}>
              Continuer avec Google
            </Button>
            <Button fullWidth variant="outlined" startIcon={<FacebookIcon sx={{ color: "#1877F2" }} />}
              onClick={() => handleSocialClick("facebook")} disabled={loading}
              sx={{ borderRadius: "14px", py: 1.3, textTransform: "none", fontWeight: 600, fontSize: 14,
                borderColor: "rgba(0,0,0,0.15)", color: "text.primary",
                "&:hover": { borderColor: "#1877F2", bgcolor: "rgba(24,119,242,0.04)" } }}>
              Continuer avec Facebook
            </Button>
          </Stack>

          <Divider sx={{ mb: 3 }}><Typography fontSize={12} color="text.secondary">ou avec email</Typography></Divider>

          <Stack spacing={2}>
            <TextField label="Email" fullWidth value={email} onChange={e => setEmail(e.target.value)} sx={inputSx}
              InputProps={{ startAdornment: <InputAdornment position="start"><EmailOutlinedIcon sx={{ fontSize: 18, color: "text.secondary" }} /></InputAdornment> }} />

            <TextField label="Mot de passe" type={showPass ? "text" : "password"} fullWidth
              value={password} onChange={e => setPassword(e.target.value)}
              onKeyDown={e => e.key === "Enter" && handleLogin()} sx={inputSx}
              InputProps={{
                startAdornment: <InputAdornment position="start"><LockOutlinedIcon sx={{ fontSize: 18, color: "text.secondary" }} /></InputAdornment>,
                endAdornment: <InputAdornment position="end">
                  <IconButton size="small" onClick={() => setShowPass(!showPass)}>
                    {showPass ? <VisibilityOffOutlinedIcon fontSize="small" /> : <VisibilityOutlinedIcon fontSize="small" />}
                  </IconButton>
                </InputAdornment>,
              }} />

            <Button variant="contained" fullWidth onClick={handleLogin} disabled={loading}
              sx={{ bgcolor: "#E63946", borderRadius: "14px", py: 1.5, fontWeight: 700,
                textTransform: "none", fontSize: 15, mt: 1, "&:hover": { bgcolor: "#c1121f" },
                boxShadow: "0 8px 24px rgba(230,57,70,0.35)" }}>
              {loading ? "Connexion..." : "Se connecter"}
            </Button>
          </Stack>
        </motion.div>
      </Box>
    </Box>
  );
}
