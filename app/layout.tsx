import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://ebirthy.wisedev.online';

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: "ebirthy — Swiss Editorial Birthday Celebration Studio",
    template: "%s | ebirthy"
  },
  description: "Create and share precision-crafted interactive birthday celebration scenes with blowable candles, secret gift parcels, voice notes, photo archives, and 300 DPI keepsake posters.",
  applicationName: "ebirthy",
  authors: [{ name: "ebirthy Studio", url: BASE_URL }],
  creator: "ebirthy",
  publisher: "ebirthy",
  keywords: [
    "birthday celebration",
    "interactive birthday card",
    "birthday studio",
    "digital celebration scene",
    "birthday poster maker",
    "blowable cake candles online",
    "keepsake poster exporter",
    "personalized birthday letter",
    "ebirthy",
    "swiss design celebration"
  ],
  alternates: {
    canonical: "/"
  },
  openGraph: {
    title: "ebirthy — Precision Crafted Birthday Scenes",
    description: "Design interactive celebration experiences with blowable candles, faceted physics balloons, secret unboxing parcels, and instant share links.",
    url: BASE_URL,
    siteName: "ebirthy",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/icon.svg",
        width: 512,
        height: 512,
        alt: "ebirthy Brand Mark"
      }
    ]
  },
  twitter: {
    card: "summary",
    title: "ebirthy — Swiss Editorial Birthday Celebration Studio",
    description: "Design interactive celebration experiences with blowable candles, classified gift parcels, and 300 DPI keepsake posters.",
    images: ["/icon.svg"],
    creator: "@ebirthy"
  },
  verification: {
    google: "google03928a144a9d4d1f"
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1
    }
  },
  icons: {
    icon: "/icon.svg",
    shortcut: "/icon.svg",
    apple: "/icon.svg"
  }
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "ebirthy",
    "url": BASE_URL,
    "description": "Interactive celebration scene creator with blowable cake candles, secret parcels, memory reels, and 300 DPI keepsake posters.",
    "applicationCategory": "LifestyleApplication",
    "operatingSystem": "All",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    },
    "featureList": [
      "Interactive 3D cake with microphone and click candle blow detection",
      "Unboxing gift box parcel with custom message and voucher",
      "Cinematic letter with typewriter animation and voice note player",
      "Polaroid photo memory archive",
      "Community guestbook reaction board",
      "High-resolution 300 DPI printable keepsake poster export"
    ]
  };

  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        <meta name="google-site-verification" content="google03928a144a9d4d1f" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-full flex flex-col bg-[#f7f4ed] text-[#1c1917] selection:bg-amber-400 selection:text-black">
        {children}
      </body>
    </html>
  );
}
