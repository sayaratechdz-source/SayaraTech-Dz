import {
  collection, doc, getDocs, addDoc, updateDoc,
  query, where, orderBy, serverTimestamp,
} from "firebase/firestore";
import { db } from "./firestore";

const COL = "purchases";

// ── إنشاء طلب جديد ───────────────────────────────────────
export const createPurchase = async (data) => {
  const docRef = await addDoc(collection(db, COL), {
    ...data,
    status: data.status || "pending",
    paymentMethod: data.paymentMethod || "cash_on_delivery",
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return docRef.id;
};

// ── جلب كل الطلبات (للأدمن) ──────────────────────────────
export const getAllPurchases = async () => {
  const q = query(collection(db, COL), orderBy("createdAt", "desc"));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
};

// ── جلب طلبات حسب رقم الهاتف ─────────────────────────────
export const getPurchasesByPhone = async (phone) => {
  const q = query(
    collection(db, COL),
    where("phone", "==", String(phone)),
    orderBy("createdAt", "desc")
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
};

// ── جلب طلبات حسب معرف المنتج ────────────────────────────
export const getPurchasesByProduct = async (productId) => {
  const q = query(collection(db, COL), where("productId", "==", productId));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
};

// ── تحديث حالة الطلب ─────────────────────────────────────
export const updatePurchaseStatus = async (id, status) => {
  await updateDoc(doc(db, COL, id), { status, updatedAt: serverTimestamp() });
};
