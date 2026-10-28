import { useEffect, useRef, useState } from "react";
import { Link } from "react-router";
import { Check, Package, Plus } from "lucide-react";

import { useCart } from "../hooks/useCart";
import { formatRupiah } from "../utils/format";

/**
 * Shared BUMI product card.
 * Used in both Home.jsx and Shop.jsx; no API or backend changes required.
 */
export default function ProductCard({ product }) {
  const { cartItems, addToCart } = useCart();
  const [feedback, setFeedback] = useState("");
  const [imageFailed, setImageFailed] = useState(false);
  const feedbackTimer = useRef(null);

  useEffect(() => {
    return () => {
      if (feedbackTimer.current) window.clearTimeout(feedbackTimer.current);
    };
  }, []);

  const inventory = Number(product.stock);
  const availableStock = Number.isFinite(inventory)
    ? Math.max(0, Math.floor(inventory))
    : 0;

  const inCart = Array.isArray(cartItems)
    ? cartItems.find((item) => item.id === product.id)?.quantity ?? 0
    : 0;

  const soldOut = availableStock === 0;
  const atCartLimit = !soldOut && inCart >= availableStock;
  const cannotAdd = soldOut || atCartLimit;
  const detailUrl = `/products/${product.slug}`;
  const hasImage = Boolean(product.imageUrl) && !imageFailed;

  function handleAddToCart() {
    if (cannotAdd) return;

    if (typeof addToCart !== "function") {
      setFeedback("Cart is unavailable");
      return;
    }

    try {
      // Reuse the existing CartProvider; quantity defaults to one item.
      const result = addToCart(product, 1);

      if (result === false) {
        setFeedback("Unable to add product");
        return;
      }

      setFeedback("Added to cart");
    } catch (error) {
      console.error("Unable to add to cart:", error);
      setFeedback("Unable to add product");
    }

    if (feedbackTimer.current) window.clearTimeout(feedbackTimer.current);
    feedbackTimer.current = window.setTimeout(() => setFeedback(""), 2200);
  }

  return (
    <article className="group flex h-full min-w-0 flex-col">
      {/* Image/detail link kept separate from the Add to Cart button */}
      <Link
        to={detailUrl}
        aria-label={`View details for ${product.name}`}
        className="block rounded-[4px] outline-offset-4 focus-visible:outline-2 focus-visible:outline-forest"
      >
        <div className="relative aspect-[4/5] overflow-hidden rounded-[4px] bg-[#e8e8de]">
          {hasImage ? (
            <img
              src={product.imageUrl}
              alt={product.name}
              loading="lazy"
              decoding="async"
              onError={() => setImageFailed(true)}
              className="h-full w-full object-cover transition-transform duration-500 ease-out motion-safe:group-hover:scale-[1.045] motion-reduce:transition-none"
            />
          ) : (
            <div className="flex h-full flex-col items-center justify-center gap-3 bg-[#e4e8dd] px-4 text-center text-forest/55">
              <Package size={39} strokeWidth={1.2} aria-hidden="true" />
              <span className="text-[11px]">Product photo unavailable</span>
            </div>
          )}

          <span className="absolute left-3 top-3 max-w-[calc(100%-24px)] truncate rounded-full border border-white/40 bg-ivory/95 px-3 py-1.5 text-[10px] font-medium text-forest shadow-sm">
            {product.category?.name || "Everyday Essentials"}
          </span>

          {soldOut && (
            <div className="absolute inset-0 flex items-center justify-center bg-forest/30">
              <span className="rounded-full bg-ivory px-4 py-2 text-xs font-semibold text-forest">
                Sold out
              </span>
            </div>
          )}
        </div>
      </Link>

      <div className="flex flex-1 flex-col pt-3">
        <Link
          to={detailUrl}
          className="line-clamp-2 min-h-[2.6em] text-[13px] font-medium leading-[1.3] text-charcoal transition-colors hover:text-forest focus-visible:rounded-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-forest sm:text-sm"
        >
          {product.name}
        </Link>

        <div className="mt-auto flex flex-wrap items-center justify-between gap-x-2 gap-y-2 pt-3">
          <span className="text-[12px] font-semibold text-forest sm:text-[13px]">
            {formatRupiah(product.price)}
          </span>

          <button
            type="button"
            onClick={handleAddToCart}
            disabled={cannotAdd}
            aria-label={
              soldOut
                ? `${product.name} is sold out`
                : atCartLimit
                  ? `Maximum available quantity of ${product.name} already in cart`
                  : `Add ${product.name} to cart`
            }
            className="inline-flex min-h-9 shrink-0 items-center justify-center gap-1.5 rounded-full bg-forest px-3 py-2 text-[11px] font-semibold text-white transition-colors hover:bg-[#173528] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-forest disabled:cursor-not-allowed disabled:bg-charcoal/15 disabled:text-charcoal/55 sm:text-xs"
          >
            {cannotAdd ? (
              soldOut ? "Sold out" : "Max in cart"
            ) : feedback === "Added to cart" ? (
              <>
                <Check size={13} strokeWidth={2.2} aria-hidden="true" />
                Added
              </>
            ) : (
              <>
                <Plus size={14} strokeWidth={2} aria-hidden="true" />
                Add to cart
              </>
            )}
          </button>
        </div>

        <p
          aria-live="polite"
          aria-atomic="true"
          className={`mt-2 min-h-4 text-[11px] ${
            feedback === "Added to cart"
              ? "text-forest"
              : feedback
                ? "text-red-700"
                : "text-charcoal/55"
          }`}
        >
          {feedback || (soldOut ? "Currently unavailable" : atCartLimit ? "Cart quantity reached stock limit" : "Available")}
        </p>
      </div>
    </article>
  );
}
