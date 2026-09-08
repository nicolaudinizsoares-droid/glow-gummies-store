// Review invitation.
//
// Where the post-purchase message points. It states the offer, states the
// conditions attached to it, and takes the review.
//
// The form does not pretend. With no intake connected it explains that rather
// than accepting a review and dropping it -- the same call checkout makes
// about card details.

"use client";

import { useState } from "react";
import { Star, Check } from "lucide-react";

import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/website-layouts";
import { REVIEW_INTAKE, REVIEW_OFFER } from "@/lib/review-invite";
import { semantic } from "@/styles/tokens";

const FIELD =
  "w-full px-4 py-3 text-sm bg-white border outline-none focus-visible:ring-2";

export default function ReviewPage() {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (rating === 0) {
      setError("Choose a rating first.");
      return;
    }
    setError(null);
    if (!REVIEW_INTAKE.connected || !REVIEW_INTAKE.endpoint) return;

    const form = new FormData(e.currentTarget);
    try {
      await fetch(REVIEW_INTAKE.endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        // incentivized is set here, not by the reviewer: every review that
        // arrives through this page came with the offer attached.
        body: JSON.stringify({
          rating,
          title: form.get("title"),
          body: form.get("body"),
          author: form.get("author"),
          email: form.get("email"),
          order: form.get("order"),
          incentivized: true,
        }),
      });
      setSent(true);
    } catch {
      setError("That did not send. Try again in a moment.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: semantic.surface.page }}>
      <Navigation />

      <main className="flex-1 px-6 md:px-8 pt-32 md:pt-40 pb-20">
        <div className="max-w-2xl mx-auto">
          <p className="eyebrow mb-5">Write a review</p>
          <h1
            className="text-[clamp(2rem,4vw,3rem)] mb-5"
            style={{ color: semantic.text.primary }}
          >
            {REVIEW_OFFER.percentOff}% off your next order.
          </h1>
          <p className="text-base leading-relaxed mb-3" style={{ color: semantic.text.secondary }}>
            Tell other people what the gummies were actually like and we will send
            you a code for {REVIEW_OFFER.percentOff}% off your next order.
          </p>
          <p
            className="text-base leading-relaxed mb-10"
            style={{ color: semantic.text.primary }}
          >
            <strong>Say what you really think.</strong> The code is the same
            whether you give us one star or five, and we publish reviews as
            written. A wall of glowing reviews nobody believes is worth less to
            us than an honest one.
          </p>

          {sent ? (
            <div
              className="p-6 text-sm leading-relaxed"
              style={{
                backgroundColor: semantic.surface.raised,
                border: `1px solid ${semantic.border.default}`,
                color: semantic.text.secondary,
              }}
              role="status"
            >
              <strong style={{ color: semantic.text.primary }}>Thank you.</strong>{" "}
              Your review is with us. Once it is published we will email your{" "}
              {REVIEW_OFFER.percentOff}% code, valid for{" "}
              {REVIEW_OFFER.validForDays} days.
            </div>
          ) : (
            <form onSubmit={onSubmit} className="flex flex-col gap-6" noValidate>
              <fieldset className="border-0 p-0 m-0">
                <legend className="eyebrow mb-3">Your rating</legend>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setRating(i)}
                      onMouseEnter={() => setHover(i)}
                      onMouseLeave={() => setHover(0)}
                      aria-label={`${i} star${i === 1 ? "" : "s"}`}
                      aria-pressed={rating === i}
                      className="inline-flex items-center justify-center min-h-11 min-w-11"
                    >
                      <Star
                        className="w-6 h-6"
                        style={{ color: semantic.accent.metallic }}
                        fill={i <= (hover || rating) ? semantic.accent.metallic : "none"}
                      />
                    </button>
                  ))}
                </div>
              </fieldset>

              <label className="flex flex-col gap-2">
                <span className="eyebrow">Headline</span>
                <input
                  name="title"
                  required
                  maxLength={80}
                  className={FIELD}
                  style={{ borderColor: semantic.border.default, color: semantic.text.primary }}
                />
              </label>

              <label className="flex flex-col gap-2">
                <span className="eyebrow">Your review</span>
                <textarea
                  name="body"
                  required
                  rows={6}
                  maxLength={1500}
                  className={FIELD}
                  style={{ borderColor: semantic.border.default, color: semantic.text.primary }}
                />
              </label>

              <div className="grid gap-6 sm:grid-cols-2">
                <label className="flex flex-col gap-2">
                  <span className="eyebrow">Name shown</span>
                  <input
                    name="author"
                    required
                    maxLength={40}
                    className={FIELD}
                    style={{ borderColor: semantic.border.default, color: semantic.text.primary }}
                  />
                </label>
                <label className="flex flex-col gap-2">
                  <span className="eyebrow">Order number</span>
                  <input
                    name="order"
                    className={FIELD}
                    style={{ borderColor: semantic.border.default, color: semantic.text.primary }}
                  />
                </label>
              </div>

              <label className="flex flex-col gap-2">
                <span className="eyebrow">Email for your code</span>
                <input
                  name="email"
                  type="email"
                  required
                  autoComplete="email"
                  className={FIELD}
                  style={{ borderColor: semantic.border.default, color: semantic.text.primary }}
                />
              </label>

              {error && (
                <p className="text-sm" style={{ color: semantic.state.error }} role="alert">
                  {error}
                </p>
              )}

              {REVIEW_INTAKE.connected ? (
                <button
                  type="submit"
                  className="w-full py-4 text-[0.75rem] tracking-[0.18em] uppercase font-semibold transition-opacity hover:opacity-90"
                  style={{ backgroundColor: semantic.text.primary, color: semantic.text.inverse }}
                >
                  Send review
                </button>
              ) : (
                <div
                  className="p-5 text-sm leading-relaxed"
                  style={{
                    backgroundColor: semantic.surface.raised,
                    border: `1px solid ${semantic.border.default}`,
                    color: semantic.text.secondary,
                  }}
                >
                  <strong style={{ color: semantic.text.primary }}>
                    Reviews cannot be received yet.
                  </strong>{" "}
                  No intake is connected, so nothing typed here would be stored.
                  Set <code>NEXT_PUBLIC_REVIEW_ENDPOINT</code> to switch this on.
                </div>
              )}
            </form>
          )}

          <div
            className="mt-12 pt-8"
            style={{ borderTop: `1px solid ${semantic.border.subtle}` }}
          >
            <p className="eyebrow mb-4">The offer in full</p>
            <ul className="flex flex-col gap-3">
              {REVIEW_OFFER.terms.map((term) => (
                <li key={term} className="flex gap-3 text-sm leading-relaxed">
                  <Check
                    className="w-4 h-4 shrink-0 mt-1"
                    style={{ color: semantic.accent.metallic }}
                    aria-hidden="true"
                  />
                  <span style={{ color: semantic.text.secondary }}>{term}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
