import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Wackbehavior — The AI Design Studio for Fashion Founders",
  description:
    "Turn your ideas into sketches, product photos, and campaign imagery before your samples arrive. Built by a fashion founder, for fashion founders.",
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
