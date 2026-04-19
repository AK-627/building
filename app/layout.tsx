import type { Metadata } from "next";
import { Manrope, Cormorant_Garamond } from "next/font/google";
import "./globals.css";

const manrope = Manrope({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const cormorant = Cormorant_Garamond({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "LODHA MIRABELLE — Luxury Residences",
  description:
    "Discover LODHA MIRABELLE — premium luxury residences offering world-class amenities, sustainable living, and exceptional design.",
  openGraph: {
    title: "LODHA MIRABELLE — Luxury Residences",
    description:
      "Discover LODHA MIRABELLE — premium luxury residences offering world-class amenities, sustainable living, and exceptional design.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${manrope.variable} ${cormorant.variable} antialiased bg-white text-stone-900 font-sans`}>
        {children}
      </body>
    </html>
  );
}
