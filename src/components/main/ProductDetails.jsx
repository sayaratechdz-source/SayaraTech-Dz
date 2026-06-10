import {
  Box,
  Button,
  Dialog,
  IconButton,
  Stack,
  Typography,
  Rating,
  useTheme,
  Alert,
  Snackbar,
} from "@mui/material";
import { Close, AddShoppingCart } from "@mui/icons-material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useDispatch } from "react-redux";
import { addToCart } from "../../Redux/cart";

const ProductDetails = ({ clickedProduct, open, handleClose }) => {
  const [selectedImg, setSelectedImg] = useState(0);
  const [showSuccess, setShowSuccess] = useState(false);
  const navigate = useNavigate();
  const theme = useTheme();
  const dispatch = useDispatch();

  if (!clickedProduct) return null;

  const images = clickedProduct?.attributes?.productimg?.data || [];
  const mainImage =
    images.length > 0 ? images[selectedImg]?.attributes?.url : "/fallback-image.png";

  const price = clickedProduct?.attributes?.productPrice || 0;
  const discount = clickedProduct?.attributes?.discount || 0;
  const finalPrice = discount > 0 ? (price - (price * discount) / 100).toFixed(2) : price;
  const stock = clickedProduct?.attributes?.stock || 0;

  const handleAddToCart = () => {
    dispatch(
      addToCart({
        id: clickedProduct.id,
        productTitle: clickedProduct.attributes.productTitle,
        productPrice: clickedProduct.attributes.productPrice,
        discount: clickedProduct.attributes.discount,
        productimg: clickedProduct.attributes.productimg,
        category: clickedProduct.attributes.category,
        stock: clickedProduct.attributes.stock,
        quantity: 1,
      })
    );
    setShowSuccess(true);
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        component: motion.div,
        initial: { opacity: 0, scale: 0.9 },
        animate: { opacity: 1, scale: 1 },
        exit: { opacity: 0, scale: 0.9 },
        transition: { duration: 0.3 },
        sx: {
          borderRadius: 3,
          overflow: "hidden",
          boxShadow: theme.shadows[10],
        },
      }}
    >
      <IconButton
        sx={{
          position: "absolute",
          top: 12,
          right: 12,
          zIndex: 2,
          backgroundColor: "rgba(255,255,255,0.9)",
          "&:hover": { backgroundColor: "rgba(255,255,255,1)" },
        }}
        onClick={handleClose}
      >
        <Close />
      </IconButton>

      <Box
        sx={{
          p: { xs: 3, md: 5 },
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          gap: 4,
          bgcolor: "#fafafa",
        }}
      >
        {/* صور المنتج */}
        <Box sx={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center" }}>
          <Box
            component="img"
            src={mainImage}
            alt="product"
            sx={{
              width: "100%",
              maxHeight: 400,
              objectFit: "contain",
              borderRadius: 2,
              boxShadow: "0 10px 20px rgba(0,0,0,0.15)",
            }}
          />

          {images.length > 1 && (
            <Stack direction="row" spacing={1} sx={{ mt: 2, overflowX: "auto", px: 0.5 }}>
              {images.map((img, index) => (
                <Box
                  key={img.id}
                  component="img"
                  src={img.attributes.url}
                  alt={`Thumbnail ${index}`}
                  onClick={() => setSelectedImg(index)}
                  sx={{
                    width: 60,
                    height: 60,
                    borderRadius: 2,
                    cursor: "pointer",
                    border:
                      selectedImg === index
                        ? `2px solid ${theme.palette.error.main}`
                        : "2px solid transparent",
                    opacity: selectedImg === index ? 1 : 0.7,
                    transition: "0.3s",
                    "&:hover": { opacity: 1, transform: "scale(1.1)" },
                  }}
                />
              ))}
            </Stack>
          )}
        </Box>

        {/* تفاصيل المنتج */}
        <Box sx={{ flex: 1, display: "flex", flexDirection: "column" }}>
          <Typography variant="h4" gutterBottom sx={{ fontWeight: 600 }}>
            {clickedProduct?.attributes?.productTitle}
          </Typography>

          <Stack direction="row" spacing={2} alignItems="center" mb={1}>
            {discount > 0 && (
              <Typography
                variant="body1"
                sx={{ textDecoration: "line-through", color: "text.secondary" }}
              >
                {price}     DA
              </Typography>
            )}
            <Typography variant="h5" color="error" gutterBottom sx={{ fontWeight: 700 }}>
              {finalPrice}     DA
            </Typography>
          </Stack>

          <Rating
            value={clickedProduct?.attributes?.productRating || 0}
            precision={0.5}
            readOnly
            sx={{ mb: 2 }}
          />

          <Typography variant="body1" paragraph sx={{ lineHeight: 1.6 }}>
            {clickedProduct?.attributes?.productDescription || "لا يوجد وصف متاح"}
          </Typography>

          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            المخزون المتاح: {stock}
          </Typography>

          <Stack direction="row" spacing={2} sx={{ mt: "auto" }}>
            <Button
              variant="contained"
              size="large"
              fullWidth
              startIcon={<AddShoppingCart />}
              disabled={stock === 0}
              sx={{
                py: 1.5,
                fontWeight: 600,
                background: theme.palette.success.main,
                "&:hover": { background: theme.palette.success.dark },
                borderRadius: 2,
                boxShadow: "0 5px 15px rgba(0,0,0,0.2)",
              }}
              onClick={handleAddToCart}
            >
              {stock > 0 ? "إضافة للسلة" : "غير متوفر"}
            </Button>

            <Button
              variant="outlined"
              size="large"
              fullWidth
              sx={{
                py: 1.5,
                fontWeight: 600,
                borderRadius: 2,
              }}
              onClick={() => {
                handleClose();
                navigate(`/product/${clickedProduct.id}`);
              }}
            >
              التفاصيل الكاملة
            </Button>
          </Stack>
        </Box>
      </Box>

      {/* إشعار النجاح */}
      <Snackbar
        open={showSuccess}
        autoHideDuration={3000}
        onClose={() => setShowSuccess(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={() => setShowSuccess(false)} severity="success" sx={{ width: '100%' }}>
          تمت إضافة المنتج إلى السلة بنجاح! 🎉
        </Alert>
      </Snackbar>
    </Dialog>
  );
};

export default ProductDetails;
