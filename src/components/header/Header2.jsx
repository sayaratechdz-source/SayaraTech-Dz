// @ts-nocheck
import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { selectCartCount } from "../../Redux/cart";
import { selectWishlistCount } from "../../Redux/wishlist";
import {
  Box, Container, IconButton, InputBase, Stack, Badge, Drawer,
  useTheme, Typography, Tooltip, Divider, Chip, Menu, MenuItem, Avatar,
} from "@mui/material";
import {
  Menu as MenuIcon, Search as SearchIcon,
  ShoppingCart as ShoppingCartIcon, Favorite as FavoriteIcon,
  SmartToy as SmartToyIcon, Close as CloseIcon,
  Home as HomeIcon, StorefrontOutlined as StoreIcon,
  LocalOffer as PromoIcon, CompareArrows as CompareIcon,
  ListAlt as OrdersIcon, Login as LoginIcon,
  DirectionsCar as CarIcon, Person as PersonIcon,
  Logout as LogoutIcon, Store as VendeurIcon,
  AccountCircle as AccountIcon, Settings as SettingsIcon,
  Groups as GroupsIcon,
} from "@mui/icons-material";
import { Link, useNavigate } from "react-router-dom";

const Header2 = () => {
  const theme = useTheme();
  const cartCount     = useSelector(selectCartCount);
  const wishlistCount = useSelector(selectWishlistCount);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [query, setQuery]           = useState("");
  const [scrolled, setScrolled]     = useState(false);
  const [anchorEl, setAnchorEl]     = useState(null);
  const [user, setUser]             = useState(null);
  const navigate = useNavigate();
  const isDark = theme.palette.mode === "dark";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) setUser(JSON.parse(stored));
  }, []);

  const handleSearchChange = e => {
    const value = e.target.value;
    setQuery(value);
    if (value.trim().length > 0) navigate(`/products?search=${encodeURIComponent(value)}`);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    setAnchorEl(null);
    navigate("/login");
  };

  const isVendeur = user?.role === "vendeur";

  return (
    <Box sx={{ position: "sticky", top: 0, zIndex: 1000, bgcolor: isDark ? "#111" : "#fff", boxShadow: scrolled ? "0 4px 30px rgba(0,0,0,0.15)" : "0 1px 0 rgba(0,0,0,0.06)", transition: "box-shadow 0.3s", py: 1 }}>
      <Container sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 2 }}>

        {/* Left */}
        <Stack direction="row" spacing={1.5} alignItems="center">
          <IconButton onClick={() => setDrawerOpen(true)}
            sx={{ bgcolor: isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.04)", borderRadius: 2, "&:hover": { bgcolor: "#E63946", color: "#fff" }, transition: "0.3s" }}>
            <MenuIcon sx={{ fontSize: 22 }} />
          </IconButton>
          <Typography component={Link} to="/products"
            sx={{ textDecoration: "none", fontSize: 16, fontWeight: 700, color: theme.palette.text.primary, letterSpacing: 1, "&:hover": { color: "#E63946" }, transition: "0.3s" }}>
            Boutique
          </Typography>
          <Typography component={Link} to="/promotions"
            sx={{ textDecoration: "none", fontSize: 15, fontWeight: 700, color: "#E63946", letterSpacing: 0.5, display: { xs: "none", sm: "block" }, "&:hover": { opacity: 0.8 }, transition: "0.3s" }}>
            Promos
          </Typography>
          <Typography component={Link} to="/about"
            sx={{ textDecoration: "none", fontSize: 14, fontWeight: 600, color: "rgba(255,255,255,0.6)", letterSpacing: 0.5, display: { xs: "none", md: "block" }, "&:hover": { color: "#E63946" }, transition: "0.3s" }}>
            À propos
          </Typography>
        </Stack>

        {/* Search */}
        <Box sx={{ flex: 1, display: { xs: "none", md: "flex" }, alignItems: "center", bgcolor: isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.04)", px: 2, py: 0.9, borderRadius: "12px", border: `1px solid ${isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)"}`, transition: "all 0.3s", "&:focus-within": { border: "1px solid #E63946", boxShadow: "0 0 0 3px rgba(230,57,70,0.1)" } }}>
          <SearchIcon sx={{ opacity: 0.4, mr: 1, fontSize: 20 }} />
          <InputBase placeholder="Rechercher des pieces auto..." value={query} onChange={handleSearchChange} sx={{ width: "100%", fontSize: 14 }} />
        </Box>

        {/* Right icons */}
        <Stack direction="row" spacing={0.5} alignItems="center">
          <Tooltip title="Favoris">
            <IconButton component={Link} to="/wishlist" sx={{ borderRadius: 2, "&:hover": { color: "#E63946", bgcolor: "rgba(230,57,70,0.08)" } }}>
              <Badge badgeContent={wishlistCount || 0} color="error"><FavoriteIcon sx={{ fontSize: 22 }} /></Badge>
            </IconButton>
          </Tooltip>
          <Tooltip title="Panier">
            <IconButton component={Link} to="/cart" sx={{ borderRadius: 2, "&:hover": { color: "#E63946", bgcolor: "rgba(230,57,70,0.08)" } }}>
              <Badge badgeContent={cartCount || 0} color="error"><ShoppingCartIcon sx={{ fontSize: 22 }} /></Badge>
            </IconButton>
          </Tooltip>

          {/* Bouton profil */}
          {user ? (
            <>
              <Tooltip title={isVendeur ? "Espace Vendeur" : "Mon compte"}>
                <IconButton onClick={e => setAnchorEl(e.currentTarget)}
                  sx={{ borderRadius: 2, "&:hover": { color: "#E63946", bgcolor: "rgba(230,57,70,0.08)" } }}>
                  <Avatar sx={{ width: 30, height: 30, bgcolor: isVendeur ? "#8b5cf6" : "#E63946", fontSize: 13, fontWeight: 800 }}>
                    {(user.username || user.email || "U")[0].toUpperCase()}
                  </Avatar>
                </IconButton>
              </Tooltip>

              <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={() => setAnchorEl(null)}
                PaperProps={{ sx: { bgcolor: "#111", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 2.5, minWidth: 220, mt: 1 } }}>
                {/* Header menu */}
                <Box sx={{ px: 2, py: 1.5, borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
                  <Typography sx={{ color: "#fff", fontWeight: 700, fontSize: 14 }}>{user.username || user.email}</Typography>
                  <Chip label={isVendeur ? "Vendeur" : "Acheteur"} size="small"
                    sx={{ mt: 0.5, bgcolor: isVendeur ? "rgba(139,92,246,0.2)" : "rgba(59,130,246,0.2)", color: isVendeur ? "#8b5cf6" : "#3b82f6", fontWeight: 700, fontSize: 10 }} />
                </Box>

                {/* Menu acheteur */}
                {!isVendeur && [
                  { label: "Mon profil",     to: "/profil",   icon: <AccountIcon sx={{ fontSize: 18 }} /> },
                  { label: "Mes commandes",  to: "/orders",   icon: <OrdersIcon sx={{ fontSize: 18 }} /> },
                  { label: "Mes favoris",    to: "/wishlist", icon: <FavoriteIcon sx={{ fontSize: 18 }} /> },
                  { label: "Mon panier",     to: "/cart",     icon: <ShoppingCartIcon sx={{ fontSize: 18 }} /> },
                ].map(item => (
                  <MenuItem key={item.to} onClick={() => { navigate(item.to); setAnchorEl(null); }}
                    sx={{ color: "rgba(255,255,255,0.7)", fontSize: 13, gap: 1.5, "&:hover": { bgcolor: "rgba(255,255,255,0.05)", color: "#fff" } }}>
                    <Box sx={{ color: "rgba(255,255,255,0.4)" }}>{item.icon}</Box>
                    {item.label}
                  </MenuItem>
                ))}

                {/* Menu vendeur */}
                {isVendeur && [
                  { label: "Mon profil",          to: "/profil",   icon: <AccountIcon sx={{ fontSize: 18 }} /> },
                  { label: "Mon espace vendeur", to: "/vendeur",  icon: <VendeurIcon sx={{ fontSize: 18 }} /> },
                  { label: "Mes commandes",       to: "/orders",   icon: <OrdersIcon sx={{ fontSize: 18 }} /> },
                ].map(item => (
                  <MenuItem key={item.to} onClick={() => { navigate(item.to); setAnchorEl(null); }}
                    sx={{ color: "rgba(255,255,255,0.7)", fontSize: 13, gap: 1.5, "&:hover": { bgcolor: "rgba(255,255,255,0.05)", color: "#fff" } }}>
                    <Box sx={{ color: "rgba(255,255,255,0.4)" }}>{item.icon}</Box>
                    {item.label}
                  </MenuItem>
                ))}

                <Divider sx={{ borderColor: "rgba(255,255,255,0.07)", my: 0.5 }} />
                <MenuItem onClick={handleLogout}
                  sx={{ color: "#ef4444", fontSize: 13, gap: 1.5, "&:hover": { bgcolor: "rgba(239,68,68,0.08)" } }}>
                  <LogoutIcon sx={{ fontSize: 18 }} />
                  Deconnexion
                </MenuItem>
              </Menu>
            </>
          ) : (
            <Tooltip title="Connexion">
              <IconButton component={Link} to="/login" sx={{ borderRadius: 2, "&:hover": { color: "#E63946", bgcolor: "rgba(230,57,70,0.08)" } }}>
                <PersonIcon sx={{ fontSize: 22 }} />
              </IconButton>
            </Tooltip>
          )}

          <Tooltip title="Assistant IA">
            <IconButton onClick={() => window.dispatchEvent(new CustomEvent("open-chatbot"))}
              sx={{ borderRadius: 2, bgcolor: "rgba(230,57,70,0.1)", border: "1px solid rgba(230,57,70,0.3)", transition: "0.3s", "&:hover": { bgcolor: "#E63946", color: "#fff" } }}>
              <SmartToyIcon sx={{ fontSize: 22, color: "#E63946" }} />
            </IconButton>
          </Tooltip>
        </Stack>
      </Container>

      {/* Drawer */}
      <Drawer anchor="left" open={drawerOpen} onClose={() => setDrawerOpen(false)}
        PaperProps={{ sx: { width: 300, bgcolor: "#0a0a0a", borderRight: "1px solid rgba(230,57,70,0.15)" } }}>
        <Box sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
          <Box sx={{ p: 3, background: "linear-gradient(135deg, #1a0000, #0a0a0a)", borderBottom: "1px solid rgba(230,57,70,0.15)" }}>
            <Stack direction="row" alignItems="center" justifyContent="space-between">
              <Stack direction="row" alignItems="center" spacing={1.5}>
                <Box sx={{ width: 36, height: 36, borderRadius: "50%", bgcolor: "#E63946", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 0 16px rgba(230,57,70,0.5)" }}>
                  <CarIcon sx={{ fontSize: 20, color: "#fff" }} />
                </Box>
                <Box>
                  <Typography sx={{ fontWeight: 900, fontSize: 15, color: "#fff", letterSpacing: 2 }}>SAYARA<Box component="span" sx={{ color: "#E63946" }}>TECH</Box></Typography>
                  <Typography sx={{ fontSize: 10, color: "rgba(255,255,255,0.4)", letterSpacing: 1 }}>DZ</Typography>
                </Box>
              </Stack>
              <IconButton size="small" onClick={() => setDrawerOpen(false)}
                sx={{ color: "rgba(255,255,255,0.5)", bgcolor: "rgba(255,255,255,0.05)", borderRadius: 2, "&:hover": { bgcolor: "#E63946", color: "#fff" } }}>
                <CloseIcon fontSize="small" />
              </IconButton>
            </Stack>
          </Box>

          <Box sx={{ px: 2, pt: 2.5, flex: 1, overflowY: "auto" }}>
            <Typography sx={{ fontSize: 10, fontWeight: 700, color: "rgba(255,255,255,0.3)", letterSpacing: 2, textTransform: "uppercase", px: 1, mb: 1.5 }}>Navigation</Typography>
            {[
              { label: "Accueil",     to: "/",           icon: <HomeIcon sx={{ fontSize: 18 }} />,  highlight: false },
              { label: "Boutique",    to: "/products",   icon: <StoreIcon sx={{ fontSize: 18 }} />, highlight: false },
              { label: "Promotions",  to: "/promotions", icon: <PromoIcon sx={{ fontSize: 18 }} />, highlight: true  },
              { label: "A propos",    to: "/about",      icon: <GroupsIcon sx={{ fontSize: 18 }} />, highlight: false },
            ].map(({ label, to, icon, highlight }) => (
              <Box key={to} component={Link} to={to} onClick={() => setDrawerOpen(false)}
                sx={{ display: "flex", alignItems: "center", gap: 1.5, px: 1.5, py: 1.4, mb: 0.5, borderRadius: 2.5, textDecoration: "none", transition: "all 0.2s", color: highlight ? "#E63946" : "rgba(255,255,255,0.8)", bgcolor: "transparent", border: highlight ? "1px solid rgba(230,57,70,0.2)" : "1px solid transparent", "&:hover": { bgcolor: highlight ? "rgba(230,57,70,0.12)" : "rgba(255,255,255,0.06)", color: highlight ? "#E63946" : "#fff" } }}>
                <Box sx={{ color: highlight ? "#E63946" : "rgba(255,255,255,0.4)" }}>{icon}</Box>
                <Typography sx={{ fontSize: 14, fontWeight: 700 }}>{label}</Typography>
                {highlight && <Chip label="HOT" size="small" sx={{ ml: "auto", bgcolor: "#E63946", color: "#fff", fontSize: 9, fontWeight: 800, height: 18 }} />}
              </Box>
            ))}

            <Typography sx={{ fontSize: 10, fontWeight: 700, color: "rgba(255,255,255,0.3)", letterSpacing: 2, textTransform: "uppercase", px: 1, mb: 1.5, mt: 3 }}>Mon compte</Typography>
            {[
              { label: "Mon Panier",     to: "/cart",     icon: <ShoppingCartIcon sx={{ fontSize: 18 }} /> },
              { label: "Mes Favoris",    to: "/wishlist", icon: <FavoriteIcon sx={{ fontSize: 18 }} /> },
              { label: "Mes Commandes",  to: "/orders",   icon: <OrdersIcon sx={{ fontSize: 18 }} /> },
              { label: "Mon Profil",     to: "/profil",   icon: <AccountIcon sx={{ fontSize: 18 }} /> },
              { label: "Comparer",       to: "/compare",  icon: <CompareIcon sx={{ fontSize: 18 }} /> },
              ...(isVendeur ? [{ label: "Espace Vendeur", to: "/vendeur", icon: <VendeurIcon sx={{ fontSize: 18 }} /> }] : []),
            ].map(({ label, to, icon }) => (
              <Box key={to} component={Link} to={to} onClick={() => setDrawerOpen(false)}
                sx={{ display: "flex", alignItems: "center", gap: 1.5, px: 1.5, py: 1.2, mb: 0.5, borderRadius: 2.5, textDecoration: "none", transition: "all 0.2s", color: "rgba(255,255,255,0.6)", "&:hover": { bgcolor: "rgba(255,255,255,0.05)", color: "#fff" } }}>
                <Box sx={{ color: "rgba(255,255,255,0.3)" }}>{icon}</Box>
                <Typography sx={{ fontSize: 13, fontWeight: 600 }}>{label}</Typography>
              </Box>
            ))}
          </Box>

          <Box sx={{ p: 2, borderTop: "1px solid rgba(255,255,255,0.06)" }}>
            {user ? (
              <Box onClick={() => { handleLogout(); setDrawerOpen(false); }}
                sx={{ display: "flex", alignItems: "center", gap: 1.5, px: 2, py: 1.5, borderRadius: 2.5, cursor: "pointer", transition: "all 0.2s", bgcolor: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.2)", "&:hover": { bgcolor: "rgba(239,68,68,0.2)" } }}>
                <LogoutIcon sx={{ fontSize: 18, color: "#ef4444" }} />
                <Typography sx={{ fontSize: 14, fontWeight: 700, color: "#ef4444" }}>Deconnexion</Typography>
              </Box>
            ) : (
              <Box component={Link} to="/login" onClick={() => setDrawerOpen(false)}
                sx={{ display: "flex", alignItems: "center", gap: 1.5, px: 2, py: 1.5, borderRadius: 2.5, textDecoration: "none", transition: "all 0.2s", bgcolor: "#E63946", "&:hover": { bgcolor: "#c1121f" } }}>
                <LoginIcon sx={{ fontSize: 18, color: "#fff" }} />
                <Typography sx={{ fontSize: 14, fontWeight: 700, color: "#fff" }}>Connexion / Inscription</Typography>
              </Box>
            )}
          </Box>
        </Box>
      </Drawer>
    </Box>
  );
};

export default Header2;
