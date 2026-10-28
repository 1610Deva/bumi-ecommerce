import { useState } from "react";
import { Link } from "react-router";
import { ArrowLeft, ArrowRight, LockKeyhole, Package, ShieldCheck, Sprout } from "lucide-react";

import { useCart } from "../hooks/useCart";
import { formatRupiah } from "../utils/format";
import { createCheckout } from "../services/api";

const inputClass = "mt-2 w-full rounded-[5px] border border-forest/20 bg-white px-4 py-3.5 text-sm text-charcoal outline-none transition-colors placeholder:text-charcoal/35 focus:border-forest focus:ring-2 focus:ring-forest/10";

export default function Checkout() {
  const { cartItems, subtotal } = useCart();
  const [form, setForm] = useState({
    customerName: "",
    customerEmail: "",
    customerPhone: "",
    shippingAddress: "",
  });
  const [processing, setProcessing] = useState(false);
  const [checkoutError, setCheckoutError] = useState("");

  const cartUnavailable = cartItems.some(
    (item) => !Number.isInteger(item.quantity) || item.quantity < 1 || item.quantity > Number(item.stock)
  );

  function handleChange(event) {
    const { name, value } = event.target;
    setForm((previous) => ({ ...previous, [name]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    if (processing || cartItems.length === 0 || cartUnavailable) return;

    setProcessing(true);
    setCheckoutError("");

    try {
      const payload = {
        customerName: form.customerName.trim(),
        customerEmail: form.customerEmail.trim(),
        customerPhone: form.customerPhone.trim(),
        shippingAddress: form.shippingAddress.trim(),
        items: cartItems.map((item) => ({
          productId: item.id,
          quantity: item.quantity,
        })),
      };

      const result = await createCheckout(payload);

      if (!result?.orderCode || !result?.orderAccessToken || !result?.redirectUrl) {
        throw new Error("Checkout response is incomplete. Please try again.");
      }

      // Required for guest-order verification after Midtrans redirects back.
      // Keep the same origin (e.g. ngrok URL) through checkout and return.
      sessionStorage.setItem("bumi:last-order-code", result.orderCode);
      sessionStorage.setItem(
        `bumi:order-token:${result.orderCode}`,
        result.orderAccessToken
      );

      window.location.assign(result.redirectUrl);
    } catch (error) {
      setCheckoutError(error.message || "Unable to create payment session.");
      setProcessing(false);
    }
  }

  if (cartItems.length === 0) {
    return (
      <main className="mx-auto max-w-[1320px] px-5 py-24 text-center md:px-10">
        <p className="section-eyebrow text-earth">CHECKOUT</p>
        <h1 className="display-font mt-4 text-5xl text-forest">Your bag is empty.</h1>
        <p className="mt-5 text-sm text-charcoal/65">Find your next everyday essential in our collection.</p>
        <Link to="/shop" className="mt-8 inline-flex items-center gap-2 rounded-full bg-forest px-7 py-3.5 text-sm text-white">Browse products <ArrowRight size={16} /></Link>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-[1320px] px-5 pb-20 pt-10 md:px-10 lg:px-14 lg:pb-28">
      <Link to="/cart" className="inline-flex items-center gap-2 text-xs font-medium text-charcoal/65 hover:text-forest">
        <ArrowLeft size={16} aria-hidden="true" /> Back to shopping bag
      </Link>

      <div className="mt-7 border-b border-forest/15 pb-8">
        <p className="section-eyebrow text-earth">JUST ONE MORE STEP</p>
        <h1 className="display-font mt-3 text-6xl leading-none text-forest md:text-7xl">Checkout<span className="text-earth">.</span></h1>
        <p className="mt-4 max-w-xl text-sm leading-7 text-charcoal/65">Your next thoughtful choices are nearly yours. Add your details and continue to our secure payment partner.</p>
      </div>

      <div className="mt-10 grid items-start gap-10 lg:grid-cols-[minmax(0,1fr)_370px] lg:gap-16">
        <form id="checkout-form" onSubmit={handleSubmit} className="space-y-9">
          <section>
            <div className="flex items-baseline gap-3 border-b border-forest/15 pb-4">
              <span className="display-font text-3xl text-earth">01</span>
              <h2 className="text-lg font-semibold text-forest">Contact information</h2>
            </div>
            <div className="mt-6 grid gap-5 sm:grid-cols-2">
              <label className="block text-xs font-medium text-forest" htmlFor="customerName">
                Full name <span aria-hidden="true">*</span>
                <input id="customerName" name="customerName" autoComplete="name" value={form.customerName} onChange={handleChange} required maxLength={100} placeholder="Your full name" className={inputClass} />
              </label>
              <label className="block text-xs font-medium text-forest" htmlFor="customerPhone">
                Phone number <span aria-hidden="true">*</span>
                <input id="customerPhone" name="customerPhone" type="tel" autoComplete="tel" value={form.customerPhone} onChange={handleChange} required minLength={9} maxLength={20} placeholder="08xxxxxxxxxx" className={inputClass} />
              </label>
              <label className="block text-xs font-medium text-forest sm:col-span-2" htmlFor="customerEmail">
                Email address <span aria-hidden="true">*</span>
                <input id="customerEmail" name="customerEmail" type="email" autoComplete="email" value={form.customerEmail} onChange={handleChange} required maxLength={254} placeholder="you@example.com" className={inputClass} />
              </label>
            </div>
          </section>

          <section>
            <div className="flex items-baseline gap-3 border-b border-forest/15 pb-4">
              <span className="display-font text-3xl text-earth">02</span>
              <h2 className="text-lg font-semibold text-forest">Delivery details</h2>
            </div>
            <label className="mt-6 block text-xs font-medium text-forest" htmlFor="shippingAddress">
              Shipping address <span aria-hidden="true">*</span>
              <textarea id="shippingAddress" name="shippingAddress" autoComplete="street-address" value={form.shippingAddress} onChange={handleChange} required minLength={10} maxLength={500} rows={5} placeholder="Street, building, city, province, postal code" className={`${inputClass} resize-y`} />
            </label>
            <p className="mt-2 text-xs leading-6 text-charcoal/55">For this Sandbox demo, no physical shipment is arranged.</p>
          </section>

          <section>
            <div className="flex items-baseline gap-3 border-b border-forest/15 pb-4">
              <span className="display-font text-3xl text-earth">03</span>
              <h2 className="text-lg font-semibold text-forest">Secure payment</h2>
            </div>
            <div className="mt-6 flex items-start gap-4 rounded-[6px] bg-[#e8ebe1] p-5">
              <ShieldCheck size={24} className="shrink-0 text-forest" aria-hidden="true" />
              <div>
                <p className="text-sm font-semibold text-forest">Midtrans Sandbox</p>
                <p className="mt-1 text-xs leading-6 text-charcoal/70">You'll be redirected to Midtrans to choose a simulated payment method. No real money will be charged.</p>
              </div>
            </div>
          </section>

          {cartUnavailable && (
            <div role="alert" className="rounded-[5px] border border-red-200 bg-red-50 p-4 text-sm text-red-800">
              Some quantities exceed the stock currently recorded in your bag. <Link to="/cart" className="font-semibold underline">Update your bag</Link> before checkout.
            </div>
          )}

          {checkoutError && (
            <div role="alert" className="rounded-[5px] border border-red-200 bg-red-50 p-4 text-sm leading-6 text-red-800">
              {checkoutError}
            </div>
          )}

          <button type="submit" disabled={processing || cartUnavailable} className="flex min-h-14 w-full items-center justify-center gap-3 rounded-full bg-forest px-7 text-sm font-semibold text-white transition-colors hover:bg-[#102e25] disabled:cursor-not-allowed disabled:opacity-50 lg:max-w-sm">
            {processing ? "Creating secure payment..." : "Continue to payment"}
            {!processing && <ArrowRight size={17} aria-hidden="true" />}
          </button>
          <p className="flex items-start gap-2 text-xs leading-6 text-charcoal/55"><LockKeyhole size={16} className="mt-1 shrink-0" aria-hidden="true" /> Order details are verified by our backend before payment. Your order may be rejected if stock changes.</p>
        </form>

        <aside className="rounded-[6px] border border-forest/10 bg-white p-6 sm:p-7 lg:sticky lg:top-8" aria-label="Checkout summary">
          <p className="section-eyebrow text-earth">YOUR THOUGHTFUL PICKS</p>
          <h2 className="display-font mt-3 text-4xl text-forest">Your order</h2>
          <div className="mt-6 divide-y divide-forest/10">
            {cartItems.map((item) => (
              <div key={item.id} className="flex gap-3 py-4">
                <div className="h-[74px] w-[62px] shrink-0 overflow-hidden rounded-[3px] bg-[#e5e8df]">
                  {item.imageUrl ? <img src={item.imageUrl} alt="" className="h-full w-full object-cover" /> : <span className="flex h-full items-center justify-center text-forest/50"><Package size={20} aria-hidden="true" /></span>}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold leading-5 text-forest">{item.name}</p>
                  <p className="mt-2 text-xs text-charcoal/60">Qty {item.quantity}</p>
                </div>
                <p className="shrink-0 text-xs font-semibold text-forest">{formatRupiah(item.price * item.quantity)}</p>
              </div>
            ))}
          </div>
          <div className="mt-4 flex items-center justify-between border-t border-forest/15 pt-6 text-sm">
            <span className="text-charcoal/65">Subtotal</span><span className="font-semibold text-forest">{formatRupiah(subtotal)}</span>
          </div>
          <p className="mt-3 text-xs leading-6 text-charcoal/60">Shipping and the final transaction total are verified on the server.</p>
          <div className="mt-7 flex items-center gap-3 border-t border-forest/10 pt-5 text-forest">
            <Sprout size={21} strokeWidth={1.5} aria-hidden="true" />
            <span className="text-xs leading-5">Small, thoughtful choices. Every day.</span>
          </div>
        </aside>
      </div>
    </main>
  );
}
