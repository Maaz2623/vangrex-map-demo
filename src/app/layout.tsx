import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Vangrex Map Demo",
  description: "Todo application for experimenting with application mapping",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
