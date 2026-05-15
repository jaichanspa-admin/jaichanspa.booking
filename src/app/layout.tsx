import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "JAI CHAN SPA — Book Your Treatment",
  description:
    "Premium Thai Massage & Head Spa at Siam Discovery, Bangkok. Book your treatment online.",
  openGraph: {
    title: "JAI CHAN SPA",
    description: "Premium Thai Massage & Head Spa — Siam Discovery, Bangkok",
    siteName: "JAI CHAN SPA",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {/* Josefin Sans — matches CI "expanded" geometric sans aesthetic */}
        {/* Inter — clean body legibility */}
        <link
          href="https://fonts.googleapis.com/css2?family=Josefin+Sans:wght@300;400;600;700&family=Inter:wght@300;400;500;600&display=swap"
          rel="stylesheet"
        />
        {/* LINE LIFF SDK */}
        <script src="https://static.line-scdn.net/liff/edge/2/sdk.js" async />
      </head>
      <body>{children}</body>
    </html>
  );
}
