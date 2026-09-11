// The card box.
//
// Stripe's Payment Element, mounted inside the checkout form that already
// exists. It replaces the "no payment processor is connected" notice and
// nothing else -- the delivery fields, the order summary, the Place Order
// button and the layout around it are untouched.
//
// The card number never reaches this site. The element is an iframe served by
// Stripe; the page around it only ever sees a token. That is what keeps the
// store out of PCI scope.

"use client";

import { useEffect } from "react";
import { Elements, PaymentElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { loadStripe, type Appearance, type Stripe } from "@stripe/stripe-js";

import { primitive, semantic } from "@/styles/tokens";

/** Resolves to an error message, or null when Stripe has taken the payment. */
export type ConfirmPayment = (returnUrl: string) => Promise<string | null>;

/**
 * loadStripe outside the component: called once per page load, not once per
 * render. The publishable key is meant to be public -- it can only create
 * payments, never read or refund them.
 */
let stripePromise: Promise<Stripe | null> | null = null;
const getStripePromise = () => {
  const key = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
  if (!key) return null;
  stripePromise ??= loadStripe(key);
  return stripePromise;
};

/** Stripe's iframe cannot read the page's CSS, so the tokens are passed in. */
const appearance: Appearance = {
  variables: {
    colorPrimary: primitive.navy[800],
    colorBackground: primitive.neutral[0],
    colorText: primitive.navy[800],
    colorDanger: primitive.berry[500],
    fontFamily: "var(--font-inter), system-ui, sans-serif",
    fontSizeBase: "14px",
    borderRadius: "0px",
    spacingUnit: "4px",
  },
  rules: {
    ".Input": {
      border: `1px solid ${primitive.cream[400]}`,
      boxShadow: "none",
      padding: "12px 14px",
    },
    ".Input:focus": {
      border: `1px solid ${primitive.apricot[500]}`,
      boxShadow: `0 0 0 2px ${primitive.apricot[300]}`,
      outline: "none",
    },
    ".Label": {
      fontSize: "12px",
      letterSpacing: "0.12em",
      textTransform: "uppercase",
      color: primitive.neutral[500],
      marginBottom: "8px",
    },
  },
};

/**
 * Lives inside <Elements> so it can reach the hooks, and hands the confirm
 * function back up to the page. That way the existing Place Order button stays
 * exactly where it is and keeps its own submit handler -- the alternative was
 * moving the whole form inside the provider and rewriting the page around it.
 */
const ConfirmBridge = ({ onReady }: { onReady: (confirm: ConfirmPayment | null) => void }) => {
  const stripe = useStripe();
  const elements = useElements();

  useEffect(() => {
    if (!stripe || !elements) {
      onReady(null);
      return;
    }
    onReady(async (returnUrl: string) => {
      const { error } = await stripe.confirmPayment({
        elements,
        confirmParams: { return_url: returnUrl },
        // Only leave the site for methods that genuinely require it. A card
        // finishes in place, so the customer stays on this checkout.
        redirect: "if_required",
      });
      // A card decline or a validation slip is the customer's to see; anything
      // else is ours, and says nothing useful to them.
      if (error) {
        return error.type === "card_error" || error.type === "validation_error"
          ? (error.message ?? "That card was declined.")
          : "Something went wrong taking the payment.";
      }
      return null;
    });
    return () => onReady(null);
  }, [stripe, elements, onReady]);

  return null;
};

export const PaymentSection = ({
  clientSecret,
  onConfirmReady,
}: {
  clientSecret: string | null;
  onConfirmReady: (confirm: ConfirmPayment | null) => void;
}) => {
  const stripe = getStripePromise();

  if (!stripe) {
    return (
      <p className="text-sm" style={{ color: semantic.text.secondary }}>
        Card payments are not available right now.
      </p>
    );
  }

  if (!clientSecret) {
    // Reserve the height the element will take, so filling in the address does
    // not make the Place Order button jump down the page.
    return (
      <div
        className="animate-pulse"
        style={{ height: 180, backgroundColor: semantic.surface.sunken }}
        aria-hidden="true"
      />
    );
  }

  return (
    <Elements stripe={stripe} options={{ clientSecret, appearance }}>
      <PaymentElement options={{ layout: "tabs" }} />
      <ConfirmBridge onReady={onConfirmReady} />
    </Elements>
  );
};
