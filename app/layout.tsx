import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin", "cyrillic"],
  display: "swap"
});

export const metadata: Metadata = {
  title: "ResselerHub | CS2 DLC Keys",
  description: "Магазин цифровых DLC-ключей для Counter-Strike 2 с корзиной и email-доставкой."
};

export default function RootLayout({
  children
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="ru">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
