import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "CertifyIQ",
  description: "AI-powered workforce readiness and compliance intelligence platform"
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
