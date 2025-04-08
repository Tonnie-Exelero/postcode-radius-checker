import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "GEO Eligibility Checker",
  description:
    "Check student eligibility for a course based on their physical location",
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
