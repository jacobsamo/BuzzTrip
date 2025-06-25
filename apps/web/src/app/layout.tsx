import Footer from "@/components/footer";
import Navbar from "@/components/navbar";
import Providers from "@/components/providers";
import { ReactScan } from "@/components/react-scan";
import "@/lib/styles/globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import type { Metadata, Viewport } from "next";
import React from "react";
import { Monitoring } from "react-scan/monitoring/next";
import { baseUrl } from "./sitemap";

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: "BuzzTrip",
    template: "%s | BuzzTrip",
  },
  description: "Create Custom Maps, anywhere on any device",
  authors: [
    {
      name: "buzztrip",
      url: baseUrl,
    },
  ],
  openGraph: {
    title: "BuzzTrip",
    description: "Create Custom Maps, anywhere on any device",
    locale: "en_AU",
    type: "website",
    images: ["/assets/open-graph.jpg"],
    url: baseUrl,
  },
  facebook: {
    appId: "1218637089558551",
  },
  keywords: [
    "travel",
    "maps",
    "mapping",
    "trip",
    "holiday",
    "planning",
    "buzztrip",
  ],
  twitter: {
    title: "BuzzTrip",
    description: "Create Custom Maps, anywhere on any device",
    card: "summary_large_image",
    images: ["/assets/open-graph.jpg"],
    creator: "@buzztripdotco",
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/logos/logo_x128.png",
    apple: "/logos/logo_x128.png",
  },
  alternates: {
    canonical: baseUrl,
  },
  manifest: "/manifest.webmanifest",
  robots: "/robots.txt",
};

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
