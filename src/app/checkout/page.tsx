"use client";

import { useState } from "react";
import Link from "next/link";
import { Lock, AlertCircle } from "lucide-react";

import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/website-layouts";
import { ProductImage } from "@/components/product-image";
import { AllergenNotice } from "@/components/allergen-notice";
import { useCart } from "@/hooks/useCart";
import { formatPrice } from "@/lib/currency";
import { calculateShipping } from "@/lib/shipping";
import { track } from "@/lib/analytics";
import {
  EMPTY_DETAILS,
  PROCESSOR,
  fieldLabel,
  validate,
  type CheckoutDetails,
  type CheckoutErrors,
} from "@/lib/checkout";
import { semantic } from "@/styles/tokens";

const FIELDS: (keyof CheckoutDetails)[][] = [
  ["email"],
  ["firstName", "lastName"],
  ["address1"],
  ["address2"],
  ["city", "region"],
  ["postcode", "country"],
];

export default function CheckoutPage() {
  const { items, total } = useCart();
  const shipping = calculateShipping(total);
  const [details, setDetails] = useState<CheckoutDetails>(EMPTY_DETAILS);
  const [errors, setErrors] = useState<CheckoutErrors>({});
  const [submitted, setSubmitted] = useState(false);

  const set = (field: keyof CheckoutDetails, value: string) => {
    setDetails((d) => ({ ...d, [field]: value }));
    if (errors[field]) setErrors((e) => ({ ...e, [field]: undefined }));
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const found = validate(details);
    setErrors(found);
    if (Object.keys(found).length > 0) {
      const first = document.querySelector<HTMLElement>("[aria-invalid='true']");
      first?.focus();
      return;
    }
    track({ name: "begin_checkout", value: total, items: items.length });
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: semantic.surface.page }}>
      <Navigation />

      <main className="flex-1 px-6 md:px-8 pt-32 md:pt-40 pb-16">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-[clamp(2rem,4vw,3rem)] mb-10" style={{ color: semantic.text.primary }}>
            Checkout
          </h1>

          {items.length === 0 ? (
            <div className="py-16 text-center">
              <p className="text-lg mb-8" style={{ color: semantic.text.secondary }}>
                There is nothing to check out.
              </p>
              <Link
                href="/products"
                className="inline-block px-10 py-4 text-[0.75rem] tracking-[0.18em] uppercase font-semibold"
                style={{ backgroundColor: semantic.text.primary, color: semantic.text.inverse }}
              >
                Shop Glow Gummies
              </Link>
            </div>
          ) : (
            <div className="grid lg:grid-cols-[1fr_340px] gap-10 lg:gap-16 items-start">
              <form onSubmit={onSubmit} noValidate>
                <h2 className="text-xl mb-6" style={{ color: semantic.text.primary }}>
                  Delivery details
                </h2>

                {FIELDS.map((row) => (
                  <div key={row.join()} className="grid sm:grid-cols-2 gap-4 mb-4">
                    {row.map((field) => {
                      const invalid = Boolean(errors[field]);
                      return (
                        <div key={field} className={row.length === 1 ? "sm:col-span-2" : ""}>
                          <label
                            htmlFor={field}
                            className="block text-xs uppercase tracking-[0.12em] mb-2"
                            style={{ color: semantic.text.muted }}
                          >
                            {fieldLabel(field)}
                          </label>
                          <input
                            id={field}
                            name={field}
                            type={field === "email" ? "email" : "text"}
                            autoComplete={
                              { email: "email", firstName: "given-name", lastName: "family-name",
                                address1: "address-line1", address2: "address-line2",
                                city: "address-level2", region: "address-level1",
                                postcode: "postal-code", country: "country-name" }[field]
                            }
                            value={details[field]}
                            onChange={(e) => set(field, e.target.value)}
                            aria-invalid={invalid}
                            aria-describedby={invalid ? `${field}-error` : undefined}
                            className="w-full px-3.5 py-3 text-sm bg-transparent"
                            style={{
                              border: `1px solid ${invalid ? semantic.state.error : semantic.border.default}`,
                              color: semantic.text.primary,
                            }}
                          />
                          {invalid && (
                            <p
                              id={`${field}-error`}
                              className="text-xs mt-1.5"
                              style={{ color: semantic.state.error }}
                            >
                              {errors[field]}
                            </p>
                          )}
                        </div>
                      );
                    })}
                  </div>
                ))}

                <h2 className="text-xl mt-10 mb-4" style={{ color: semantic.text.primary }}>
                  Payment
                </h2>

                {/* No card fields. See src/lib/checkout.ts for why. */}
                <div
                  className="flex gap-3 p-5"
                  style={{
                    backgroundColor: semantic.surface.tint,
                    border: `1px solid ${semantic.border.default}`,
                  }}
                >
                  <AlertCircle
                    className="w-4 h-4 shrink-0 mt-0.5"
                    style={{ color: semantic.accent.secondary }}
                    aria-hidden="true"
                  />
                  <div className="text-sm leading-relaxed" style={{ color: semantic.text.secondary }}>
                    {PROCESSOR.connected ? (
                      <>Payment is handled securely by {PROCESSOR.name}.</>
                    ) : (
                      <>
                        <strong style={{ color: semantic.text.primary }}>
                          No payment processor is connected yet.
                        </strong>{" "}
                        This store cannot take payment, so no card details are
                        collected here. Orders placed now are not charged and
                        will not ship.
                      </>
                    )}
                  </div>
                </div>

                {submitted && (
                  <div
                    className="mt-5 p-5 text-sm leading-relaxed"
                    style={{
                      backgroundColor: semantic.surface.raised,
                      border: `1px solid ${semantic.border.default}`,
                      color: semantic.text.secondary,
                    }}
                    role="status"
                  >
                    <strong style={{ color: semantic.text.primary }}>
                      Details captured.
                    </strong>{" "}
                    This is where the order would be handed to a payment
                    processor. Nothing has been charged and no order has been
                    placed.
                  </div>
                )}

                <button
                  type="submit"
                  className="w-full mt-6 py-4 text-[0.75rem] tracking-[0.18em] uppercase font-semibold transition-opacity hover:opacity-90 disabled:opacity-40"
                  style={{ backgroundColor: semantic.text.primary, color: semantic.text.inverse }}
                >
                  Continue to payment
                </button>

                <p
                  className="flex items-center justify-center gap-1.5 text-xs mt-3"
                  style={{ color: semantic.text.muted }}
                >
                  <Lock className="w-3 h-3" />
                  Card details are never handled by this site.
                </p>
              </form>

              <aside
                className="p-7 lg:sticky lg:top-28"
                style={{
                  backgroundColor: semantic.surface.raised,
                  border: `1px solid ${semantic.border.subtle}`,
                }}
              >
                <h2
                  className="text-xs font-semibold uppercase tracking-[0.2em] mb-6"
                  style={{ color: semantic.text.primary }}
                >
                  Your order
                </h2>

                <ul className="mb-6">
                  {items.map((item) => (
                    <li key={item.id} className="flex gap-4 mb-4">
                      <div
                        className="w-16 h-16 shrink-0 flex items-center justify-center"
                        style={{ backgroundColor: semantic.surface.sunken }}
                      >
                        <ProductImage
                          src={item.image}
                          alt={item.name}
                          width={140}
                          height={140}
                          className="h-12 w-auto object-contain"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm leading-snug" style={{ color: semantic.text.primary }}>
                          {item.name}
                        </p>
                        <p className="text-xs mt-0.5" style={{ color: semantic.text.muted }}>
                          Qty {item.quantity}
                        </p>
                      </div>
                      <span
                        className="text-sm tabular-nums"
                        style={{ color: semantic.text.primary }}
                      >
                        {formatPrice(item.price * item.quantity)}
                      </span>
                    </li>
                  ))}
                </ul>

                <dl className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <dt style={{ color: semantic.text.secondary }}>Subtotal</dt>
                    <dd className="tabular-nums" style={{ color: semantic.text.primary }}>
                      {formatPrice(total)}
                    </dd>
                  </div>
                  <div className="flex justify-between">
                    <dt style={{ color: semantic.text.secondary }}>Shipping</dt>
                    <dd style={{ color: semantic.text.secondary }}>
                      {shipping.cost === null ? shipping.label : shipping.cost === 0 ? "Free" : formatPrice(shipping.cost)}
                    </dd>
                  </div>
                  <div
                    className="flex justify-between items-baseline pt-4"
                    style={{ borderTop: `1px solid ${semantic.border.default}` }}
                  >
                    <dt className="text-base font-medium" style={{ color: semantic.text.primary }}>
                      Total
                    </dt>
                    <dd
                      className="font-[family-name:var(--font-playfair)] text-2xl tabular-nums"
                      style={{ color: semantic.text.primary }}
                    >
                      {formatPrice(total + (shipping.cost ?? 0))}
                    </dd>
                  </div>
                </dl>

                <AllergenNotice className="mt-6" />
              </aside>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
