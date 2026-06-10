import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  GoogleAuthProvider,
  FacebookAuthProvider,
  signInWithPopup,
  onAuthStateChanged,
} from "firebase/auth";
import { app } from "./config";

export const auth = getAuth(app);

// تسجيل بالإيميل
export const register = (email, password) =>
  createUserWithEmailAndPassword(auth, email, password);

// تسجيل دخول بالإيميل
export const login = (email, password) =>
  signInWithEmailAndPassword(auth, email, password);

// تسجيل دخول بـ Google
export const loginWithGoogle = () => {
  const provider = new GoogleAuthProvider();
  return signInWithPopup(auth, provider);
};

// تسجيل دخول بـ Facebook
export const loginWithFacebook = () => {
  const provider = new FacebookAuthProvider();
  return signInWithPopup(auth, provider);
};

// تسجيل خروج
export const logout = () => signOut(auth);

// مراقبة حالة المصادقة
export const onAuthChange = (callback) => onAuthStateChanged(auth, callback);
