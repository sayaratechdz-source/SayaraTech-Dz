import React, { useState, useEffect } from "react";
import { Box, IconButton, Backdrop, Tooltip } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import SmartToyIcon from "@mui/icons-material/SmartToy";

const Chatbot = () => {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const handler = () => setOpen(true);
    window.addEventListener("open-chatbot", handler);
    return () => window.removeEventListener("open-chatbot", handler);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  return (
    <>
      {/* Floating button — always visible */}
      <Tooltip title="Assistant IA" placement="left">
        <Box
          onClick={() => setOpen(true)}
          sx={{
            position: "fixed",
            bottom: 24,
            right: 24,
            width: 56,
            height: 56,
            borderRadius: "50%",
            bgcolor: "#E63946",
            color: "#fff",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            zIndex: 1300,
            boxShadow: "0 4px 20px rgba(230,57,70,0.5)",
            transition: "transform 0.2s, box-shadow 0.2s",
            "&:hover": {
              transform: "scale(1.1)",
              boxShadow: "0 6px 28px rgba(230,57,70,0.7)",
            },
            // Pulse animation
            "&::after": {
              content: '""',
              position: "absolute",
              width: "100%",
              height: "100%",
              borderRadius: "50%",
              bgcolor: "rgba(230,57,70,0.4)",
              animation: "pulse-chatbot 2s infinite",
            },
            "@keyframes pulse-chatbot": {
              "0%": { transform: "scale(1)", opacity: 0.8 },
              "100%": { transform: "scale(1.8)", opacity: 0 },
            },
          }}
        >
          <SmartToyIcon sx={{ fontSize: 28 }} />
        </Box>
      </Tooltip>

      {/* Backdrop */}
      <Backdrop
        open={open}
        onClick={() => setOpen(false)}
        sx={{ zIndex: 1400, bgcolor: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)" }}
      />

      {/* Chatbot Modal */}
      {open && (
        <Box
          sx={{
            position: "fixed",
            top: { xs: 0, sm: "50%" },
            left: { xs: 0, sm: "50%" },
            transform: { xs: "none", sm: "translate(-50%, -50%)" },
            width: { xs: "100vw", sm: "80vw", md: "70vw" },
            height: { xs: "100vh", sm: "90vh" },
            borderRadius: { xs: 0, sm: 4 },
            overflow: "hidden",
            zIndex: 1500,
            boxShadow: "0 30px 80px rgba(0,0,0,0.5)",
            border: { xs: "none", sm: "1px solid rgba(230,57,70,0.25)" },
            bgcolor: "#fff",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", px: 2, py: 1, bgcolor: "#E63946", color: "#fff" }}>
            <Box sx={{ fontSize: 14, fontWeight: 700, letterSpacing: 0.5 }}>
              🤖 Assistant IA — Abdou
            </Box>
            <IconButton size="small" onClick={() => setOpen(false)} sx={{ color: "#fff" }}>
              <CloseIcon fontSize="small" />
            </IconButton>
          </Box>
          <iframe
            src="/chatbot.html"
            title="Abdou - Assistant Automobile IA"
            style={{ width: "100%", height: "calc(100% - 44px)", border: "none", display: "block" }}
          />
        </Box>
      )}
    </>
  );
};

export default Chatbot;
