import type { Metadata } from "next";
import { Inter, Playfair_Display, Pacifico, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "@/lib/providers";
import { CartSidebar } from "@/components/cart-sidebar";

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

export const metadata: Metadata = {
  title: "Glow - Be Ready to Glow",
  description:
    "Daily beauty gummies for hair, skin and nails. Passion fruit flavor, vegetarian friendly, non-GMO and gluten free.",
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
