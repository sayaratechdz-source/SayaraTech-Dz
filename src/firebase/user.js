import {
  doc, setDoc, getDoc, updateDoc, serverTimestamp,
} from "firebase/firestore";
import { db } from "./firestore";

// إنشاء ملف المستخدم عند التسجيل
export const createUserProfile = async (uid, data) => {
  const ref = doc(db, "users", uid);
  await setDoc(ref, {
    uid,
    username: data.username || "",
    email: data.email || "",
    role: data.role || "acheteur",          // acheteur | vendeur | admin
    vendeurStatus: data.vendeurStatus || "none", // none | pending | approved
    createdAt: serverTimestamp(),
    ...data,
  });
};

// جلب ملف المستخدم
export const getUserProfile = async (uid) => {
  const snap = await getDoc(doc(db, "users", uid));
  return snap.exists() ? { id: snap.id, ...snap.data() } : null;
};

// تحديث ملف المستخدم
export const updateUserProfile = async (uid, data) => {
  await updateDoc(doc(db, "users", uid), { ...data, updatedAt: serverTimestamp() });
};
