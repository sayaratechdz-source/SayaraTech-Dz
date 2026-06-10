// @ts-nocheck
import React from "react";
import { Box, Container, Typography, Stack, Grid, Chip, Avatar, Divider } from "@mui/material";
import { motion } from "framer-motion";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
import RocketLaunchIcon from "@mui/icons-material/RocketLaunch";
import GroupsIcon from "@mui/icons-material/Groups";
import EmojiObjectsIcon from "@mui/icons-material/EmojiObjects";
import VerifiedIcon from "@mui/icons-material/Verified";
import CodeIcon from "@mui/icons-material/Code";
import ArchitectureIcon from "@mui/icons-material/Architecture";

const team = [
  {
    name: "Abderrahmane Aref",
    role: "Architecture & Backend",
    desc: "Architecture systeme, API REST, bases de donnees et infrastructure cloud.",
    color: "#8b5cf6",
    initials: "AA",
    icon: <ArchitectureIcon sx={{ fontSize: 28, color: "#8b5cf6" }} />,
  },
  {
    name: "Abdallah Gheribi",
    role: "Frontend & UX",
    desc: "Interfaces utilisateur modernes, experience client et design systeme premium.",
    color: "#3b82f6",
    initials: "AG",
    icon: <CodeIcon sx={{ fontSize: 28, color: "#3b82f6" }} />,
  },
];

const stats = [
  { value: "500+", label: "References auto" },
  { value: "2", label: "Fondateurs" },
  { value: "2025", label: "Annee de creation" },
  { value: "100%", label: "Made in Algeria" },
];

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.6, delay },
});

export default function About() {
  return (
    <Box sx={{ bgcolor: "#0a0a0a", minHeight: "100vh", color: "#fff" }}>

      <Box sx={{
        background: "linear-gradient(135deg, #0a0a0a 0%, #1a0000 50%, #0a0a0a 100%)",
        borderBottom: "1px solid rgba(230,57,70,0.15)",
        py: { xs: 8, md: 12 },
        position: "relative", overflow: "hidden",
      }}>
        {[200, 400, 600].map((s, i) => (
          <Box key={i} sx={{
            position: "absolute", width: s, height: s, borderRadius: "50%",
            border: "1px solid rgba(230,57,70,0.08)",
            top: "50%", left: "50%", transform: "translate(-50%,-50%)",
          }} />
        ))}
        <Container maxWidth="md" sx={{ position: "relative", textAlign: "center" }}>
          <motion.div {...fadeUp(0)}>
            <Box sx={{ display: "inline-flex", alignItems: "center", gap: 1, px: 2, py: 0.8, borderRadius: 10, bgcolor: "rgba(230,57,70,0.1)", border: "1px solid rgba(230,57,70,0.3)", mb: 3 }}>
              <RocketLaunchIcon sx={{ fontSize: 16, color: "#E63946" }} />
              <Typography sx={{ fontSize: 12, color: "#E63946", fontWeight: 700, letterSpacing: 1 }}>STARTUP ALGERIENNE</Typography>
            </Box>
          </motion.div>
          <motion.div {...fadeUp(0.1)}>
            <Typography variant="h2" fontWeight={900} sx={{ fontSize: { xs: 34, md: 54 }, lineHeight: 1.1, mb: 2 }}>
              Nous revolutionnons
              <Box component="span" sx={{ color: "#E63946", display: "block" }}>le marche auto algerien</Box>
            </Typography>
          </motion.div>
          <motion.div {...fadeUp(0.2)}>
            <Typography sx={{ color: "rgba(255,255,255,0.5)", fontSize: 17, maxWidth: 560, mx: "auto", lineHeight: 1.9 }}>
              SayaraTech DZ est la premiere plateforme e-commerce dediee aux pieces automobiles en Algerie.
              Notre mission : rendre accessible, rapide et fiable l achat de pieces auto pour tous les Algeriens.
            </Typography>
          </motion.div>
        </Container>
      </Box>

      <Box sx={{ py: 6, borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
        <Container maxWidth="lg">
          <Grid container spacing={3} justifyContent="center">
            {stats.map((s, i) => (
              <Grid item xs={6} md={3} key={i}>
                <motion.div {...fadeUp(i * 0.1)}>
                  <Box sx={{ textAlign: "center", p: 3, borderRadius: 3, bgcolor: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
                    <Typography sx={{ fontSize: 40, fontWeight: 900, color: "#E63946", lineHeight: 1 }}>{s.value}</Typography>
                    <Typography sx={{ color: "rgba(255,255,255,0.4)", fontSize: 13, mt: 0.5 }}>{s.label}</Typography>
                  </Box>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      <Box sx={{ py: 10 }}>
        <Container maxWidth="lg">
          <Grid container spacing={6} alignItems="center">
            <Grid item xs={12} md={6}>
              <motion.div {...fadeUp(0)}>
                <Chip label="Notre mission" sx={{ bgcolor: "rgba(230,57,70,0.1)", color: "#E63946", fontWeight: 700, mb: 2 }} />
                <Typography variant="h4" fontWeight={800} mb={2} color="#fff">
                  Votre garage en ligne,
                  <Box component="span" sx={{ color: "#E63946" }}> partout en Algerie</Box>
                </Typography>
                <Typography sx={{ color: "rgba(255,255,255,0.5)", lineHeight: 1.9, mb: 3 }}>
                  Nous avons cree SayaraTech DZ pour resoudre un probleme reel : trouver des pieces auto de qualite
                  en Algerie est souvent difficile, long et couteux. Notre plateforme connecte acheteurs et vendeurs
                  de confiance sur tout le territoire national.
                </Typography>
                <Stack spacing={1.5}>
                  {["Pieces 100% verifiees et garanties","Livraison rapide sur toute l Algerie","Paiement securise : CCP, BaridiMob, virement","Support client disponible 7j/7"].map((item, i) => (
                    <Stack key={i} direction="row" alignItems="center" spacing={1.5}>
                      <VerifiedIcon sx={{ fontSize: 18, color: "#E63946", flexShrink: 0 }} />
                      <Typography sx={{ color: "rgba(255,255,255,0.7)", fontSize: 14 }}>{item}</Typography>
                    </Stack>
                  ))}
                </Stack>
              </motion.div>
            </Grid>
            <Grid item xs={12} md={6}>
              <motion.div {...fadeUp(0.2)}>
                <Box sx={{ p: 4, borderRadius: 4, background: "linear-gradient(135deg, rgba(230,57,70,0.08), rgba(230,57,70,0.02))", border: "1px solid rgba(230,57,70,0.15)", position: "relative", overflow: "hidden" }}>
                  <Stack alignItems="center" spacing={2}>
                    <Box sx={{ width: 80, height: 80, borderRadius: "50%", bgcolor: "#E63946", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 0 40px rgba(230,57,70,0.4)" }}>
                      <DirectionsCarIcon sx={{ fontSize: 40, color: "#fff" }} />
                    </Box>
                    <Typography sx={{ fontSize: 24, fontWeight: 900, letterSpacing: 3, color: "#fff" }}>
                      SAYARA<Box component="span" sx={{ color: "#E63946" }}>TECH</Box>
                      <Box component="span" sx={{ color: "#555", fontSize: 14, ml: 0.5 }}>DZ</Box>
                    </Typography>
                    <Typography sx={{ color: "rgba(255,255,255,0.35)", fontSize: 13, letterSpacing: 1 }}>Votre garage en ligne</Typography>
                    <Divider sx={{ borderColor: "rgba(255,255,255,0.06)", width: "100%" }} />
                    <Typography sx={{ color: "rgba(255,255,255,0.4)", fontSize: 13, textAlign: "center", lineHeight: 1.8 }}>
                      Fondee en 2025 a Alger<br />Startup technologique algerienne<br />E-commerce automobile nouvelle generation
                    </Typography>
                  </Stack>
                </Box>
              </motion.div>
            </Grid>
          </Grid>
        </Container>
      </Box>

      <Box sx={{ py: 10, bgcolor: "rgba(255,255,255,0.01)", borderTop: "1px solid rgba(255,255,255,0.04)" }}>
        <Container maxWidth="lg">
          <motion.div {...fadeUp(0)}>
            <Stack alignItems="center" mb={7}>
              <Chip label="L equipe" icon={<GroupsIcon sx={{ fontSize: 16 }} />} sx={{ bgcolor: "rgba(230,57,70,0.1)", color: "#E63946", fontWeight: 700, mb: 2 }} />
              <Typography variant="h4" fontWeight={800} textAlign="center" color="#fff">
                Deux passionnes,<Box component="span" sx={{ color: "#E63946" }}> une vision</Box>
              </Typography>
              <Typography sx={{ color: "rgba(255,255,255,0.4)", mt: 1.5, textAlign: "center", maxWidth: 480 }}>
                Une equipe complementaire alliant IA, architecture systeme et design pour construire la reference du e-commerce automobile en Algerie.
              </Typography>
            </Stack>
          </motion.div>
          <Grid container spacing={4} justifyContent="center">
            {team.map((member, i) => (
              <Grid item xs={12} sm={6} md={4} key={i}>
                <motion.div {...fadeUp(i * 0.15)}>
                  <Box sx={{ p: 4, borderRadius: 4, height: "100%", bgcolor: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", transition: "all 0.3s", "&:hover": { border: "1px solid " + member.color + "40", transform: "translateY(-4px)" } }}>
                    <Stack alignItems="center" spacing={2.5}>
                      <Avatar sx={{ width: 72, height: 72, bgcolor: member.color + "20", border: "2px solid " + member.color + "40", fontSize: 22, fontWeight: 900, color: member.color }}>
                        {member.initials}
                      </Avatar>
                      <Box textAlign="center">
                        <Typography fontWeight={800} fontSize={17} mb={0.5} color="#fff">{member.name}</Typography>
                        <Chip label={member.role} size="small" sx={{ bgcolor: member.color + "15", color: member.color, fontWeight: 700, fontSize: 11 }} />
                      </Box>
                      <Box sx={{ p: 1.5, borderRadius: 2.5, bgcolor: member.color + "10", border: "1px solid " + member.color + "20" }}>
                        {member.icon}
                      </Box>
                      <Typography sx={{ color: "rgba(255,255,255,0.45)", fontSize: 13, textAlign: "center", lineHeight: 1.7 }}>{member.desc}</Typography>
                    </Stack>
                  </Box>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      <Box sx={{ py: 10, background: "linear-gradient(135deg, #1a0000, #0a0a0a)", borderTop: "1px solid rgba(230,57,70,0.15)", textAlign: "center" }}>
        <Container maxWidth="sm">
          <motion.div {...fadeUp(0)}>
            <Typography variant="h4" fontWeight={800} mb={2} color="#fff">
              Rejoignez l aventure<Box component="span" sx={{ color: "#E63946" }}> SayaraTech</Box>
            </Typography>
            <Typography sx={{ color: "rgba(255,255,255,0.4)", mb: 4, lineHeight: 1.8 }}>
              Que vous soyez acheteur ou vendeur, notre plateforme est faite pour vous.
            </Typography>
            <Stack direction={{ xs: "column", sm: "row" }} spacing={2} justifyContent="center">
              <Box component="a" href="/signup" sx={{ px: 4, py: 1.5, borderRadius: "12px", bgcolor: "#E63946", color: "#fff", fontWeight: 700, fontSize: 15, textDecoration: "none", transition: "0.3s", "&:hover": { bgcolor: "#c1121f" }, boxShadow: "0 8px 24px rgba(230,57,70,0.35)" }}>
                Creer un compte
              </Box>
              <Box component="a" href="/products" sx={{ px: 4, py: 1.5, borderRadius: "12px", border: "1px solid rgba(255,255,255,0.15)", color: "#fff", fontWeight: 700, fontSize: 15, textDecoration: "none", transition: "0.3s", "&:hover": { border: "1px solid rgba(230,57,70,0.5)", color: "#E63946" } }}>
                Voir la boutique
              </Box>
            </Stack>
          </motion.div>
        </Container>
      </Box>

    </Box>
  );
}