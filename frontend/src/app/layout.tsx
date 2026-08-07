// Emmanuel Aro's project submission for evaluation.
import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Geod Talk · Ticketing",
  description:
    "Ticketing module for Geod Talk — A subsidiary of Geod. Emmanuel Aro's project submission for evaluation.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0B0F14",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
