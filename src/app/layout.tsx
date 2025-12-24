import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Sui Nigeria - Move-ing with Sui",
  description: "Community run page dedicated to the advancement and adoption of Sui in Nigeria and Africa. Join developers, creators, and blockchain enthusiasts building on Sui.",
  keywords: ["Sui", "Nigeria", "Blockchain", "Move", "Web3", "Africa", "Cryptocurrency", "DeFi"],
  authors: [{ name: "Sui Nigeria Community" }],
  openGraph: {
    title: "Sui Nigeria - Move-ing with Sui",
    description: "Community run page dedicated to the advancement and adoption of Sui in Nigeria and Africa.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Sui Nigeria - Move-ing with Sui",
    description: "Community run page dedicated to the advancement and adoption of Sui in Nigeria and Africa.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700&family=Press+Start+2P&family=Russo+One&display=swap" rel="stylesheet" />
      </head>
      <body>
        {children}
      </body>
    </html>
  );
}
