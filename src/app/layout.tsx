import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";

export const metadata: Metadata = {
  title: "BuzzTrip",
  description: "Plan the trip you've always dreamed of",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        {children}
        <Toaster position="top-center" richColors={true} />
      </body>
    </html>
  );
}
