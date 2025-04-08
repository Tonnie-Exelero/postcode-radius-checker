import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "GEO Eligibility Checker",
  description: "Created by Exelero",
  icons: {
    icon: "/favicon.svg",
  },
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
