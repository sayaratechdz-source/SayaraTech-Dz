// @ts-nocheck
// Page de callback OAuth — redirige simplement vers l'accueil
// Firebase gère l'OAuth directement via signInWithPopup, cette page n'est plus nécessaire
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Typography, CircularProgress, Stack } from "@mui/material";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";

export default function AuthCallback() {
  const navigate = useNavigate();

  useEffect(() => {
    // Firebase OAuth est géré directement dans Login.jsx via signInWithPopup
    // Cette page redirige simplement vers l'accueil
    const user = localStorage.getItem("user");
    if (user) {
      const parsed = JSON.parse(user);
      navigate(parsed.role === "vendeur" ? "/vendeur" : "/");
    } else {
      navigate("/login");
    }
  }, []);

  return (
    <Box sx={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center",
      background: "linear-gradient(145deg, #0d0d0d, #1a0000)" }}>
      <Stack alignItems="center" spacing={3}>
        <Box sx={{ width: 64, height: 64, borderRadius: "50%", bgcolor: "#E63946",
          display: "flex", alignItems: "center", justifyContent: "center",
          boxShadow: "0 0 40px rgba(230,57,70,0.5)" }}>
          <DirectionsCarIcon sx={{ fontSize: 32, color: "#fff" }} />
        </Box>
        <CircularProgress sx={{ color: "#E63946" }} />
        <Typography sx={{ color: "rgba(255,255,255,0.6)", fontSize: 14 }}>Redirection...</Typography>
      </Stack>
    </Box>
  );
}
