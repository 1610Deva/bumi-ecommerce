import { useEffect, useState } from "react";
import { CartContext } from "./CartContext";

const STORAGE_KEY = "bumi-cart-v1";

// Membaca keranjang tersimpan
function loadCart() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return [];

    const parsed = JSON.parse(saved);
    if (!Array.isArray(parsed)) return [];

    return parsed
      .filter(
        (item) =>
          item &&
          typeof item.id === "string" &&
          typeof item.name === "string" &&
          typeof item.slug === "string" &&
          Number.isInteger(item.price) &&
          item.price >= 0 &&
          Number.isInteger(item.stock) &&
          item.stock > 0 &&
          Number.isInteger(item.quantity) &&
          item.quantity > 0
      )
      .map((item) => ({
        ...item,
        quantity: Math.min(item.quantity, item.stock),
      }));
  } catch {
    return [];
  }
}

export default function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState(loadCart);

  // Simpan setiap perubahan ke localStorage
  useEffect(() => {
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(cartItems)
      );
    } catch (error) {
      console.error("Failed to save cart:", error);
    }
  }, [cartItems]);

  // Menambahkan produk ke keranjang
  function addToCart(product) {
    if (
      !product ||
      !Number.isInteger(product.stock) ||
      product.stock <= 0
    ) {
      return;
    }

    setCartItems((current) => {
      const existing = current.find(
        (item) => item.id === product.id
      );

      if (existing) {
        return current.map((item) =>
          item.id === product.id
            ? {
                ...item,
                price: product.price,
                stock: product.stock,
                quantity: Math.min(
                  item.quantity + 1,
                  product.stock
                ),
              }
            : item
        );
      }

      return [
        ...current,
        {
          id: product.id,
          slug: product.slug,
          name: product.name,
          price: product.price,
          stock: product.stock,
          imageUrl: product.imageUrl,
          quantity: 1,
        },
      ];
    });
  }

  // Mengubah quantity dengan delta +1 / -1
  function updateQuantity(productId, delta) {
    setCartItems((current) =>
      current.map((item) => {
        if (item.id !== productId) return item;

        const nextQuantity = Math.max(
          1,
          Math.min(item.stock, item.quantity + delta)
        );

        return {
          ...item,
          quantity: nextQuantity,
        };
      })
    );
  }

  // Menghapus satu produk
  function removeFromCart(productId) {
    setCartItems((current) =>
      current.filter((item) => item.id !== productId)
    );
  }

  // Mengosongkan keranjang
  function clearCart() {
    setCartItems([]);
  }

  // Menghitung jumlah item dan subtotal
  const totalItems = cartItems.reduce(
    (total, item) => total + item.quantity,
    0
  );

  const subtotal = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  return (
    <CartContext.Provider
      value={{
        cartItems,
        totalItems,
        subtotal,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}