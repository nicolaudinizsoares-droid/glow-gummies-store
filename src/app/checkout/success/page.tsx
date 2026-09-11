// Order confirmation.
//
// This page creates nothing. It reads the PaymentIntent's status and reports
// it, and that is all it is allowed to do: anyone can type this URL, refresh
// it, or share it, and a customer who pays may close the tab before ever
// arriving. Payment is recorded by Stripe; whatever fulfilment is connected
// later must read it from there, never from a page load.

"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { CheckCircle2, Clock, AlertCircle } from "lucide-react";
import { loadStripe } from "@stripe/stripe-js";

import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/website-layouts";
import { REVIEW_OFFER } from "@/lib/review-invite";
import { semantic } from "@/styles/tokens";

type State =
  | { kind: "loading" }
  | { kind: "paid" }
  | { kind: "processing" }
  | { kind: "failed"; message: string };

const Confirmation = () => {
  const params = useSearchParams();
  const [state, setState] = useState<State>({ kind: "loading" });

  useEffect(() => {
    const secret = params.get("payment_intent_client_secret");

    // Arriving without a client secret is normal -- a card finishes in place
    // and we redirect here ourselves. Say the calm thing.
    if (!secret) {
      setState({ kind: "paid" });
      return;
    }

    let cancelled = false;
    (async () => {
      // The key comes from the server at request time, the same way the
      // checkout gets it, rather than from the build-time environment.
      const config = (await fetch("/api/checkout/config")
        .then((r) => r.json())
        .catch(() => null)) as { publishableKey: string | null } | null;
      const key = config?.publishableKey;
      if (!key || cancelled) {
        if (!cancelled) setState({ kind: "paid" });
        return;
      }
      const stripe = await loadStripe(key);
      if (!stripe || cancelled) return;
      const { paymentIntent } = await stripe.retrievePaymentIntent(secret);
      if (cancelled) return;
      switch (paymentIntent?.status) {
        case "succeeded":
          setState({ kind: "paid" });
          break;
        case "processing":
          setState({ kind: "processing" });
          break;
        default:
          setState({
            kind: "failed",
            message: "That payment did not go through. You have not been charged.",
          });
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [params]);

  if (state.kind === "loading") {
    return (
      <p className="text-base" style={{ color: semantic.text.secondary }}>
        Checking your payment…
      </p>
    );
  }

  if (state.kind === "failed") {
    return (
      <>
        <AlertCircle className="w-8 h-8 mb-6" style={{ color: semantic.state.error }} />
        <h1 className="text-[clamp(2rem,4vw,3rem)] mb-5" style={{ color: semantic.text.primary }}>
          That did not go through.
        </h1>
        <p className="text-base mb-8" style={{ color: semantic.text.secondary }}>
          {state.message}
        </p>
        <Link
          href="/checkout"
          className="inline-block px-10 py-4 text-[0.75rem] tracking-[0.18em] uppercase font-semibold"
          style={{ backgroundColor: semantic.text.primary, color: semantic.text.inverse }}
        >
          Try again
        </Link>
      </>
    );
  }

  const processing = state.kind === "processing";

  return (
    <>
      {processing ? (
        <Clock className="w-8 h-8 mb-6" style={{ color: semantic.accent.metallic }} />
      ) : (
        <CheckCircle2 className="w-8 h-8 mb-6" style={{ color: semantic.accent.metallic }} />
      )}
      <h1 className="text-[clamp(2rem,4vw,3rem)] mb-5" style={{ color: semantic.text.primary }}>
        {processing ? "Payment on its way." : "Thank you."}
      </h1>
      <p className="text-base leading-relaxed mb-4" style={{ color: semantic.text.secondary }}>
        {processing
          ? "Your bank is still confirming this one. We will email you as soon as it clears, and your order goes out then."
          : "Your payment went through and your order is being prepared. A confirmation email is on its way."}
      </p>
      <p className="text-sm leading-relaxed mb-10" style={{ color: semantic.text.muted }}>
        Gummies usually arrive within a few days. Once you have tried them,{" "}
        <Link href="/review" className="underline underline-offset-2" style={{ color: semantic.text.primary }}>
          a review gets you {REVIEW_OFFER.percentOff}% off your next order
        </Link>
        .
      </p>
      <Link
        href="/products"
        className="inline-block px-10 py-4 text-[0.75rem] tracking-[0.18em] uppercase font-semibold"
        style={{ backgroundColor: semantic.text.primary, color: semantic.text.inverse }}
      >
        Keep shopping
      </Link>
    </>
  );
};

export default function CheckoutSuccessPage() {
  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: semantic.surface.page }}>
      <Navigation />
      <main className="flex-1 px-6 md:px-8 pt-32 md:pt-40 pb-20">
        <div className="max-w-xl mx-auto">
          <Suspense
            fallback={
              <p className="text-base" style={{ color: semantic.text.secondary }}>
                Checking your payment…
              </p>
            }
          >
            <Confirmation />
          </Suspense>
        </div>
      </main>
      <Footer />
    </div>
  );
}
