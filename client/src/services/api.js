const API_URL = (import.meta.env.VITE_API_URL || "").replace(/\/$/, "");

async function request(endpoint, signal) {
  const response = await fetch(`${API_URL}${endpoint}`, {
    signal,
  });

  if (!response.ok) {
    throw new Error(`Request failed: ${response.status}`);
  }

  const result = await response.json();

  if (!result.success) {
    throw new Error(result.message || "Something went wrong");
  }

  return result.data;
}

export function getProducts({
  category = "",
  search = "",
  sort = "name",
  signal,
} = {}) {
  const params = new URLSearchParams();

  if (category) params.set("category", category);
  if (search) params.set("search", search);
  if (sort) params.set("sort", sort);

  return request(`/api/products?${params.toString()}`, signal);
}

export function getCategories(signal) {
  return request("/api/categories", signal);
}

export function getProductBySlug(slug, signal) {
  return request(`/api/products/${encodeURIComponent(slug)}`, signal);
}

export async function createCheckout(payload) {
  const response = await fetch(`${API_URL}/api/checkout`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const result = await response.json();

  if (!response.ok || !result.success) {
    throw new Error(result.message || "Checkout failed");
  }

  return result.data;
}

export async function verifyPayment(orderCode, signal) {
  const token = sessionStorage.getItem(`bumi:order-token:${orderCode}`);

  if (!token) {
    throw new Error(
      "Order access token not found. Please return using the original checkout session.",
    );
  }

  const response = await fetch(
    `${API_URL}/api/orders/${encodeURIComponent(orderCode)}/verify-payment`,
    {
      method: "POST",
      headers: {
        "x-order-access-token": token,
      },
      signal,
    },
  );

  const result = await response.json();

  if (!response.ok || !result.success) {
    throw new Error(result.message || "Unable to verify payment");
  }

  return result.data;
}
