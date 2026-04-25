import type { Metadata } from "next";
import { Manrope, Cormorant_Garamond } from "next/font/google";
import "./globals.css";
import { getContactConfig } from '@/lib/content';
import FloatingContact from '@/components/FloatingContact';
import ExitIntentPopup from '@/components/ExitIntentPopup';

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
  title: "LODHA SADAHALLI — Luxury Residences",
  description:
    "Discover LODHA SADAHALLI — premium luxury residences offering world-class amenities, sustainable living, and exceptional design.",
  openGraph: {
    title: "LODHA SADAHALLI — Luxury Residences",
    description:
      "Discover LODHA SADAHALLI — premium luxury residences offering world-class amenities, sustainable living, and exceptional design.",
    type: "website",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const contact = await getContactConfig();

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "RealEstateAgent",
    "name": "Lodha Sadahalli",
    "description": "Premium luxury residences offering world-class amenities, sustainable living, and exceptional design.",
    "priceRange": "₹3.5 Cr+",
    "telephone": contact?.phoneNumber || "+919999999999",
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Bangalore",
      "addressRegion": "Karnataka",
      "addressCountry": "IN"
    }
  };
  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      </head>
      <body className={`${manrope.variable} ${cormorant.variable} antialiased`}>
        {children}
        <FloatingContact contact={contact} />
        <ExitIntentPopup />
      </body>
    </html>
  );
}
