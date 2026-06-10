// @ts-nocheck
import {
  Box, Button, CircularProgress, Container, Rating, Stack, Typography,
  Card, CardActions, CardContent, CardMedia, Grid, Chip, Slider,
  Select, MenuItem, FormControl, InputLabel, Drawer, IconButton,
  Badge, Tooltip, useTheme, Paper,
} from "@mui/material";
import React, { useState, useEffect } from "react";
import AddShoppingCartOutlinedIcon from "@mui/icons-material/AddShoppingCartOutlined";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FilterListIcon from "@mui/icons-material/FilterList";
import GridViewIcon from "@mui/icons-material/GridView";
import ViewListIcon from "@mui/icons-material/ViewList";
import CloseIcon from "@mui/icons-material/Close";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import TuneIcon from "@mui/icons-material/Tune";
import ProductDetails from "./ProductDetails";
import { useGetProductsQuery } from "../../Redux/product";
import { AnimatePresence, motion } from "framer-motion";
import { useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toggleWishlist, selectIsInWishlist } from "../../Redux/wishlist";

const brands = [
  { name: "PEUGEOT",    value: "PEUGEOT",    logo: "/logos/peugeot.png" },
  { name: "RENAULT",    value: "RENAULT",    logo: "/logos/renault.png" },
  { name: "VOLKSWAGEN", value: "VOLKSWAGEN", logo: "/logos/volkswagen.png" },
  { name: "SEAT",       value: "SEAT",       logo: "/logos/seat.png" },
  { name: "SKODA",      value: "SKODA",      logo: "/logos/skoda.png" },
  { name: "MERCEDES",   value: "MERCEDES",   logo: "/logos/mercedes.png" },
  { name: "AUDI",       value: "AUDI",       logo: "/logos/audi.png" },
  { name: "KIA",        value: "KIA",        logo: "/logos/kia.png" },
  { name: "HYUNDAI",    value: "HYUNDAI",    logo: "/logos/hyundai.png" },
  { name: "CHEVROLET",  value: "CHEVROLET",  logo: "/logos/chevrolet.png" },
  { name: "FIAT",       value: "FIAT",       logo: "/logos/fiat.png" },
  { name: "CHERY",      value: "CHERY",      logo: "/logos/chery.png" },
  { name: "GEELY",      value: "GEELY",      logo: "/logos/geely.png" },
];

// ── PRODUCT CARD ──
const ProductCard = ({ item, onQuickView, viewMode }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isWishlisted = useSelector(selectIsInWishlist(item.id));
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";

  const brandLogo = brands.find(b => b.value.toLowerCase() === item.attributes.category?.toLowerCase())?.logo;
  const price = item.attributes.productPrice;
  const discount = item.attributes.discount || 0;
  const finalPrice = discount > 0 ? (price - (price * discount) / 100).toFixed(0) : price;
  const stock = item.attributes.stock || 0;

  const handleWishlist = (e) => {
    e.stopPropagation();
    dispatch(toggleWishlist({
      id: item.id,
      productTitle: item.attributes.productTitle,
      productPrice: item.attributes.productPrice,
      discount: item.attributes.discount,
      productimg: item.attributes.productimg,
      category: item.attributes.category,
      stock: item.attributes.stock,
    }));
  };

  if (viewMode === "list") {
    return (
      <motion.div layout initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
        <Box sx={{
          display: "flex", gap: 2.5, p: 2.5, mb: 2, borderRadius: 4,
          bgcolor: isDark ? "#111" : "#fff",
          border: `1px solid ${isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)"}`,
          transition: "all 0.3s",
          "&:hover": {
            boxShadow: isDark ? "0 12px 32px rgba(0,0,0,0.4)" : "0 12px 32px rgba(0,0,0,0.08)",
            borderColor: "rgba(230,57,70,0.3)",
            transform: "translateX(4px)",
          },
        }}>
          <Box sx={{
            width: 130, height: 130, flexShrink: 0,
            bgcolor: isDark ? "#1a1a1a" : "#f5f5f5",
            borderRadius: 3, overflow: "hidden", cursor: "pointer",
            display: "flex", alignItems: "center", justifyContent: "center",
          }} onClick={() => navigate(`/product/${item.id}`)}>
            <img src={item.attributes.productimg?.data?.[0]?.attributes?.url || "/fallback-image.jpg"}
              alt={item.attributes.productTitle}
              style={{ width: "90%", height: "90%", objectFit: "contain" }} />
          </Box>
          <Box sx={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
            <Box>
              <Stack direction="row" justifyContent="space-between" alignItems="flex-start" mb={0.5}>
                <Typography fontWeight={800} fontSize={15} sx={{ cursor: "pointer", "&:hover": { color: "#E63946" }, transition: "0.2s", color: isDark ? "#fff" : "#0a0a0a" }}
                  onClick={() => navigate(`/product/${item.id}`)}>
                  {item.attributes.productTitle}
                </Typography>
                <IconButton size="small" onClick={handleWishlist} sx={{ "&:hover": { color: "#E63946" } }}>
                  {isWishlisted ? <FavoriteIcon sx={{ color: "#E63946", fontSize: 18 }} /> : <FavoriteBorderIcon sx={{ fontSize: 18 }} />}
                </IconButton>
              </Stack>
              <Rating value={item.attributes.productRating} readOnly size="small" precision={0.5} sx={{ mb: 1 }} />
              <Stack direction="row" spacing={1.5} alignItems="center">
                {discount > 0 && <Typography variant="caption" sx={{ textDecoration: "line-through", color: "#888", fontSize: 13 }}>{price} DA</Typography>}
                <Typography fontWeight={900} sx={{ color: "#E63946", fontSize: 18 }}>{finalPrice} DA</Typography>
                {discount > 0 && <Chip label={`-${discount}%`} size="small" sx={{ bgcolor: "rgba(230,57,70,0.12)", color: "#E63946", fontWeight: 800, fontSize: 11, height: 22 }} />}
              </Stack>
            </Box>
            <Stack direction="row" spacing={1.5} alignItems="center" mt={1}>
              <Chip
                label={stock > 0 ? `En stock (${stock})` : "Rupture"}
                size="small"
                sx={{ bgcolor: stock > 0 ? "rgba(16,185,129,0.1)" : "rgba(239,68,68,0.1)", color: stock > 0 ? "#10b981" : "#ef4444", fontWeight: 700, fontSize: 11 }}
              />
              <Button variant="contained" size="small" onClick={() => navigate(`/product/${item.id}`)} disabled={stock === 0}
                sx={{ bgcolor: "#E63946", borderRadius: 2, textTransform: "none", fontWeight: 700, px: 2.5, "&:hover": { bgcolor: "#c1121f" } }}>
                Acheter
              </Button>
            </Stack>
          </Box>
        </Box>
      </motion.div>
    );
  }

  return (
    <Grid item xs={6} sm={6} md={4} lg={3}>
      <motion.div layout initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.35 }}>
        <Box sx={{
          borderRadius: 4, overflow: "hidden",
          bgcolor: isDark ? "#111" : "#fff",
          border: `1px solid ${isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)"}`,
          transition: "all 0.4s cubic-bezier(0.4,0,0.2,1)",
          position: "relative",
          "&:hover": {
            transform: "translateY(-10px)",
            boxShadow: isDark ? "0 28px 56px rgba(0,0,0,0.5)" : "0 28px 56px rgba(0,0,0,0.12)",
            borderColor: "rgba(230,57,70,0.35)",
            "& .card-img": { transform: "scale(1.08)" },
            "& .quick-view": { opacity: 1, transform: "translateY(0)" },
            "& .overlay": { bgcolor: "rgba(0,0,0,0.2)" },
          },
        }}>
          {/* Image zone */}
          <Box sx={{ position: "relative", overflow: "hidden", bgcolor: isDark ? "#1a1a1a" : "#f5f5f5", height: 210, cursor: "pointer" }}
            onClick={() => navigate(`/product/${item.id}`)}>
            <Box className="card-img" component="img"
              src={item.attributes.productimg?.data?.[0]?.attributes?.url || "/fallback-image.jpg"}
              alt={item.attributes.productTitle}
              sx={{ width: "100%", height: "100%", objectFit: "contain", p: 2, transition: "transform 0.4s" }} />

            {/* Overlay */}
            <Box className="overlay" sx={{ position: "absolute", inset: 0, bgcolor: "rgba(0,0,0,0)", transition: "background 0.3s" }} />

            {/* Badges */}
            {discount > 0 && (
              <Box sx={{ position: "absolute", top: 12, left: 12, bgcolor: "#E63946", color: "#fff", borderRadius: "20px", px: 1.5, py: 0.4, fontSize: 11, fontWeight: 800, zIndex: 2 }}>
                -{discount}%
              </Box>
            )}
            {stock === 0 && (
              <Box sx={{ position: "absolute", inset: 0, bgcolor: "rgba(0,0,0,0.55)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 3 }}>
                <Chip label="Rupture de stock" sx={{ bgcolor: "#222", color: "#fff", fontWeight: 700 }} />
              </Box>
            )}

            {/* Wishlist btn */}
            <IconButton size="small" onClick={handleWishlist} sx={{
              position: "absolute", top: 10, right: 10, zIndex: 4,
              bgcolor: isDark ? "rgba(0,0,0,0.6)" : "rgba(255,255,255,0.9)",
              backdropFilter: "blur(8px)",
              width: 34, height: 34,
              "&:hover": { bgcolor: "#E63946", color: "#fff" }, transition: "0.25s",
            }}>
              {isWishlisted ? <FavoriteIcon sx={{ color: "#E63946", fontSize: 16 }} /> : <FavoriteBorderIcon sx={{ fontSize: 16 }} />}
            </IconButton>

            {/* Quick view */}
            <Button className="quick-view" variant="contained" size="small"
              sx={{
                position: "absolute", bottom: 12, left: "50%", transform: "translateX(-50%) translateY(10px)",
                bgcolor: "rgba(255,255,255,0.95)", color: "#E63946", borderRadius: "20px",
                fontWeight: 700, fontSize: 12, textTransform: "none", px: 2.5, zIndex: 4,
                opacity: 0, transition: "all 0.3s", whiteSpace: "nowrap",
                "&:hover": { bgcolor: "#E63946", color: "#fff" },
              }}
              onClick={(e) => { e.stopPropagation(); onQuickView(item); }}>
              Aperçu rapide
            </Button>
          </Box>

          {/* Content */}
          <Box sx={{ p: 2.5 }}>
            <Stack direction="row" alignItems="center" spacing={1} mb={1}>
              {brandLogo && (
                <Box sx={{ width: 24, height: 24, borderRadius: "50%", bgcolor: isDark ? "#222" : "#f0f0f0", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, p: 0.4 }}>
                  <img src={brandLogo} alt={item.attributes.category} style={{ width: "100%", objectFit: "contain" }} />
                </Box>
              )}
              <Typography variant="body2" sx={{
                fontWeight: 700, fontSize: 13, lineHeight: 1.4, color: isDark ? "#e0e0e0" : "#1a1a1a",
                display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden",
                cursor: "pointer", "&:hover": { color: "#E63946" }, transition: "0.2s",
              }} onClick={() => navigate(`/product/${item.id}`)}>
                {item.attributes.productTitle}
              </Typography>
            </Stack>

            <Rating precision={0.5} value={item.attributes.productRating} readOnly size="small" sx={{ mb: 1.2 }} />

            <Stack direction="row" spacing={1} alignItems="center" mb={2}>
              {discount > 0 && <Typography variant="caption" sx={{ textDecoration: "line-through", color: "#888", fontSize: 12 }}>{price} DA</Typography>}
              <Typography sx={{ color: "#E63946", fontWeight: 900, fontSize: 17 }}>{finalPrice} DA</Typography>
            </Stack>

            <Button onClick={() => navigate(`/product/${item.id}`)} variant="contained" fullWidth size="small" disabled={stock === 0}
              sx={{
                bgcolor: isDark ? "#1a1a1a" : "#0a0a0a", color: "#fff", borderRadius: 2.5,
                fontWeight: 700, textTransform: "none", fontSize: 13, py: 1,
                "&:hover": { bgcolor: "#E63946" }, transition: "background 0.3s",
                "&:disabled": { bgcolor: "#333", color: "#666" },
              }}>
              <AddShoppingCartOutlinedIcon sx={{ mr: 0.8, fontSize: 16 }} />
              {stock === 0 ? "Indisponible" : "Acheter maintenant"}
            </Button>
          </Box>
        </Box>
      </motion.div>
    </Grid>
  );
};

// ── MAIN COMPONENT ──
const Main = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";

  const [quickViewOpen, setQuickViewOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [filterDrawer, setFilterDrawer] = useState(false);
  const [viewMode, setViewMode] = useState("grid");
  const [sortBy, setSortBy] = useState("default");
  const [priceRange, setPriceRange] = useState([0, 100000]);
  const [minRating, setMinRating] = useState(0);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [onSaleOnly, setOnSaleOnly] = useState(false);

  const searchParams = new URLSearchParams(location.search);
  const searchQuery = searchParams.get("search")?.toLowerCase() || "";
  const categoryQuery = searchParams.get("category") || "all";
  const [brandFilter, setBrandFilter] = useState(categoryQuery);

  useEffect(() => { setBrandFilter(categoryQuery); }, [categoryQuery]);

  const { data, error, isLoading } = useGetProductsQuery("products?populate=*");

  const handleBrandChange = (val) => {
    setBrandFilter(val);
    navigate(val === "all" ? "/products" : `/products?category=${val}`);
  };

  if (isLoading) return (
    <Box sx={{ py: 16, textAlign: "center", bgcolor: isDark ? "#080808" : "#f0f2f5", minHeight: "60vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <Stack alignItems="center" spacing={2}>
        <CircularProgress sx={{ color: "#E63946" }} size={48} />
        <Typography color="text.secondary" fontWeight={600}>Chargement des produits...</Typography>
      </Stack>
    </Box>
  );

  if (error) return (
    <Container sx={{ py: 11, textAlign: "center" }}>
      <Typography variant="h6" color="error">Erreur de chargement</Typography>
    </Container>
  );

  const allProducts = data?.data || [];

  let filtered = allProducts.filter((item) => {
    const a = item.attributes;
    const price = a.productPrice;
    const discount = a.discount || 0;
    const finalPrice = discount > 0 ? price - (price * discount) / 100 : price;
    const brandMatch = brandFilter === "all" || a.category?.toLowerCase() === brandFilter.toLowerCase();
    const searchMatch = !searchQuery || a.productTitle?.toLowerCase().includes(searchQuery) || a.productDescription?.toLowerCase().includes(searchQuery);
    const priceMatch = finalPrice >= priceRange[0] && finalPrice <= priceRange[1];
    const ratingMatch = (a.productRating || 0) >= minRating;
    const stockMatch = !inStockOnly || (a.stock || 0) > 0;
    const saleMatch = !onSaleOnly || discount > 0;
    return brandMatch && searchMatch && priceMatch && ratingMatch && stockMatch && saleMatch;
  });

  filtered = [...filtered].sort((a, b) => {
    const pa = a.attributes, pb = b.attributes;
    const fa = pa.discount > 0 ? pa.productPrice - (pa.productPrice * pa.discount) / 100 : pa.productPrice;
    const fb = pb.discount > 0 ? pb.productPrice - (pb.productPrice * pb.discount) / 100 : pb.productPrice;
    if (sortBy === "price_asc") return fa - fb;
    if (sortBy === "price_desc") return fb - fa;
    if (sortBy === "rating") return (pb.productRating || 0) - (pa.productRating || 0);
    if (sortBy === "discount") return (pb.discount || 0) - (pa.discount || 0);
    return 0;
  });

  const activeFiltersCount = [inStockOnly, onSaleOnly, minRating > 0, priceRange[0] > 0 || priceRange[1] < 100000].filter(Boolean).length;
  const resetFilters = () => { setPriceRange([0, 100000]); setMinRating(0); setInStockOnly(false); setOnSaleOnly(false); };

  return (
    <Box sx={{ bgcolor: isDark ? "#080808" : "#f0f2f5", minHeight: "100vh", pt: 10, pb: 6 }}>
      <Container maxWidth="xl">

        {/* ── PAGE HEADER ── */}
        <Box sx={{ mb: 5, textAlign: "center", py: 5, position: "relative" }}>
          {/* ligne déco gauche/droite */}
          <Stack direction="row" alignItems="center" justifyContent="center" spacing={2} mb={1.5}>
            <Box sx={{ height: 2, width: 60, background: "linear-gradient(90deg, transparent, #E63946)", borderRadius: 2 }} />
            <Box sx={{ px: 1.5, py: 0.4, bgcolor: "rgba(230,57,70,0.1)", border: "1px solid rgba(230,57,70,0.3)", borderRadius: 2 }}>
              <Typography sx={{ fontSize: 10, fontWeight: 800, color: "#E63946", letterSpacing: 3, textTransform: "uppercase" }}>
                Catalogue
              </Typography>
            </Box>
            <Box sx={{ height: 2, width: 60, background: "linear-gradient(90deg, #E63946, transparent)", borderRadius: 2 }} />
          </Stack>

          <Typography variant="h3" fontWeight={900} sx={{
            color: isDark ? "#fff" : "#0a0a0a",
            letterSpacing: -1,
            lineHeight: 1,
            mb: 1.5,
          }}>
            Notre{" "}
            <Box component="span" sx={{
              color: "#E63946",
              position: "relative",
              "&::after": {
                content: '""',
                position: "absolute",
                bottom: -4,
                left: 0,
                width: "100%",
                height: 3,
                bgcolor: "#E63946",
                borderRadius: 2,
                opacity: 0.4,
              }
            }}>
              Boutique
            </Box>
          </Typography>

          <Typography variant="body2" color="text.secondary" fontWeight={500} sx={{ fontSize: 14 }}>
            {allProducts.length} produits disponibles pour toutes les marques
          </Typography>
        </Box>

        {/* ── BRAND FILTER CHIPS ── */}
        <Box sx={{
          mb: 3, p: 2.5, borderRadius: 4,
          bgcolor: isDark ? "#111" : "#fff",
          border: `1px solid ${isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)"}`,
        }}>
          <Stack direction="row" spacing={1.5} sx={{ overflowX: "auto", pb: 0.5, "&::-webkit-scrollbar": { height: 4 }, "&::-webkit-scrollbar-thumb": { bgcolor: "#E63946", borderRadius: 2 } }}>
            <Chip
              label="Tous"
              onClick={() => handleBrandChange("all")}
              sx={{
                fontWeight: 700, fontSize: 13, height: 36, px: 0.5,
                bgcolor: brandFilter === "all" ? "#E63946" : "transparent",
                color: brandFilter === "all" ? "#fff" : "text.primary",
                border: `1px solid ${brandFilter === "all" ? "#E63946" : "rgba(0,0,0,0.15)"}`,
                "&:hover": { bgcolor: brandFilter === "all" ? "#c1121f" : "rgba(230,57,70,0.08)" },
                transition: "all 0.2s",
              }}
            />
            {brands.map((b) => (
              <Chip key={b.value}
                avatar={<img src={b.logo} alt={b.name} style={{ width: 20, height: 20, objectFit: "contain" }} />}
                label={b.name}
                onClick={() => handleBrandChange(b.value)}
                sx={{
                  fontWeight: 700, fontSize: 12, height: 36,
                  bgcolor: brandFilter === b.value ? "#E63946" : "transparent",
                  color: brandFilter === b.value ? "#fff" : "text.primary",
                  border: `1px solid ${brandFilter === b.value ? "#E63946" : "rgba(0,0,0,0.12)"}`,
                  "&:hover": { bgcolor: brandFilter === b.value ? "#c1121f" : "rgba(230,57,70,0.08)" },
                  transition: "all 0.2s",
                }}
              />
            ))}
          </Stack>
        </Box>

        {/* ── TOOLBAR ── */}
        <Stack direction="row" justifyContent="space-between" alignItems="center" mb={3} flexWrap="wrap" gap={1.5}>
          <Stack direction="row" spacing={1.5} alignItems="center">
            <Badge badgeContent={activeFiltersCount} color="error">
              <Button
                variant="contained"
                startIcon={<TuneIcon />}
                onClick={() => setFilterDrawer(true)}
                sx={{
                  bgcolor: isDark ? "#1a1a1a" : "#0a0a0a", color: "#fff",
                  borderRadius: 2.5, textTransform: "none", fontWeight: 700,
                  border: activeFiltersCount > 0 ? "1px solid #E63946" : "none",
                  "&:hover": { bgcolor: "#E63946" }, transition: "0.3s",
                }}>
                Filtres
              </Button>
            </Badge>
            <Typography variant="body2" color="text.secondary" fontWeight={600}>
              {filtered.length} résultat{filtered.length > 1 ? "s" : ""}
            </Typography>
          </Stack>

          <Stack direction="row" spacing={1.5} alignItems="center">
            <FormControl size="small" sx={{ minWidth: 170 }}>
              <Select value={sortBy} onChange={(e) => setSortBy(e.target.value)}
                sx={{ borderRadius: 2.5, fontWeight: 600, fontSize: 13, bgcolor: isDark ? "#111" : "#fff" }}>
                <MenuItem value="default">Par défaut</MenuItem>
                <MenuItem value="price_asc">Prix croissant</MenuItem>
                <MenuItem value="price_desc">Prix décroissant</MenuItem>
                <MenuItem value="rating">Meilleures notes</MenuItem>
                <MenuItem value="discount">Meilleures promos</MenuItem>
              </Select>
            </FormControl>
            <Box sx={{ display: "flex", bgcolor: isDark ? "#111" : "#fff", borderRadius: 2.5, border: `1px solid ${isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)"}`, overflow: "hidden" }}>
              <Tooltip title="Vue grille">
                <IconButton onClick={() => setViewMode("grid")} size="small" sx={{ borderRadius: 0, px: 1.5, bgcolor: viewMode === "grid" ? "#E63946" : "transparent", color: viewMode === "grid" ? "#fff" : "inherit", transition: "0.2s" }}>
                  <GridViewIcon fontSize="small" />
                </IconButton>
              </Tooltip>
              <Tooltip title="Vue liste">
                <IconButton onClick={() => setViewMode("list")} size="small" sx={{ borderRadius: 0, px: 1.5, bgcolor: viewMode === "list" ? "#E63946" : "transparent", color: viewMode === "list" ? "#fff" : "inherit", transition: "0.2s" }}>
                  <ViewListIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            </Box>
          </Stack>
        </Stack>

        {/* ── PRODUCTS ── */}
        {viewMode === "grid" ? (
          <Grid container spacing={2.5}>
            <AnimatePresence>
              {filtered.map((item) => (
                <ProductCard key={item.id} item={item} onQuickView={(p) => { setSelectedProduct(p); setQuickViewOpen(true); }} viewMode="grid" />
              ))}
            </AnimatePresence>
          </Grid>
        ) : (
          <Box>
            <AnimatePresence>
              {filtered.map((item) => (
                <ProductCard key={item.id} item={item} onQuickView={(p) => { setSelectedProduct(p); setQuickViewOpen(true); }} viewMode="list" />
              ))}
            </AnimatePresence>
          </Box>
        )}

        {filtered.length === 0 && (
          <Box sx={{ textAlign: "center", py: 12 }}>
            <Typography variant="h5" color="text.secondary" mb={1} fontWeight={700}>Aucun produit trouvé</Typography>
            <Typography variant="body2" color="text.secondary" mb={3}>Essayez de modifier vos filtres</Typography>
            <Button variant="contained" onClick={resetFilters}
              sx={{ bgcolor: "#E63946", borderRadius: 2.5, textTransform: "none", fontWeight: 700, "&:hover": { bgcolor: "#c1121f" } }}>
              Réinitialiser les filtres
            </Button>
          </Box>
        )}
      </Container>

      {/* ── FILTER DRAWER ── */}
      <Drawer anchor="right" open={filterDrawer} onClose={() => setFilterDrawer(false)}
        PaperProps={{ sx: { width: 320, bgcolor: isDark ? "#0d0d0d" : "#fff" } }}>
        <Box sx={{ p: 3, height: "100%", display: "flex", flexDirection: "column" }}>
          <Stack direction="row" justifyContent="space-between" alignItems="center" mb={4}>
            <Stack direction="row" spacing={1.5} alignItems="center">
              <Box sx={{ p: 1, bgcolor: "rgba(230,57,70,0.1)", borderRadius: 2 }}>
                <TuneIcon sx={{ color: "#E63946", fontSize: 20 }} />
              </Box>
              <Typography fontWeight={900} fontSize={18} color={isDark ? "#fff" : "#0a0a0a"}>Filtres</Typography>
            </Stack>
            <Stack direction="row" spacing={1}>
              {activeFiltersCount > 0 && (
                <Button size="small" onClick={resetFilters}
                  sx={{ color: "#E63946", textTransform: "none", fontSize: 12, fontWeight: 700, borderRadius: 2 }}>
                  Réinitialiser
                </Button>
              )}
              <IconButton size="small" onClick={() => setFilterDrawer(false)}
                sx={{ bgcolor: isDark ? "#1a1a1a" : "#f5f5f5", borderRadius: 2 }}>
                <CloseIcon fontSize="small" />
              </IconButton>
            </Stack>
          </Stack>

          <Box sx={{ flex: 1, overflowY: "auto" }}>
            {/* Price */}
            <Box mb={4}>
              <Typography fontWeight={800} fontSize={14} mb={2.5} color={isDark ? "#fff" : "#0a0a0a"}>
                Fourchette de prix
              </Typography>
              <Slider value={priceRange} onChange={(_, v) => setPriceRange(v)} min={0} max={100000} step={500}
                valueLabelDisplay="auto" valueLabelFormat={(v) => `${v.toLocaleString()} DA`}
                sx={{ color: "#E63946", "& .MuiSlider-thumb": { boxShadow: "0 0 0 8px rgba(230,57,70,0.15)" } }} />
              <Stack direction="row" justifyContent="space-between" mt={1}>
                <Chip label={`${priceRange[0].toLocaleString()} DA`} size="small" sx={{ fontWeight: 700, fontSize: 11 }} />
                <Chip label={`${priceRange[1].toLocaleString()} DA`} size="small" sx={{ fontWeight: 700, fontSize: 11 }} />
              </Stack>
            </Box>

            {/* Rating */}
            <Box mb={4}>
              <Typography fontWeight={800} fontSize={14} mb={2} color={isDark ? "#fff" : "#0a0a0a"}>Note minimale</Typography>
              <Stack direction="row" spacing={1} flexWrap="wrap" gap={1}>
                {[0, 1, 2, 3, 4].map((r) => (
                  <Chip key={r} label={r === 0 ? "Toutes" : `${r}★+`} size="small"
                    onClick={() => setMinRating(r)}
                    sx={{
                      bgcolor: minRating === r ? "#E63946" : "transparent",
                      color: minRating === r ? "#fff" : "inherit",
                      border: `1px solid ${minRating === r ? "#E63946" : "rgba(0,0,0,0.15)"}`,
                      cursor: "pointer", fontWeight: 700, transition: "0.2s",
                    }} />
                ))}
              </Stack>
            </Box>

            {/* Options */}
            <Box mb={4}>
              <Typography fontWeight={800} fontSize={14} mb={2} color={isDark ? "#fff" : "#0a0a0a"}>Options</Typography>
              <Stack spacing={1.5}>
                <Box onClick={() => setInStockOnly(!inStockOnly)} sx={{
                  display: "flex", alignItems: "center", justifyContent: "space-between",
                  p: 1.5, borderRadius: 2.5, cursor: "pointer",
                  bgcolor: inStockOnly ? "rgba(16,185,129,0.1)" : isDark ? "#1a1a1a" : "#f5f5f5",
                  border: `1px solid ${inStockOnly ? "#10b981" : "transparent"}`,
                  transition: "all 0.2s",
                }}>
                  <Typography fontSize={13} fontWeight={600}>En stock uniquement</Typography>
                  <Box sx={{ width: 20, height: 20, borderRadius: "50%", bgcolor: inStockOnly ? "#10b981" : "#ccc", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    {inStockOnly && <Box sx={{ width: 8, height: 8, borderRadius: "50%", bgcolor: "#fff" }} />}
                  </Box>
                </Box>
                <Box onClick={() => setOnSaleOnly(!onSaleOnly)} sx={{
                  display: "flex", alignItems: "center", justifyContent: "space-between",
                  p: 1.5, borderRadius: 2.5, cursor: "pointer",
                  bgcolor: onSaleOnly ? "rgba(230,57,70,0.1)" : isDark ? "#1a1a1a" : "#f5f5f5",
                  border: `1px solid ${onSaleOnly ? "#E63946" : "transparent"}`,
                  transition: "all 0.2s",
                }}>
                  <Typography fontSize={13} fontWeight={600}>En promotion 🔥</Typography>
                  <Box sx={{ width: 20, height: 20, borderRadius: "50%", bgcolor: onSaleOnly ? "#E63946" : "#ccc", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    {onSaleOnly && <Box sx={{ width: 8, height: 8, borderRadius: "50%", bgcolor: "#fff" }} />}
                  </Box>
                </Box>
              </Stack>
            </Box>
          </Box>

          <Button variant="contained" fullWidth onClick={() => setFilterDrawer(false)}
            sx={{ bgcolor: "#E63946", borderRadius: 2.5, textTransform: "none", fontWeight: 800, py: 1.5, fontSize: 14, "&:hover": { bgcolor: "#c1121f" }, mt: 2 }}>
            Voir {filtered.length} résultat{filtered.length > 1 ? "s" : ""}
          </Button>
        </Box>
      </Drawer>

      <ProductDetails clickedProduct={selectedProduct} open={quickViewOpen} handleClose={() => setQuickViewOpen(false)} />
    </Box>
  );
};

export default Main;
