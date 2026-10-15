import type { Metadata, Viewport } from "next";
import { Inter, Source_Serif_4 } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const sourceSerif = Source_Serif_4({
  subsets: ["latin"],
  variable: "--font-serif",
  display: "swap",
});

export const metadata: Metadata = {
  title: "D' POOL — Verified Campus Marketplace",
  description: "Hyperlocal, student-verified exchange at School of Planning and Architecture Vijayawada (SPAV). Buy & sell pre-owned thrift, dorm essentials, and lifestyle goods.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${sourceSerif.variable}`}>
      <body className="min-h-screen bg-paper text-ink flex flex-col items-center">
        <main className="w-full max-w-md min-h-screen bg-paper flex flex-col border-x border-border/50 relative shadow-sm">
          {children}
        </main>
      </body>
    </html>
  );
}
