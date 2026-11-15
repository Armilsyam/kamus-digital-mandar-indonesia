import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "KADIMA-ID | Kamus Digital Mandar-Indonesia Interaktif (Edisi Balai Bahasa 2025)",
  description: "Platform Leksikografi Digital & Pelestarian Bahasa Mandar Berbasis AI, Laboratorium Fonologi Interaktif & Ensiklopedia Budaya Maritim Sulawesi Barat untuk Inovasi Digital BudayaGo",
  keywords: [
    "Kamus Bahasa Mandar",
    "Bahasa Mandar Indonesia",
    "BudayaGo",
    "Inovasi Digital Budaya",
    "Perahu Sandeq",
    "Lipaq Saqbe",
    "Kalindaqdaq",
    "Balai Bahasa Sulawesi Selatan",
    "Aksara Lontara Mandar",
    "Morfologi Mandar"
  ],
  authors: [{ name: "Tim Inovasi Digital Mandar - BudayaGo 2025" }],
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className="scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=Noto+Sans+Buginese&family=Playfair+Display:ital,wght@0,600;0,700;1,600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen flex flex-col antialiased selection:bg-mandar-maroon-600 selection:text-white">
        {children}
      </body>
    </html>
  );
}
