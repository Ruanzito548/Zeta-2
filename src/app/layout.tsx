/**
 * Root Layout Component
 * Main application shell with metadata and styling
 */

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

export const metadata: Metadata = {
  title: "Zeta 2 - WoW Forever Economic Intelligence",
  description:
    "Professional economic analysis platform for World of Warcraft Forever Auction House",
  keywords: [
    "World of Warcraft",
    "WoW Forever",
    "Auction House",
    "Economic Analysis",
    "Crafting",
  ],
};

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-zinc-50 dark:bg-zinc-950">
        {children}
      </body>
    </html>
  );
}
