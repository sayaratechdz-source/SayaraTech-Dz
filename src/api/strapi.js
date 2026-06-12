// ── Strapi API client ────────────────────────────────────────────────────────
const BASE = import.meta.env.VITE_STRAPI_URL || "https://backend-stdz-production.up.railway.app";
const TOKEN = import.meta.env.VITE_STRAPI_TOKEN || "";

const headers = () => ({
  "Content-Type": "application/json",
  // لا نرسل توكن للقراءة العامة
});

const authHeaders = () => {
  const token = localStorage.getItem("token") || TOKEN;
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

async function req(path, options = {}) {
  const res = await fetch(`${BASE}${path}`, options);
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err?.error?.message || `HTTP ${res.status}`);
  }
  return res.json();
}

// ════════════════════════════════════════════════════════════════
// AUTH
// ════════════════════════════════════════════════════════════════

export const strapiLogin = async (email, password) => {
  const data = await req("/api/auth/local", {
    method: "POST",
    headers: headers(),
    body: JSON.stringify({ identifier: email, password }),
  });
  // data = { jwt, user }
  return data;
};

export const strapiRegister = async (username, email, password, vendeurStatus = "acheteur") => {
  // الخطوة 1: تسجيل المستخدم
  const data = await req("/api/auth/local/register", {
    method: "POST",
    headers: headers(),
    body: JSON.stringify({ username, email, password }),
  });

  // الخطوة 2: تحديث vendeurStatus باستخدام JWT المُستلم
  if (data.jwt && data.user?.id) {
    try {
      await req(`/api/users/${data.user.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${data.jwt}`,
        },
        body: JSON.stringify({ vendeurStatus }),
      });
      // نحدث data.user محلياً
      data.user.vendeurStatus = vendeurStatus;
    } catch (e) {
      console.warn("vendeurStatus update failed:", e.message);
    }
  }

  return data;
};

export const strapiGetMe = async (jwt) => {
  return req("/api/users/me?populate=role", {
    headers: { Authorization: `Bearer ${jwt}` },
  });
};

export const strapiUpdateUser = async (id, data) => {
  return req(`/api/users/${id}`, {
    method: "PUT",
    headers: authHeaders(),
    body: JSON.stringify(data),
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
  const res = await req(qs, { headers: headers() });
  return res.data || [];
};

export const getProduct = async (id) => {
  const res = await req(`/api/products/${id}?populate=*`, { headers: headers() });
  return res.data || null;
};

export const addProduct = async (productData, imageFile = null) => {
  let imageId = null;

  if (imageFile) {
    imageId = await uploadFile(imageFile);
  }

  const payload = {
    data: {
      ...productData,
      ...(imageId ? { productimg: imageId } : {}),
    },
  };

  const res = await req("/api/products", {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify(payload),
  });
  return res.data?.id;
};

export const updateProduct = async (id, productData, imageFile = null) => {
  let imageId = null;
  if (imageFile) {
    imageId = await uploadFile(imageFile);
  }

  const payload = {
    data: {
      ...productData,
      ...(imageId ? { productimg: imageId } : {}),
    },
  };

  return req(`/api/products/${id}`, {
    method: "PUT",
    headers: authHeaders(),
    body: JSON.stringify(payload),
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
    { headers: headers() }
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

  const token = localStorage.getItem("token") || TOKEN;
  const res = await fetch(`${BASE}/api/upload`, {
    method: "POST",
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    body: formData,
  });

  if (!res.ok) throw new Error("Upload failed");
  const data = await res.json();
  return data[0]?.id;
};
