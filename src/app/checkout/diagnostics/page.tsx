// Configuration self-check, in plain English. Temporary: delete once payments
// are working.
//
// The distinction this page exists to draw: NEXT_PUBLIC_ values are baked into
// the browser bundle when the site is BUILT, while the server reads its
// variables fresh on every request. So a key added to Vercel after the last
// build is visible to the server and invisible to the browser, and the
// checkout shows "no payment processor is connected" while every dashboard
// setting looks correct. The two columns below make that case obvious.

"use client";

import { useEffect, useState } from "react";

// Read as a direct static reference so Next.js inlines it at build time. If it
// was not set when this deployment was built, it is the empty string here no
// matter what the dashboard says now.
const BAKED_IN_KEY = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ?? "";

interface Check {
  present?: boolean;
  looksRight?: boolean;
  mode?: string | null;
}

interface Report {
  checks: Record<string, Check> & {
    price?: { ok?: boolean; amount?: number | null; currency?: string | null; type?: string; active?: boolean; problem?: string };
  };
}

const Row = ({ ok, children }: { ok: boolean; children: React.ReactNode }) => (
  <li style={{ marginBottom: 10, lineHeight: 1.5 }}>
    <strong style={{ color: ok ? "#137333" : "#c5221f" }}>{ok ? "PASS" : "FAIL"}</strong>{" "}
    {children}
  </li>
);

export default function DiagnosticsPage() {
  const [report, setReport] = useState<Report | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    fetch("/api/checkout/diagnostics")
      .then((r) => r.json())
      .then(setReport)
      .catch(() => setFailed(true));
  }, []);

  const server = report?.checks;
  const price = server?.price;

  return (
    <main style={{ maxWidth: 720, margin: "0 auto", padding: "48px 24px", fontSize: 15 }}>
      <h1 style={{ fontSize: 24, marginBottom: 4 }}>Checkout self-check</h1>
      <p style={{ color: "#666", marginBottom: 28 }}>
        Temporary page. Delete it once card payments work.
      </p>

      <h2 style={{ fontSize: 17, marginBottom: 10 }}>1. What the browser can see</h2>
      <ul style={{ paddingLeft: 0, listStyle: "none", marginBottom: 28 }}>
        <Row ok={Boolean(BAKED_IN_KEY)}>
          The publishable key {BAKED_IN_KEY ? "was" : "was NOT"} built into this page.
          {!BAKED_IN_KEY && (
            <div style={{ color: "#c5221f", marginTop: 6 }}>
              This is why checkout says no payment processor is connected. The
              variable must be named exactly
              {" "}<code>NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY</code>, be ticked for
              Production, and then the site must be redeployed — saving it alone
              does nothing, because this value is fixed at build time.
            </div>
          )}
        </Row>
        {BAKED_IN_KEY && (
          <Row ok={BAKED_IN_KEY.startsWith("pk_")}>
            It starts with <code>{BAKED_IN_KEY.slice(0, 7)}</code>
            {BAKED_IN_KEY.startsWith("pk_")
              ? " — correct."
              : " — WRONG. A publishable key starts with pk_. If this starts with sk_, remove it immediately: that is your secret key and it is now public."}
          </Row>
        )}
      </ul>

      <h2 style={{ fontSize: 17, marginBottom: 10 }}>2. What the server can see</h2>
      {failed && <p style={{ color: "#c5221f" }}>Could not reach the self-check API.</p>}
      {!report && !failed && <p style={{ color: "#666" }}>Checking…</p>}
      {server && (
        <ul style={{ paddingLeft: 0, listStyle: "none", marginBottom: 28 }}>
          {(["NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY", "STRIPE_SECRET_KEY", "STRIPE_PRICE_ID"] as const).map((name) => {
            const c = server[name] ?? {};
            return (
              <Row key={name} ok={Boolean(c.present && c.looksRight)}>
                <code>{name}</code>{" "}
                {!c.present
                  ? "is missing from this deployment."
                  : !c.looksRight
                    ? "is set, but does not look like the right kind of value."
                    : `is set${c.mode ? ` (${c.mode} mode)` : ""}.`}
              </Row>
            );
          })}
        </ul>
      )}

      <h2 style={{ fontSize: 17, marginBottom: 10 }}>3. The price in Stripe</h2>
      {price && (
        <ul style={{ paddingLeft: 0, listStyle: "none", marginBottom: 28 }}>
          <Row ok={Boolean(price.ok)}>
            {price.ok
              ? `Stripe will charge ${price.amount} ${price.currency} — one-off, active.`
              : (price.problem ??
                `Unusable: ${price.amount} ${price.currency}, type ${price.type}, ${price.active ? "active" : "archived"}.`)}
          </Row>
        </ul>
      )}

      <p style={{ color: "#666", borderTop: "1px solid #ddd", paddingTop: 16 }}>
        Every line PASS? Card payments will work. Any FAIL line says what to fix.
      </p>
    </main>
  );
}
