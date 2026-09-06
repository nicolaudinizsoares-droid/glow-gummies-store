import type { Metadata } from "next";
import { Inter, Playfair_Display, Pacifico, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "@/lib/providers";
import { CartSidebar } from "@/components/cart-sidebar";
import { SITE_URL, SITE_NAME } from "@/lib/site";

// Body copy
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

// Display headings - the high-contrast serif from the packaging
const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
});

// Stand-in for the Glow script wordmark until the real logo asset is dropped in
const pacifico = Pacifico({
  variable: "--font-pacifico",
  weight: "400",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const DESCRIPTION =
  "Daily beauty gummies for hair, skin and nails. Passion fruit flavor, two gummies a day. Non-GMO, gluten free and made in the USA.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Glow — Be Ready to Glow",
    template: "%s | Glow",
  },
  description: DESCRIPTION,
  applicationName: SITE_NAME,
  openGraph: {
    type: "website",
    siteName: SITE_NAME,
    title: "Glow — Be Ready to Glow",
    description: DESCRIPTION,
    url: SITE_URL,
    // 1200x630. summary_large_image and every chat unfurl letterbox to
    // roughly 1.91:1; the portrait poster this replaced was cropped through
    // the middle, losing the headline and most of the bottle.
    images: [{ url: "/products/glow-og.jpg", width: 1200, height: 630, alt: "Glow Hair, Skin & Nails gummies beside a halved passion fruit" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Glow — Be Ready to Glow",
    description: DESCRIPTION,
    images: ["/products/glow-og.jpg"],
  },
  alternates: { canonical: "/" },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} ${playfair.variable} ${pacifico.variable} ${geistMono.variable} antialiased`}
      >
        <Providers>
          {children}
          <CartSidebar />
        </Providers>
      </body>
    </html>
  );
}
