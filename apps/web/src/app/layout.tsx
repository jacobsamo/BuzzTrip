import Providers from "@/components/providers";
import "@/lib/styles/globals.css";
import { constructMetadata } from "@/lib/utils/metadata";
import { ClerkProvider } from "@clerk/nextjs";
import type { Metadata, Viewport } from "next";
import React from "react";

export const metadata: Metadata = constructMetadata();

export const viewport: Viewport = {
  maximumScale: 1,
  minimumScale: 1,
  initialScale: 1,
  userScalable: false,
  width: "device-width",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body>
          <Providers>{children}</Providers>
        </body>
      </html>
    </ClerkProvider>
  );
}
