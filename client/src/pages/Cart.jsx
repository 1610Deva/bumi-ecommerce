import { Link } from "react-router";
import { ArrowLeft, ArrowRight, Minus, Plus, ShoppingBag, Trash2, Package } from "lucide-react";

import { useCart } from "../hooks/useCart";
import { formatRupiah } from "../utils/format";

export default function Cart() {
  const { cartItems, subtotal, updateQuantity, removeFromCart, clearCart } = useCart();
  const hasItems = cartItems.length > 0;

  if (!hasItems) {
    return (
      <main className="mx-auto flex min-h-[64vh] max-w-[1320px] flex-col items-center justify-center px-5 py-20 text-center md:px-10">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[#e5e9dd] text-forest">
          <ShoppingBag size={35} strokeWidth={1.3} aria-hidden="true" />
        </div>
        <p className="section-eyebrow mt-7 text-earth">YOUR BUMI BAG</p>
        <h1 className="display-font mt-3 text-5xl text-forest md:text-6xl">A little room for better things.</h1>
        <p className="mt-5 max-w-sm text-sm leading-7 text-charcoal/65">Your bag is empty. Discover reusable essentials for everyday living.</p>
        <Link to="/shop" className="mt-8 inline-flex items-center gap-2 rounded-full bg-forest px-7 py-3.5 text-sm font-semibold text-white">
          Shop the collection <ArrowRight size={17} aria-hidden="true" />
        </Link>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-[1320px] px-5 pb-20 pt-10 md:px-10 lg:px-14 lg:pb-28">
      <Link to="/shop" className="inline-flex items-center gap-2 text-xs font-medium text-charcoal/65 hover:text-forest">
        <ArrowLeft size={16} aria-hidden="true" /> Continue shopping
      </Link>
      <div className="mt-7 flex flex-wrap items-end justify-between gap-5 border-b border-forest/15 pb-8">
        <div>
          <p className="section-eyebrow text-earth">YOUR SELECTION</p>
          <h1 className="display-font mt-3 text-6xl leading-none text-forest md:text-7xl">Shopping <em className="editorial-serif">bag.</em></h1>
        </div>
        <p className="text-sm text-charcoal/65">{cartItems.length} distinct {cartItems.length === 1 ? "product" : "products"}</p>
      </div>

      <div className="mt-9 grid items-start gap-12 lg:grid-cols-[minmax(0,1fr)_350px] lg:gap-16">
        <section aria-label="Products in your cart" className="min-w-0">
          <div className="divide-y divide-forest/15">
            {cartItems.map((item) => {
              const stock = Math.max(0, Number(item.stock) || 0);
              const overStock = item.quantity > stock;
              return (
                <article key={item.id} className="grid grid-cols-[96px_minmax(0,1fr)] gap-4 py-6 first:pt-0 sm:grid-cols-[128px_minmax(0,1fr)] sm:gap-6">
                  <Link to={`/products/${item.slug}`} aria-label={`View ${item.name}`} className="aspect-[4/5] overflow-hidden rounded-[4px] bg-[#e5e8df]">
                    {item.imageUrl ? (
                      <img src={item.imageUrl} alt={item.name} loading="lazy" className="h-full w-full object-cover" />
                    ) : (
                      <span className="flex h-full items-center justify-center text-forest/50"><Package size={30} aria-hidden="true" /></span>
                    )}
                  </Link>
                  <div className="flex min-w-0 flex-col">
                    <Link to={`/products/${item.slug}`} className="text-base font-medium leading-snug text-forest hover:underline sm:text-lg">{item.name}</Link>
                    <p className="mt-2 text-sm text-charcoal/65">{formatRupiah(item.price)} each</p>
                    {overStock && <p className="mt-2 text-xs font-medium text-red-700">Stock changed: only {stock} available. Adjust quantity before checkout.</p>}
                    <div className="mt-auto flex flex-wrap items-end justify-between gap-3 pt-5">
                      <div className="inline-flex h-10 items-center overflow-hidden rounded-full border border-forest/20 bg-white">
                        <button type="button" onClick={() => updateQuantity(item.id, -1)} disabled={item.quantity <= 1} aria-label={`Decrease quantity of ${item.name}`} className="flex h-full w-10 items-center justify-center text-forest hover:bg-forest/5 disabled:opacity-30"><Minus size={15} /></button>
                        <span className="min-w-8 text-center text-sm font-semibold tabular-nums" aria-label={`Quantity ${item.quantity}`}>{item.quantity}</span>
                        <button type="button" onClick={() => updateQuantity(item.id, 1)} disabled={item.quantity >= stock} aria-label={`Increase quantity of ${item.name}`} className="flex h-full w-10 items-center justify-center text-forest hover:bg-forest/5 disabled:opacity-30"><Plus size={15} /></button>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-semibold text-forest sm:text-base">{formatRupiah(item.price * item.quantity)}</p>
                        <button type="button" onClick={() => removeFromCart(item.id)} className="mt-2 inline-flex items-center gap-1.5 text-xs text-charcoal/60 hover:text-red-700"><Trash2 size={13} aria-hidden="true" /> Remove</button>
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
          <button type="button" onClick={clearCart} className="mt-6 text-xs font-medium text-charcoal/65 underline underline-offset-4 hover:text-red-700">Clear shopping bag</button>
        </section>

        <aside className="rounded-[6px] border border-forest/10 bg-white p-6 sm:p-8 lg:sticky lg:top-8" aria-label="Order summary">
          <p className="section-eyebrow text-earth">ALMOST THERE</p>
          <h2 className="display-font mt-3 text-4xl text-forest">Order summary</h2>
          <div className="mt-8 flex items-center justify-between gap-4 border-b border-forest/15 pb-5 text-sm">
            <span className="text-charcoal/65">Subtotal</span>
            <span className="font-semibold text-forest">{formatRupiah(subtotal)}</span>
          </div>
          <div className="flex items-center justify-between gap-4 py-5 text-sm">
            <span className="text-charcoal/65">Shipping</span><span className="text-charcoal/65">Confirmed at checkout</span>
          </div>
          <p className="text-xs leading-6 text-charcoal/60">Your final order amount and available inventory are verified by BUMI before you proceed to Midtrans Sandbox.</p>
          <Link to="/checkout" className="mt-8 flex min-h-13 w-full items-center justify-center gap-3 rounded-full bg-forest px-6 py-3 text-sm font-semibold text-white hover:bg-[#102e25]">
            Continue to checkout <ArrowRight size={17} aria-hidden="true" />
          </Link>
          <Link to="/shop" className="mt-4 block text-center text-xs font-medium text-forest underline underline-offset-4">Discover more essentials</Link>
        </aside>
      </div>
    </main>
  );
}
