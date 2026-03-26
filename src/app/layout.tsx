import React from "react";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Atlas Analytics - E-commerce Predictive Dashboard",
  description: "Advanced predictive analytics platform for e-commerce metrics and ML-driven insights.",
  keywords: ["Analytics", "Predictive", "E-commerce", "Dashboard", "Business Intelligence", "D3.js"],
  authors: [{ name: "Selma Haci" }],
  icons: {
    icon: "/logo.png",
    shortcut: "/logo.png",
    apple: "/logo.png",
  },
  openGraph: {
    title: "Atlas Analytics Dashboard",
    description: "Deep insights and predictive forecasting for e-commerce growth.",
    type: "website",
    images: ["/logo.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Atlas Analytics Dashboard",
    description: "Deep insights and predictive forecasting for e-commerce growth.",
    images: ["/logo.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
