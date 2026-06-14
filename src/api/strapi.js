// ── Strapi API client ────────────────────────────────────────────────────────
const BASE = import.meta.env.VITE_STRAPI_URL || "https://backend-stdz-production.up.railway.app";

// IDs الـ roles في Strapi
export const ROLES = {
  ACHETEUR: 4,
  VENDEUR: 5,
};

const jsonHeaders = () => ({ "Content-Type": "application/json" });

const authHeaders = () => {
  const token = localStorage.getItem("token");
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

async function req(path, options = {}) {
  const res = await fetch(`${BASE}${path}`, options);
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    console.error("Strapi error:", JSON.stringify(err, null, 2));
    throw new Error(err?.error?.message || `HTTP ${res.status}`);
  }
  return res.json();
}

// ════════════════════════════════════════════════════════════════
// AUTH
// ════════════════════════════════════════════════════════════════

export const strapiLogin = async (email, password) => {
  // الخطوة 1: تسجيل الدخول والحصول على JWT
  const data = await req("/api/auth/local", {
    method: "POST",
    headers: jsonHeaders(),
    body: JSON.stringify({ identifier: email, password }),
  });

  // الخطوة 2: جلب بيانات المستخدم الكاملة مع الـ role
  const me = await req("/api/users/me?populate=role", {
    headers: { Authorization: `Bearer ${data.jwt}` },
  });

  // تحديد الدور بناءً على role.id من Strapi
  const roleId = me.role?.id;
  const role = roleId === ROLES.VENDEUR ? "vendeur" : "acheteur";

  return {
    jwt: data.jwt,
    user: {
      id: me.id,
      email: me.email,
      username: me.username,
      role,
      roleId,
    },
  };
};

export const strapiRegister = async (username, email, password, isVendeur = false) => {
  // الخطوة 1: تسجيل الحساب (Strapi يعطي Authenticated افتراضياً)
  const data = await req("/api/auth/local/register", {
    method: "POST",
    headers: jsonHeaders(),
    body: JSON.stringify({ username, email, password }),
  });

  // الخطوة 2: تعيين الـ role الصحيح (Acheteur أو Vendeur)
  const targetRoleId = isVendeur ? ROLES.VENDEUR : ROLES.ACHETEUR;
  if (data.jwt && data.user?.id) {
    try {
      await req(`/api/users/${data.user.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${data.jwt}`,
        },
        body: JSON.stringify({ role: targetRoleId }),
      });
    } catch (e) {
      console.warn("Role assignment failed:", e.message);
    }
  }

  return {
    jwt: data.jwt,
    user: {
      id: data.user.id,
      email: data.user.email,
      username: data.user.username,
      role: isVendeur ? "vendeur" : "acheteur",
      roleId: targetRoleId,
    },
  };
};

export const strapiGetMe = async (jwt) => {
  return req("/api/users/me?populate=role", {
    headers: { Authorization: `Bearer ${jwt}` },
  });
};

// ════════════════════════════════════════════════════════════════
// PRODUCTS
// ════════════════════════════════════════════════════════════════

export const getProducts = async (filters = {}) => {
  let qs = "/api/products?populate=*";
  if (filters.category && filters.category !== "all") {
    qs += `&filters[category][$eq]=${encodeURIComponent(filters.category)}`;
  }
  if (filters.vendeurId) {
    qs += `&filters[vendeurId][$eq]=${encodeURIComponent(filters.vendeurId)}`;
  }
  if (filters.search) {
    qs += `&filters[productTitle][$containsi]=${encodeURIComponent(filters.search)}`;
  }
  const res = await req(qs, { headers: jsonHeaders() });
  return res.data || [];
};

export const getProduct = async (id) => {
  const res = await req(`/api/products/${id}?populate=*`, { headers: jsonHeaders() });
  return res.data || null;
};

export const addProduct = async (productData, imageFile = null) => {
  let imageId = null;
  if (imageFile) imageId = await uploadFile(imageFile);

  const res = await req("/api/products", {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify({
      data: { ...productData, ...(imageId ? { productimg: imageId } : {}) },
    }),
  });
  return res.data?.id;
};

export const updateProduct = async (id, productData, imageFile = null) => {
  let imageId = null;
  if (imageFile) imageId = await uploadFile(imageFile);

  return req(`/api/products/${id}`, {
    method: "PUT",
    headers: authHeaders(),
    body: JSON.stringify({
      data: { ...productData, ...(imageId ? { productimg: imageId } : {}) },
    }),
  });
};

export const deleteProduct = async (id) => {
  return req(`/api/products/${id}`, {
    method: "DELETE",
    headers: authHeaders(),
  });
};

// ════════════════════════════════════════════════════════════════
// PURCHASES
// ════════════════════════════════════════════════════════════════

export const createPurchase = async (data) => {
  const res = await req("/api/purchases", {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify({ data }),
  });
  return res.data?.id;
};

export const getAllPurchases = async () => {
  const res = await req("/api/purchases?populate=*&sort=createdAt:desc", {
    headers: authHeaders(),
  });
  return res.data || [];
};

export const getPurchasesByPhone = async (phone) => {
  const res = await req(
    `/api/purchases?populate=*&filters[phone][$eq]=${encodeURIComponent(phone)}&sort=createdAt:desc`,
    { headers: jsonHeaders() }
  );
  return res.data || [];
};

export const updatePurchaseStatus = async (id, status) => {
  return req(`/api/purchases/${id}`, {
    method: "PUT",
    headers: authHeaders(),
    body: JSON.stringify({ data: { status } }),
  });
};

// ════════════════════════════════════════════════════════════════
// UPLOAD
// ════════════════════════════════════════════════════════════════

export const uploadFile = async (file) => {
  const formData = new FormData();
  formData.append("files", file);
  const token = localStorage.getItem("token");
  const res = await fetch(`${BASE}/api/upload`, {
    method: "POST",
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    body: formData,
  });
  if (!res.ok) throw new Error("Upload failed");
  const data = await res.json();
  return data[0]?.id;
};
