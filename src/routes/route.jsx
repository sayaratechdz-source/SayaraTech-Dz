// @ts-nocheck
import { Routes, Route, Navigate } from "react-router-dom";
import App from "../App";
import Home from "../pages/Home";
import Main from "../components/main/main";
import ProductPage from "../pages/ProductPage";
import Cart from "../pages/Cart";
import Checkout from "../pages/Checkout";
import Login from "../pages/Login";
import SignUp from "../pages/SignUp";
import Wishlist from "../pages/Wishlist";
import Promotions from "../pages/Promotions";
import MyOrders from "../pages/MyOrders";
import Compare from "../pages/Compare";
import VendeurDashboard from "../pages/VendeurDashboard";
import Profil from "../pages/Profil";
import AuthCallback from "../pages/AuthCallback";
import About from "../pages/About";

function ProtectedRoute({ children }) {
  const token = localStorage.getItem("token");
  const user  = JSON.parse(localStorage.getItem("user") || "{}");
  if (!token || !user?.id) return <Navigate to="/login" replace />;
  return children;
}

function VendeurRoute({ children }) {
  const token = localStorage.getItem("token");
  const user  = JSON.parse(localStorage.getItem("user") || "{}");
  if (!token || !user?.id) return <Navigate to="/login" replace />;
  if (user.role !== "vendeur") return <Navigate to="/" replace />;
  return children;
}

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/login"  element={<Login />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/auth/callback/:provider" element={<AuthCallback />} />
      <Route path="/about" element={<About />} />

      {/* Espace vendeur — layout propre sans header/footer */}
      <Route path="/vendeur" element={<VendeurRoute><VendeurDashboard /></VendeurRoute>} />

      <Route path="/" element={<App />}>
        <Route index element={<Home />} />
        <Route path="products"   element={<Main />} />
        <Route path="product/:id" element={<ProductPage />} />
        <Route path="cart"       element={<Cart />} />
        <Route path="checkout"   element={<ProtectedRoute><Checkout /></ProtectedRoute>} />
        <Route path="wishlist"   element={<Wishlist />} />
        <Route path="promotions" element={<Promotions />} />
        <Route path="orders"     element={<ProtectedRoute><MyOrders /></ProtectedRoute>} />
        <Route path="compare"    element={<Compare />} />
        <Route path="profil"     element={<ProtectedRoute><Profil /></ProtectedRoute>} />
      </Route>
    </Routes>
  );
}
