// @ts-nocheck
import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  Container, Typography, TextField, Button, Paper, Grid, Box,
  Divider, Stack, Alert, MenuItem, Card, CardContent,
  List, ListItem, CircularProgress,
} from '@mui/material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { selectCartItems, selectCartTotal, clearCart } from '../Redux/cart';
import { WILAYAS_COMMUNES } from '../data/wilayas_communes';
import { createPurchase } from '../api/strapi';

export default function Checkout() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const cartItems = useSelector(selectCartItems);
  const total = useSelector(selectCartTotal);

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    wilaya: '',
    commune: '',
    address: '',
    paymentMethod: 'cash_on_delivery',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [promoCode, setPromoCode] = useState('');
  const [promoDiscount, setPromoDiscount] = useState(0);
  const [promoMsg, setPromoMsg] = useState('');

  const PROMO_CODES: Record<string, number> = {
    'SAYARA10': 10,
    'BIENVENUE': 15,
    'AUTO20': 20,
  };

  const handleApplyPromo = () => {
    const code = promoCode.trim().toUpperCase();
    if (PROMO_CODES[code]) {
      setPromoDiscount(PROMO_CODES[code]);
      setPromoMsg(`✅ Code appliqué : -${PROMO_CODES[code]}%`);
    } else {
      setPromoDiscount(0);
      setPromoMsg('❌ Code invalide');
    }
  };

  const discountedTotal = total - (total * promoDiscount) / 100;

  const handleChange = (field) => (e) => {
    setFormData({ ...formData, [field]: e.target.value });
    if (field === 'wilaya') {
      setFormData({ ...formData, wilaya: e.target.value, commune: '' });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // إنشاء طلب لكل منتج في السلة عبر Firestore
      const purchasePromises = cartItems.map(async (item) => {
        const price = item.productPrice;
        const discount = item.discount || 0;
        const finalPrice = discount > 0 ? price - (price * discount) / 100 : price;
        const itemTotal = finalPrice * item.quantity;

        return createPurchase({
          name: formData.name,
          phone: String(formData.phone),
          wilaya: formData.wilaya,
          commune: formData.commune,
          address: formData.address,
          quantity: item.quantity,
          totalPrice: itemTotal,
          paymentMethod: formData.paymentMethod,
          status: formData.paymentMethod === 'cash_on_delivery' ? 'confirmed' : 'pending',
          productId: item.id,
          productTitle: item.productTitle,
        });
      });

      await Promise.all(purchasePromises);
      
      localStorage.setItem("lastOrderPhone", formData.phone);
      setSuccess(true);
      dispatch(clearCart());
      
      // الانتقال إلى صفحة النجاح بعد 2 ثانية
      setTimeout(() => {
        navigate('/products');
      }, 3000);
      
    } catch (err) {
      setError(err.message || 'حدث خطأ أثناء معالجة الطلب');
    } finally {
      setLoading(false);
    }
  };

  if (cartItems.length === 0 && !success) {
    return (
      <Container sx={{ py: 15, textAlign: 'center' }}>
        <ShoppingCartIcon sx={{ fontSize: 100, color: 'text.secondary', mb: 2 }} />
        <Typography variant="h4" gutterBottom>
          السلة فارغة
        </Typography>
        <Button variant="contained" onClick={() => navigate('/products')} sx={{ mt: 2 }}>
          تصفح المنتجات
        </Button>
      </Container>
    );
  }

  if (success) {
    return (
      <Container sx={{ py: 15, textAlign: 'center' }}>
        <CheckCircleIcon sx={{ fontSize: 100, color: 'success.main', mb: 2 }} />
        <Typography variant="h4" gutterBottom color="success.main">
          تم إتمام الطلب بنجاح! 🎉
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
          شكراً لك! سيتم التواصل معك قريباً لتأكيد الطلب.
        </Typography>
        <Typography variant="body2" color="text.secondary">
          جارٍ التحويل إلى الصفحة الرئيسية...
        </Typography>
      </Container>
    );
  }

  return (
    <Container sx={{ py: 15 }}>
      <Typography variant="h4" gutterBottom sx={{ mb: 4, fontWeight: 'bold' }}>
        🛒 إتمام الطلب
      </Typography>

      <Grid container spacing={{ xs: 2, md: 4 }}>
        {/* نموذج البيانات */}
        <Grid item xs={12} md={7}>
          <Paper sx={{ p: 4 }}>
            <Typography variant="h6" gutterBottom sx={{ mb: 3, fontWeight: 'bold' }}>
              معلومات الشحن
            </Typography>

            <form onSubmit={handleSubmit}>
              <Stack spacing={3}>
                <TextField
                  label="الاسم الكامل"
                  required
                  fullWidth
                  value={formData.name}
                  onChange={handleChange('name')}
                />

                <TextField
                  label="رقم الهاتف"
                  required
                  fullWidth
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => {
                    const onlyNums = e.target.value.replace(/\D/g, '');
                    setFormData({ ...formData, phone: onlyNums });
                  }}
                  inputProps={{ maxLength: 10 }}
                  helperText="مثال: 0555123456"
                />

                <TextField
                  select
                  label="الولاية"
                  required
                  fullWidth
                  value={formData.wilaya}
                  onChange={handleChange('wilaya')}
                >
                  {Object.keys(WILAYAS_COMMUNES).map((wilaya) => (
                    <MenuItem key={wilaya} value={wilaya}>
                      {wilaya}
                    </MenuItem>
                  ))}
                </TextField>

                <TextField
                  select
                  label="البلدية"
                  required
                  fullWidth
                  value={formData.commune}
                  onChange={handleChange('commune')}
                  disabled={!formData.wilaya}
                >
                  {WILAYAS_COMMUNES[formData.wilaya]?.map((commune) => (
                    <MenuItem key={commune} value={commune}>
                      {commune}
                    </MenuItem>
                  ))}
                </TextField>

                <TextField
                  label="العنوان التفصيلي"
                  required
                  fullWidth
                  multiline
                  rows={3}
                  value={formData.address}
                  onChange={handleChange('address')}
                  helperText="مثال: حي كذا، شارع كذا، رقم المنزل"
                />

                <TextField
                  select
                  label="طريقة الدفع"
                  required
                  fullWidth
                  value={formData.paymentMethod}
                  onChange={handleChange('paymentMethod')}
                >
                  <MenuItem value="cash_on_delivery">الدفع عند الاستلام</MenuItem>
                  <MenuItem value="credit_card">بطاقة ائتمان</MenuItem>
                  <MenuItem value="bank_transfer">تحويل بنكي</MenuItem>
                </TextField>

                {error && (
                  <Alert severity="error" sx={{ mt: 2 }}>
                    {error}
                  </Alert>
                )}

                <Button
                  type="submit"
                  variant="contained"
                  size="large"
                  fullWidth
                  disabled={loading}
                  sx={{ py: 1.5, mt: 2 }}
                >
                  {loading ? (
                    <>
                      <CircularProgress size={24} sx={{ mr: 1 }} />
                      جارٍ معالجة الطلب...
                    </>
                  ) : (
                    '✅ تأكيد الطلب'
                  )}
                </Button>
              </Stack>
            </form>
          </Paper>
        </Grid>

        {/* ملخص الطلب */}
        <Grid item xs={12} md={5}>
          <Paper sx={{ p: 4, position: 'sticky', top: 100 }}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
              ملخص الطلب
            </Typography>
            <Divider sx={{ my: 2 }} />

            <List>
              {cartItems.map((item) => {
                const price = item.productPrice;
                const discount = item.discount || 0;
                const finalPrice = discount > 0 ? price - (price * discount) / 100 : price;
                const itemTotal = finalPrice * item.quantity;

                return (
                  <ListItem key={item.id} sx={{ px: 0 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                      <Box
                        component="img"
                        src={item.productimg?.data?.[0]?.attributes?.url || '/fallback-image.jpg'}
                        alt={item.productTitle}
                        sx={{ width: 60, height: 60, objectFit: 'contain', mr: 2, borderRadius: 1 }}
                      />
                      <Box sx={{ flex: 1 }}>
                        <Typography variant="body2" fontWeight="bold">
                          {item.productTitle}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {item.quantity} × {finalPrice.toFixed(2)} DA
                        </Typography>
                      </Box>
                      <Typography variant="body2" fontWeight="bold">
                        {itemTotal.toFixed(2)} DA
                      </Typography>
                    </Box>
                  </ListItem>
                );
              })}
            </List>

            <Divider sx={{ my: 2 }} />

            <Stack spacing={1}>
              <Stack direction="row" justifyContent="space-between">
                <Typography variant="body2" color="text.secondary">المجموع الفرعي:</Typography>
                <Typography variant="body2" fontWeight="bold">{total.toFixed(2)} DA</Typography>
              </Stack>
              {promoDiscount > 0 && (
                <Stack direction="row" justifyContent="space-between">
                  <Typography variant="body2" color="success.main">Réduction ({promoDiscount}%):</Typography>
                  <Typography variant="body2" color="success.main" fontWeight="bold">
                    -{((total * promoDiscount) / 100).toFixed(2)} DA
                  </Typography>
                </Stack>
              )}
              <Stack direction="row" justifyContent="space-between">
                <Typography variant="body2" color="text.secondary">الشحن:</Typography>
                <Typography variant="body2" fontWeight="bold" color="success.main">مجاني 🎁</Typography>
              </Stack>
            </Stack>

            {/* Code promo */}
            <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
              <TextField
                size="small"
                placeholder="Code promo"
                value={promoCode}
                onChange={(e) => setPromoCode(e.target.value)}
                sx={{ flex: 1 }}
              />
              <Button
                variant="outlined"
                size="small"
                onClick={handleApplyPromo}
                sx={{ borderColor: '#E63946', color: '#E63946', '&:hover': { bgcolor: '#E63946', color: '#fff' } }}
              >
                Appliquer
              </Button>
            </Box>
            {promoMsg && (
              <Typography variant="caption" color={promoDiscount > 0 ? 'success.main' : 'error'} sx={{ mt: 0.5, display: 'block' }}>
                {promoMsg}
              </Typography>
            )}

            <Divider sx={{ my: 2 }} />

            <Stack direction="row" justifyContent="space-between" sx={{ mb: 2 }}>
              <Typography variant="h6" fontWeight="bold">الإجمالي:</Typography>
              <Typography variant="h6" color="error" fontWeight="bold">
                {discountedTotal.toFixed(2)} DA
              </Typography>
            </Stack>

            <Card sx={{ bgcolor: '#f5f5f5', mt: 2 }}>
              <CardContent>
                <Typography variant="body2" color="text.secondary">
                  💡 ستتلقى مكالمة هاتفية لتأكيد طلبك خلال 24 ساعة
                </Typography>
              </CardContent>
            </Card>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
}
