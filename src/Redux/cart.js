import { createSlice } from "@reduxjs/toolkit";

// تحميل السلة من localStorage عند بدء التشغيل
const loadCartFromStorage = () => {
  try {
    const serializedCart = localStorage.getItem("cart");
    if (serializedCart === null) {
      return [];
    }
    return JSON.parse(serializedCart);
  } catch (err) {
    console.error("Error loading cart from localStorage:", err);
    return [];
  }
};

// حفظ السلة في localStorage
const saveCartToStorage = (cart) => {
  try {
    const serializedCart = JSON.stringify(cart);
    localStorage.setItem("cart", serializedCart);
  } catch (err) {
    console.error("Error saving cart to localStorage:", err);
  }
};

const initialState = {
  items: loadCartFromStorage(),
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    // إضافة منتج للسلة
    addToCart: (state, action) => {
      const product = action.payload;
      const existingItem = state.items.find((item) => item.id === product.id);

      if (existingItem) {
        // زيادة الكمية إذا كان المنتج موجود
        existingItem.quantity += product.quantity || 1;
      } else {
        // إضافة منتج جديد
        state.items.push({
          id: product.id,
          productTitle: product.productTitle,
          productPrice: product.productPrice,
          discount: product.discount || 0,
          productimg: product.productimg,
          category: product.category,
          stock: product.stock,
          quantity: product.quantity || 1,
        });
      }
      saveCartToStorage(state.items);
    },

    // إزالة منتج من السلة
    removeFromCart: (state, action) => {
      const productId = action.payload;
      state.items = state.items.filter((item) => item.id !== productId);
      saveCartToStorage(state.items);
    },

    // تحديث كمية المنتج
    updateQuantity: (state, action) => {
      const { id, quantity } = action.payload;
      const item = state.items.find((item) => item.id === id);
      if (item && quantity > 0 && quantity <= item.stock) {
        item.quantity = quantity;
        saveCartToStorage(state.items);
      }
    },

    // تفريغ السلة بالكامل
    clearCart: (state) => {
      state.items = [];
      saveCartToStorage(state.items);
    },

    // زيادة الكمية
    incrementQuantity: (state, action) => {
      const productId = action.payload;
      const item = state.items.find((item) => item.id === productId);
      if (item && item.quantity < item.stock) {
        item.quantity += 1;
        saveCartToStorage(state.items);
      }
    },

    // تقليل الكمية
    decrementQuantity: (state, action) => {
      const productId = action.payload;
      const item = state.items.find((item) => item.id === productId);
      if (item && item.quantity > 1) {
        item.quantity -= 1;
        saveCartToStorage(state.items);
      }
    },
  },
});

// Selectors
export const selectCartItems = (state) => state.cart.items;

export const selectCartTotal = (state) => {
  return state.cart.items.reduce((total, item) => {
    const price = item.productPrice;
    const discount = item.discount || 0;
    const finalPrice = discount > 0 ? price - (price * discount) / 100 : price;
    return total + finalPrice * item.quantity;
  }, 0);
};

export const selectCartCount = (state) => {
  return state.cart.items.reduce((count, item) => count + item.quantity, 0);
};

export const {
  addToCart,
  removeFromCart,
  updateQuantity,
  clearCart,
  incrementQuantity,
  decrementQuantity,
} = cartSlice.actions;

export default cartSlice.reducer;
