import { Box, Container, Stack, Typography, useTheme } from "@mui/material";
import ElectricBoltIcon from "@mui/icons-material/ElectricBolt";
import CreditScoreOutlinedIcon from "@mui/icons-material/CreditScoreOutlined";
import WorkspacePremiumOutlinedIcon from "@mui/icons-material/WorkspacePremiumOutlined";
import AccessAlarmOutlinedIcon from "@mui/icons-material/AccessAlarmOutlined";
import { motion } from "framer-motion";

const items = [
  { icon: <ElectricBoltIcon />, title: "Livraison Rapide", sub: "Partout en Algérie", color: "#f59e0b" },
  { icon: <WorkspacePremiumOutlinedIcon />, title: "Garantie Qualité", sub: "Produits 100% originaux", color: "#10b981" },
  { icon: <AccessAlarmOutlinedIcon />, title: "Retour 7 Jours", sub: "Satisfait ou remboursé", color: "#3b82f6" },
  { icon: <CreditScoreOutlinedIcon />, title: "Paiement Sécurisé", sub: "Transactions protégées", color: "#E63946" },
];

const IconSection = () => {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";

  return (
    <Box
      sx={{
        bgcolor: isDark ? "#0d0d0d" : "#fff",
        borderTop: `1px solid ${isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.06)"}`,
        borderBottom: `1px solid ${isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.06)"}`,
        py: 2.5,
      }}
    >
      <Container>
        <Stack
          direction={{ xs: "column", sm: "row" }}
          justifyContent="space-around"
          alignItems="center"
          spacing={{ xs: 2, sm: 0 }}
        >
          {items.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              viewport={{ once: true }}
            >
              <Stack direction="row" alignItems="center" spacing={1.5} sx={{ px: 2 }}>
                <Box
                  sx={{
                    width: 42,
                    height: 42,
                    borderRadius: "12px",
                    bgcolor: `${item.color}18`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: item.color,
                    flexShrink: 0,
                  }}
                >
                  {item.icon}
                </Box>
                <Box>
                  <Typography sx={{ fontWeight: 700, fontSize: 13, lineHeight: 1.2 }}>
                    {item.title}
                  </Typography>
                  <Typography sx={{ fontSize: 11, color: "text.secondary" }}>
                    {item.sub}
                  </Typography>
                </Box>
              </Stack>
            </motion.div>
          ))}
        </Stack>
      </Container>
    </Box>
  );
};

export default IconSection;
