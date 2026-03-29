import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: { default: "PlacementPro", template: "%s | PlacementPro" },
  description: "The complete placement and interview platform",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
