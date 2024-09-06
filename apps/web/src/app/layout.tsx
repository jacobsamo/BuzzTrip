import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "@/lib/styles/globals.css";
import {
  ClerkProvider,
  SignInButton,
  SignedIn,
  SignedOut,
  UserButton,
} from "@clerk/nextjs";
import { getRequestContext } from "@cloudflare/next-on-pages";

export const runtime = "edge";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "BuzzTrip",
  description: "Plan the trip you've always dreamed of",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { env } = getRequestContext();

  return (
    <ClerkProvider>
      <html lang="en">
        <body className={inter.className}>{children}</body>
      </html>
    </ClerkProvider>
  );
}
