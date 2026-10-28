import { useEffect, useState } from "react";
import { Link, useParams } from "react-router";
import { ArrowLeft, ArrowRight, Check, Leaf, Package, ShoppingBag, ShieldCheck } from "lucide-react";

import { getProductBySlug } from "../services/api";
import { useCart } from "../hooks/useCart";
import { formatRupiah } from "../utils/format";

function ProductDetailContent({ slug }) {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [imageError, setImageError] = useState(false);
  const [notice, setNotice] = useState("");
  const { cartItems, addToCart } = useCart();

  useEffect(() => {
    const controller = new AbortController();
    getProductBySlug(slug, controller.signal)
      .then((data) => {
        if (!controller.signal.aborted) setProduct(data);
      })
      .catch((err) => {
        if (!controller.signal.aborted) setError(err.message || "Unable to load product.");
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });

    return () => controller.abort();
  }, [slug]);

  const availableStock = Math.max(0, Number(product?.stock) || 0);
  const inCart = cartItems.find((item) => item.id === product?.id)?.quantity || 0;
  const soldOut = availableStock === 0;
  const atLimit = !soldOut && inCart >= availableStock;

  function handleAdd() {
    if (!product || soldOut || atLimit) return;
    try {
      const result = addToCart(product);
      if (result === false) {
        setNotice("This product could not be added to your cart.");
        return;
      }
      setNotice("Added to your cart.");
    } catch {
      setNotice("This product could not be added to your cart.");
    }
  }

  if (loading) {
    return (
      <main className="mx-auto max-w-[1320px] px-5 py-12 md:px-10 lg:px-14" aria-busy="true">
        <div className="grid animate-pulse gap-10 lg:grid-cols-2">
          <div className="aspect-[4/5] bg-[#e5e8df]" />
          <div className="space-y-6 py-12">
            <div className="h-4 w-32 bg-[#e5e8df]" />
            <div className="h-16 w-3/4 bg-[#e5e8df]" />
            <div className="h-5 w-1/3 bg-[#e5e8df]" />
            <div className="h-28 w-full bg-[#e5e8df]" />
          </div>
        </div>
      </main>
    );
  }

  if (error || !product) {
    return (
      <main className="mx-auto max-w-[1320px] px-5 py-28 text-center md:px-10">
        <p className="section-eyebrow text-earth">PRODUCT UNAVAILABLE</p>
        <h1 className="display-font mt-4 text-5xl text-forest">We couldn't find this essential.</h1>
        <p className="mt-4 text-sm text-charcoal/65">{error || "This product might no longer be available."}</p>
        <Link to="/shop" className="mt-8 inline-flex items-center gap-2 rounded-full bg-forest px-6 py-3 text-sm text-white">
          <ArrowLeft size={16} /> Back to collection
        </Link>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-[1320px] px-5 pb-20 pt-7 md:px-10 lg:px-14 lg:pb-28">
      <nav aria-label="Breadcrumb" className="mb-7 flex flex-wrap items-center gap-2 text-xs text-charcoal/60">
        <Link to="/" className="hover:text-forest">Home</Link><span>/</span>
        <Link to="/shop" className="hover:text-forest">Shop</Link><span>/</span>
        <span className="text-forest" aria-current="page">{product.name}</span>
      </nav>

      <div className="grid items-start gap-9 lg:grid-cols-[1.07fr_.93fr] lg:gap-16">
        <div className="relative aspect-[4/5] overflow-hidden rounded-[6px] bg-[#e7e9e1]">
          {product.imageUrl && !imageError ? (
            <img src={product.imageUrl} alt={product.name} onError={() => setImageError(true)} className="h-full w-full object-cover" />
          ) : (
            <div className="flex h-full flex-col items-center justify-center gap-4 text-forest/55">
              <Package size={64} strokeWidth={1.1} aria-hidden="true" />
              <p className="text-sm">Product photo unavailable</p>
            </div>
          )}
          <span className="absolute left-5 top-5 rounded-full bg-ivory/95 px-4 py-2 text-[11px] font-medium text-forest">
            {product.category?.name || "Everyday Essentials"}
          </span>
        </div>

        <section className="lg:sticky lg:top-7 lg:pt-7">
          <p className="section-eyebrow text-earth">BETTER EVERYDAY ESSENTIALS</p>
          <h1 className="display-font mt-4 text-[clamp(3.2rem,5vw,5.7rem)] leading-[.98] tracking-[-.025em] text-forest">
            {product.name}
          </h1>
          <p className="mt-6 text-2xl font-semibold text-forest">{formatRupiah(product.price)}</p>
          <div className="mt-7 h-px bg-forest/15" />
          <p className="mt-7 max-w-lg whitespace-pre-line text-sm leading-8 text-charcoal/75">
            {product.description || "A thoughtfully selected essential for everyday living."}
          </p>

          {product.sustainabilityInfo && (
            <div className="mt-8 flex items-start gap-3 rounded-[6px] bg-[#e7eade] p-5">
              <Leaf size={20} className="mt-0.5 shrink-0 text-forest" aria-hidden="true" />
              <div>
                <p className="text-xs font-semibold uppercase tracking-[.13em] text-forest">A more considered choice</p>
                <p className="mt-2 whitespace-pre-line text-sm leading-7 text-charcoal/75">{product.sustainabilityInfo}</p>
              </div>
            </div>
          )}

          <p className="mt-8 flex items-center gap-2 text-sm text-charcoal/70">
            <span className={`h-2 w-2 rounded-full ${soldOut ? "bg-red-500" : "bg-[#6a8a62]"}`} />
            {soldOut ? "Currently out of stock" : `${availableStock} available · ${inCart} in your cart`}
          </p>

          <div className="mt-5 grid gap-3 sm:grid-cols-[1fr_auto]">
            <button
              type="button"
              onClick={handleAdd}
              disabled={soldOut || atLimit}
              className="inline-flex min-h-14 items-center justify-center gap-3 rounded-full bg-forest px-7 text-sm font-semibold text-white transition-colors hover:bg-[#102e25] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-forest disabled:cursor-not-allowed disabled:bg-charcoal/20 disabled:text-charcoal/60"
            >
              {soldOut ? "Sold out" : atLimit ? "Stock limit reached" : "Add to cart"}
              {!soldOut && !atLimit && <ShoppingBag size={18} aria-hidden="true" />}
            </button>
            <Link to="/cart" className="inline-flex min-h-14 items-center justify-center gap-2 rounded-full border border-forest/25 px-7 text-sm font-semibold text-forest hover:bg-forest/5">
              View cart <ArrowRight size={17} aria-hidden="true" />
            </Link>
          </div>
          <p role="status" aria-live="polite" className="mt-3 flex min-h-5 items-center gap-2 text-xs text-forest">
            {notice && <><Check size={14} aria-hidden="true" />{notice}</>}
          </p>

          <div className="mt-10 flex items-start gap-3 border-t border-forest/15 pt-6 text-xs leading-6 text-charcoal/65">
            <ShieldCheck size={20} className="shrink-0 text-forest" aria-hidden="true" />
            <p>Payments are handled securely through Midtrans Sandbox for the BUMI demo. Final stock and prices are checked again during checkout.</p>
          </div>
        </section>
      </div>

      <div className="mt-16 border-t border-forest/15 pt-8">
        <Link to="/shop" className="inline-flex items-center gap-2 text-sm font-semibold text-forest hover:underline">
          <ArrowLeft size={17} aria-hidden="true" /> Explore more essentials
        </Link>
      </div>
    </main>
  );
}

export default function ProductDetail() {
  const { slug } = useParams();
  return <ProductDetailContent key={slug} slug={slug} />;
}
