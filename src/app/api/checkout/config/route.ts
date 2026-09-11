// What the browser needs to know to show the card box.
//
// This exists because the alternative -- reading
// NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY directly in a client component -- is
// resolved when the site is BUILT, not when it is loaded. A key added to the
// hosting dashboard after the last build is then invisible to the browser
// however correct the dashboard looks, and the checkout reports that no
// processor is connected until someone happens to redeploy. Asking the server
// at request time removes that trap: set the variable, reload the page, done.
//
// The publishable key is public by design. It can start a payment and nothing
// else -- it cannot read, refund, or list one -- so serving it to the browser
// is how Stripe intends it to be used.

import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  // Both spellings, because the NEXT_PUBLIC_ prefix is easy to leave off and
  // the resulting failure is silent and baffling. Without the prefix the value
  // is server-only, which is exactly why this route can still read it.
  const candidate =
    process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ?? process.env.STRIPE_PUBLISHABLE_KEY;

  // The one thing this route must never do is hand out a secret key. A
  // publishable key always starts with pk_; a secret starts with sk_. Anything
  // that is not clearly publishable is withheld and reported as absent, so a
  // key pasted into the wrong variable fails closed instead of leaking.
  if (candidate && !candidate.startsWith("pk_")) {
    console.error(
      "[checkout/config] A Stripe publishable key variable is set to a value that does not start with pk_. It has been withheld. If a secret key was pasted into it, roll that key in the Stripe dashboard now.",
    );
    return NextResponse.json({ publishableKey: null, misconfigured: true });
  }

  return NextResponse.json({
    publishableKey: candidate ?? null,
    misconfigured: false,
  });
}
