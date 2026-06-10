import { createSlice } from "@reduxjs/toolkit";

// تحميل المفضلة من localStorage
const loadWishlistFromStorage = () => {
  try {
    const serializedWishlist = localStorage.getItem("wishlist");
    if (serializedWishlist === null) {
      return [];
    }
    return JSON.parse(serializedWishlist);
  } catch (err) {
    console.error("Error loading wishlist from localStorage:", err);
    return [];
  }
};

// حفظ المفضلة في localStorage
const saveWishlistToStorage = (wishlist) => {
  try {
    const serializedWishlist = JSON.stringify(wishlist);
    localStorage.setItem("wishlist", serializedWishlist);
  } catch (err) {
    console.error("Error saving wishlist to localStorage:", err);
  }
};

const initialState = {
  items: loadWishlistFromStorage(),
};

const wishlistSlice = createSlice({
  name: "wishlist",
  initialState,
  reducers: {
    // إضافة منتج للمفضلة
    addToWishlist: (state, action) => {
      const product = action.payload;
      const exists = state.items.find((item) => item.id === product.id);

      if (!exists) {
        state.items.push({
          id: product.id,
          productTitle: product.productTitle,
          productPrice: product.productPrice,
          discount: product.discount || 0,
          productimg: product.productimg,
          category: product.category,
          stock: product.stock,
        });
        saveWishlistToStorage(state.items);
      }
    },

    // إزالة منتج من المفضلة
    removeFromWishlist: (state, action) => {
      const productId = action.payload;
      state.items = state.items.filter((item) => item.id !== productId);
      saveWishlistToStorage(state.items);
    },

    // تبديل (إضافة/حذف)
    toggleWishlist: (state, action) => {
      const product = action.payload;
      const exists = state.items.find((item) => item.id === product.id);

      if (exists) {
        state.items = state.items.filter((item) => item.id !== product.id);
      } else {
        state.items.push({
          id: product.id,
          productTitle: product.productTitle,
          productPrice: product.productPrice,
          discount: product.discount || 0,
          productimg: product.productimg,
          category: product.category,
          stock: product.stock,
        });
      }
      saveWishlistToStorage(state.items);
    },

    // تفريغ المفضلة
    clearWishlist: (state) => {
      state.items = [];
      saveWishlistToStorage(state.items);
    },
  },
});

// Selectors
export const selectWishlistItems = (state) => state.wishlist.items;

export const selectWishlistCount = (state) => state.wishlist.items.length;

export const selectIsInWishlist = (productId) => (state) => {
  return state.wishlist.items.some((item) => item.id === productId);
};

export const {
  addToWishlist,
  removeFromWishlist,
  toggleWishlist,
  clearWishlist,
} = wishlistSlice.actions;

export default wishlistSlice.reducer;
