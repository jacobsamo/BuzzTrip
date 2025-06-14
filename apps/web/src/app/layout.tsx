import Footer from "@/components/footer";
import Navbar from "@/components/navbar";
import Providers from "@/components/providers";
import { ReactScan } from "@/components/react-scan";
import "@/lib/styles/globals.css";
import { constructMetadata } from "@/lib/utils/metadata";
import { ClerkProvider } from "@clerk/nextjs";
import type { Viewport } from "next";
import React from "react";
import { Monitoring } from "react-scan/monitoring/next";


export const viewport: Viewport = {
  maximumScale: 1,
  minimumScale: 1,
  initialScale: 1,
  userScalable: false,
  width: "device-width",
};

export const metadata = constructMetadata();

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body>
          <Monitoring
            apiKey="_N7F5vj5e4CAmWIMbP3ymcuvBkK-zCIa" // Safe to expose publically
            url="https://monitoring.react-scan.com/api/v1/ingest"
            commit={process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA}
            branch={process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_REF}
          />
          {process.env.NODE_ENV === "development" && <ReactScan />}
          <Providers>
            <Navbar />
            {children}
            <Footer />
          </Providers>
        </body>
      </html>
    </ClerkProvider>
  );
}
