// @ts-nocheck
import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  Container, Typography, Button, Grid, IconButton,
  Box, Divider, Stack, useTheme, Chip,
} from '@mui/material';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import LocalShippingOutlinedIcon from '@mui/icons-material/LocalShippingOutlined';
import { motion, AnimatePresence } from 'framer-motion';
import {
  selectCartItems, selectCartTotal,
  removeFromCart, incrementQuantity, decrementQuantity, clearCart,
} from '../Redux/cart';

export default function Cart() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const cartItems = useSelector(selectCartItems);
  const total = useSelector(selectCartTotal);

  if (!cartItems || cartItems.length === 0) {
    return (
      <Box sx={{ minHeight: '70vh', display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: isDark ? '#0a0a0a' : '#f8f9fb' }}>
        <Box sx={{ textAlign: 'center' }}>
          <ShoppingCartOutlinedIcon sx={{ fontSize: 80, color: 'rgba(0,0,0,0.1)', mb: 2 }} />
          <Typography variant="h5" fontWeight={700} mb={1}>Votre panier est vide</Typography>
          <Typography color="text.secondary" mb={3} fontSize={14}>Vous n'avez pas encore ajouté de produits</Typography>
          <Button
            variant="contained"
            onClick={() => navigate('/products')}
            sx={{ bgcolor: '#E63946', borderRadius: '30px', px: 4, textTransform: 'none', fontWeight: 700, '&:hover': { bgcolor: '#c1121f' } }}
          >
            Parcourir les produits
          </Button>
        </Box>
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: '80vh', bgcolor: isDark ? '#0a0a0a' : '#f8f9fb', py: 6 }}>
      <Container maxWidth="lg">
        {/* Title */}
        <Stack direction="row" alignItems="center" spacing={1.5} mb={4}>
          <ShoppingCartOutlinedIcon sx={{ color: '#E63946', fontSize: 28 }} />
          <Typography variant="h5" fontWeight={800}>Mon Panier</Typography>
          <Chip label={cartItems.length} size="small" sx={{ bgcolor: '#E63946', color: '#fff', fontWeight: 700 }} />
        </Stack>

        <Grid container spacing={3} alignItems="flex-start">
          {/* Items list */}
          <Grid item xs={12} md={8}>
            <AnimatePresence>
              {cartItems.map((item) => {
                const price = item.productPrice || 0;
                const discount = item.discount || 0;
                const finalPrice = discount > 0 ? price - (price * discount) / 100 : price;
                const imgUrl = item.productimg?.data?.[0]?.attributes?.url || '/fallback-image.jpg';

                return (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.25 }}
                  >
                    <Box
                      sx={{
                        display: 'flex',
                        gap: 2,
                        p: 2,
                        mb: 2,
                        borderRadius: 3,
                        bgcolor: isDark ? '#161616' : '#fff',
                        border: `1px solid ${isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.06)'}`,
                        transition: 'box-shadow 0.3s',
                        '&:hover': { boxShadow: '0 8px 24px rgba(0,0,0,0.08)' },
                      }}
                    >
                      {/* Image */}
                      <Box
                        sx={{
                          width: { xs: 80, sm: 110 },
                          height: { xs: 80, sm: 110 },
                          flexShrink: 0,
                          borderRadius: 2,
                          bgcolor: isDark ? '#1a1a1a' : '#f5f5f5',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          overflow: 'hidden',
                          cursor: 'pointer',
                        }}
                        onClick={() => navigate(`/product/${item.id}`)}
                      >
                        <img src={imgUrl} alt={item.productTitle} style={{ width: '100%', height: '100%', objectFit: 'contain', padding: 8 }} />
                      </Box>

                      {/* Info */}
                      <Box sx={{ flex: 1, minWidth: 0 }}>
                        <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                          <Box sx={{ flex: 1, mr: 1 }}>
                            <Typography
                              fontWeight={700}
                              fontSize={14}
                              sx={{ cursor: 'pointer', '&:hover': { color: '#E63946' }, transition: '0.2s' }}
                              onClick={() => navigate(`/product/${item.id}`)}
                              noWrap
                            >
                              {item.productTitle}
                            </Typography>
                            {item.category && (
                              <Typography variant="caption" color="text.secondary">{item.category}</Typography>
                            )}
                          </Box>
                          <IconButton
                            size="small"
                            onClick={() => dispatch(removeFromCart(item.id))}
                            sx={{ color: 'text.secondary', '&:hover': { color: '#E63946', bgcolor: 'rgba(230,57,70,0.08)' }, borderRadius: 2 }}
                          >
                            <DeleteOutlineIcon fontSize="small" />
                          </IconButton>
                        </Stack>

                        <Stack direction="row" spacing={1} alignItems="center" mt={1}>
                          {discount > 0 && (
                            <Typography variant="caption" sx={{ textDecoration: 'line-through', color: 'text.secondary' }}>
                              {price.toFixed(2)} DA
                            </Typography>
                          )}
                          <Typography fontWeight={800} fontSize={15} sx={{ color: '#E63946' }}>
                            {finalPrice.toFixed(2)} DA
                          </Typography>
                          {discount > 0 && (
                            <Chip label={`-${discount}%`} size="small" sx={{ bgcolor: 'rgba(230,57,70,0.1)', color: '#E63946', fontWeight: 700, fontSize: 10, height: 20 }} />
                          )}
                        </Stack>

                        {/* Quantity + subtotal */}
                        <Stack direction="row" justifyContent="space-between" alignItems="center" mt={1.5}>
                          <Stack direction="row" alignItems="center" spacing={0.5}
                            sx={{
                              border: `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`,
                              borderRadius: '20px',
                              px: 0.5,
                            }}
                          >
                            <IconButton size="small" onClick={() => dispatch(decrementQuantity(item.id))} disabled={item.quantity <= 1}
                              sx={{ width: 28, height: 28 }}>
                              <RemoveIcon sx={{ fontSize: 14 }} />
                            </IconButton>
                            <Typography fontWeight={700} fontSize={14} sx={{ minWidth: 24, textAlign: 'center' }}>
                              {item.quantity}
                            </Typography>
                            <IconButton size="small" onClick={() => dispatch(incrementQuantity(item.id))} disabled={item.quantity >= (item.stock || 1000)}
                              sx={{ width: 28, height: 28 }}>
                              <AddIcon sx={{ fontSize: 14 }} />
                            </IconButton>
                          </Stack>

                          <Typography fontWeight={700} fontSize={14} color="text.secondary">
                            Sous-total: <Box component="span" sx={{ color: isDark ? '#fff' : '#111' }}>{(finalPrice * item.quantity).toFixed(2)} DA</Box>
                          </Typography>
                        </Stack>
                      </Box>
                    </Box>
                  </motion.div>
                );
              })}
            </AnimatePresence>

            <Button
              variant="text"
              size="small"
              onClick={() => dispatch(clearCart())}
              sx={{ color: 'text.secondary', textTransform: 'none', fontSize: 12, '&:hover': { color: '#E63946' } }}
            >
              Vider le panier
            </Button>
          </Grid>

          {/* Summary */}
          <Grid item xs={12} md={4}>
            <Box
              sx={{
                p: 3,
                borderRadius: 3,
                bgcolor: isDark ? '#161616' : '#fff',
                border: `1px solid ${isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.06)'}`,
                position: 'sticky',
                top: 90,
              }}
            >
              <Typography fontWeight={800} fontSize={16} mb={2}>Récapitulatif</Typography>
              <Divider sx={{ mb: 2 }} />

              <Stack spacing={1.5} mb={2}>
                <Stack direction="row" justifyContent="space-between">
                  <Typography fontSize={13} color="text.secondary">Articles ({cartItems.reduce((s, i) => s + i.quantity, 0)})</Typography>
                  <Typography fontSize={13} fontWeight={600}>{total.toFixed(2)} DA</Typography>
                </Stack>
                <Stack direction="row" justifyContent="space-between">
                  <Stack direction="row" alignItems="center" spacing={0.5}>
                    <LocalShippingOutlinedIcon sx={{ fontSize: 14, color: '#10b981' }} />
                    <Typography fontSize={13} color="text.secondary">Livraison</Typography>
                  </Stack>
                  <Typography fontSize={13} fontWeight={600} color="#10b981">Gratuite</Typography>
                </Stack>
              </Stack>

              <Divider sx={{ mb: 2 }} />

              <Stack direction="row" justifyContent="space-between" mb={3}>
                <Typography fontWeight={800} fontSize={16}>Total</Typography>
                <Typography fontWeight={800} fontSize={18} sx={{ color: '#E63946' }}>{total.toFixed(2)} DA</Typography>
              </Stack>

              <Button
                variant="contained"
                fullWidth
                endIcon={<ArrowForwardIcon />}
                onClick={() => navigate('/checkout')}
                sx={{
                  bgcolor: '#E63946',
                  borderRadius: '12px',
                  py: 1.5,
                  fontWeight: 700,
                  textTransform: 'none',
                  fontSize: 15,
                  mb: 1.5,
                  '&:hover': { bgcolor: '#c1121f' },
                }}
              >
                Passer la commande
              </Button>

              <Button
                variant="outlined"
                fullWidth
                onClick={() => navigate('/products')}
                sx={{
                  borderRadius: '12px',
                  py: 1.2,
                  textTransform: 'none',
                  fontWeight: 600,
                  fontSize: 13,
                  borderColor: isDark ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.15)',
                  color: 'text.secondary',
                  '&:hover': { borderColor: '#E63946', color: '#E63946' },
                }}
              >
                Continuer mes achats
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
