import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router";
import { ArrowRight, Check, CheckCircle2, Clock3, RefreshCw, ShieldCheck, ShoppingBag, XCircle, AlertCircle } from "lucide-react";

import { verifyPayment } from "../services/api";
import { formatRupiah } from "../utils/format";

const STATUS_INFO = {
  success: {
    eyebrow: "PAYMENT VERIFIED",
    title: "A better choice, made.",
    description: "Your payment has been confirmed. Thank you for choosing BUMI for your everyday essentials.",
    label: "Payment successful",
    tone: "text-[#377757]",
    background: "bg-[#e1ebde]",
    Icon: CheckCircle2,
  },
  pending: {
    eyebrow: "AWAITING CONFIRMATION",
    title: "Your order is on its way.",
    description: "We're still waiting for payment confirmation. If you've just paid, check the status again shortly.",
    label: "Payment pending",
    tone: "text-[#987229]",
    background: "bg-[#f3ebd7]",
    Icon: Clock3,
  },
  failed: {
    eyebrow: "PAYMENT NOT COMPLETED",
    title: "Let's try that again.",
    description: "This payment did not complete. Your shopping bag is still here if you'd like to start a new checkout.",
    label: "Payment unsuccessful",
    tone: "text-[#a9473f]",
    background: "bg-[#f7e5e1]",
    Icon: XCircle,
  },
};

export default function PaymentResult() {
  const [searchParams] = useSearchParams();
  const orderCode = searchParams.get("order_id") || sessionStorage.getItem("bumi:last-order-code");
  const [payment, setPayment] = useState(null);
  const [loading, setLoading] = useState(Boolean(orderCode));
  const [error, setError] = useState("");
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    if (!orderCode) return;

    const controller = new AbortController();
    verifyPayment(orderCode, controller.signal)
      .then((data) => {
        if (!controller.signal.aborted) {
          setPayment(data);
          setError("");
        }
      })
      .catch((err) => {
        if (!controller.signal.aborted) setError(err.message || "Unable to verify your transaction.");
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });

    return () => controller.abort();
  }, [orderCode, attempt]);

  function handleRetry() {
    setPayment(null);
    setError("");
    setLoading(true);
    setAttempt((current) => current + 1);
  }

  // Only backend-verified status determines the result. URL query parameters are not proof of payment.
  const storedStatus = payment?.paymentStatus;
  const status = storedStatus === "PAID"
    ? "success"
    : ["FAILED", "EXPIRED", "CANCELLED", "REFUNDED"].includes(storedStatus)
      ? "failed"
      : "pending";
  const config = STATUS_INFO[status];
  const ResultIcon = config.Icon;
  const missingId = !orderCode;
  const hasError = missingId || Boolean(error);

  return (
    <main className="mx-auto flex min-h-[74vh] max-w-[1320px] items-center justify-center px-5 py-16 md:px-10 lg:px-14">
      <section className="w-full max-w-[660px] overflow-hidden rounded-[7px] border border-forest/10 bg-white">
        <div className="px-6 py-11 text-center sm:px-12 sm:py-14">
          {loading ? (
            <div role="status" aria-live="polite" className="py-8">
              <RefreshCw size={42} className="mx-auto animate-spin text-forest" aria-hidden="true" />
              <p className="section-eyebrow mt-8 text-earth">SECURE CHECK</p>
              <h1 className="display-font mt-3 text-5xl text-forest">Verifying your payment.</h1>
              <p className="mt-5 text-sm leading-7 text-charcoal/65">We're checking your transaction directly with our payment provider.</p>
            </div>
          ) : hasError ? (
            <div role="alert" className="py-5">
              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-[#f7e5e1] text-[#a9473f]"><AlertCircle size={40} strokeWidth={1.5} aria-hidden="true" /></div>
              <p className="section-eyebrow mt-8 text-earth">VERIFICATION UNAVAILABLE</p>
              <h1 className="display-font mt-3 text-5xl text-forest">We couldn't confirm it yet.</h1>
              <p className="mx-auto mt-5 max-w-md text-sm leading-7 text-charcoal/65">{missingId ? "Order ID not found. Return through the original checkout tab to check your payment." : error}</p>
              {orderCode && <button type="button" onClick={handleRetry} className="mt-8 inline-flex items-center gap-2 rounded-full bg-forest px-7 py-3.5 text-sm font-semibold text-white"><RefreshCw size={16} /> Try verification again</button>}
              <Link to="/shop" className="mt-6 block text-xs font-semibold text-forest underline underline-offset-4">Back to collection</Link>
            </div>
          ) : payment ? (
            <>
              <div className={`mx-auto flex h-24 w-24 items-center justify-center rounded-full ${config.background} ${config.tone}`}>
                <ResultIcon size={53} strokeWidth={1.35} aria-hidden="true" />
              </div>
              <p className="section-eyebrow mt-9 text-earth">{config.eyebrow}</p>
              <h1 className="display-font mx-auto mt-3 max-w-lg text-[clamp(3.25rem,6vw,5.2rem)] leading-[.97] text-forest">{config.title}</h1>
              <p className="mx-auto mt-6 max-w-md text-sm leading-8 text-charcoal/70">{config.description}</p>
              <div className="mt-9 divide-y divide-forest/10 border-y border-forest/15 text-left">
                <div className="flex flex-wrap justify-between gap-2 py-4 text-sm"><span className="text-charcoal/60">Order number</span><span className="break-all font-medium text-forest">{payment.orderCode}</span></div>
                <div className="flex justify-between gap-3 py-4 text-sm"><span className="text-charcoal/60">Total</span><span className="font-semibold text-forest">{formatRupiah(payment.totalAmount)}</span></div>
                <div className="flex justify-between gap-3 py-4 text-sm"><span className="text-charcoal/60">Status</span><span className={`inline-flex items-center gap-1.5 font-semibold ${config.tone}`}><Check size={14} aria-hidden="true" />{config.label}</span></div>
              </div>
              <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:justify-center">
                <Link to="/shop" className="inline-flex min-h-13 items-center justify-center gap-2 rounded-full bg-forest px-7 py-3 text-sm font-semibold text-white hover:bg-[#102e25]">Continue shopping <ArrowRight size={16} aria-hidden="true" /></Link>
                {status === "pending" && <button type="button" onClick={handleRetry} className="inline-flex min-h-13 items-center justify-center gap-2 rounded-full border border-forest/20 px-6 py-3 text-sm font-semibold text-forest"><RefreshCw size={15} aria-hidden="true" /> Check status again</button>}
                {status === "failed" && <Link to="/cart" className="inline-flex min-h-13 items-center justify-center gap-2 rounded-full border border-forest/20 px-6 py-3 text-sm font-semibold text-forest"><ShoppingBag size={16} aria-hidden="true" /> Return to bag</Link>}
              </div>
            </>
          ) : (
            <div className="py-6"><p className="text-sm text-charcoal/70">No payment information was returned.</p><button type="button" onClick={handleRetry} className="mt-5 rounded-full bg-forest px-6 py-3 text-sm text-white">Check again</button></div>
          )}
        </div>
        <div className="flex items-center justify-center gap-2 border-t border-forest/10 bg-[#f3f4ec] px-5 py-5 text-center text-xs text-charcoal/60">
          <ShieldCheck size={16} className="shrink-0 text-forest" aria-hidden="true" /> Payment status verified by BUMI's server · Midtrans Sandbox
        </div>
      </section>
    </main>
  );
}
