import {
  collection, doc, getDocs, getDoc, addDoc, updateDoc, deleteDoc,
  query, where, orderBy, limit, serverTimestamp,
} from "firebase/firestore";
import { db } from "./firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "./storage";

const COL = "products";

// ── جلب كل المنتجات ──────────────────────────────────────
export const getProducts = async (filters = {}) => {
  let q = collection(db, COL);
  const constraints = [];

  if (filters.category && filters.category !== "all") {
    constraints.push(where("category", "==", filters.category));
  }
  if (filters.vendeurId) {
    constraints.push(where("vendeurId", "==", filters.vendeurId));
  }
  if (filters.status) {
    constraints.push(where("status", "==", filters.status));
  }

  if (constraints.length > 0) {
    q = query(collection(db, COL), ...constraints);
  }

  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
};

// ── جلب منتج واحد ────────────────────────────────────────
export const getProduct = async (id) => {
  const snap = await getDoc(doc(db, COL, id));
  return snap.exists() ? { id: snap.id, ...snap.data() } : null;
};

// ── إضافة منتج ───────────────────────────────────────────
export const addProduct = async (data, imageFile = null) => {
  let imageUrl = null;
  if (imageFile) {
    imageUrl = await uploadProductImage(imageFile);
  }

  const sku =
    data.productTitle.toLowerCase().replace(/\s+/g, "-") + "-" + Date.now();

  const docRef = await addDoc(collection(db, COL), {
    ...data,
    sku,
    imageUrl,
    productRating: data.productRating || 0,
    status: data.status || "available",
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return docRef.id;
};

// ── تعديل منتج ───────────────────────────────────────────
export const updateProduct = async (id, data, imageFile = null) => {
  let imageUrl = data.imageUrl || null;
  if (imageFile) {
    imageUrl = await uploadProductImage(imageFile);
  }
  await updateDoc(doc(db, COL, id), {
    ...data,
    imageUrl,
    updatedAt: serverTimestamp(),
  });
};

// ── حذف منتج ─────────────────────────────────────────────
export const deleteProduct = async (id) => {
  await deleteDoc(doc(db, COL, id));
};

// ── رفع صورة المنتج ──────────────────────────────────────
export const uploadProductImage = async (file) => {
  const storageRef = ref(storage, `products/${Date.now()}_${file.name}`);
  const snapshot = await uploadBytes(storageRef, file);
  return getDownloadURL(snapshot.ref);
};
