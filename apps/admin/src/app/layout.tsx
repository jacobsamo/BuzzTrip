import { ConvexClientProvider } from "@/components/convex-client-provider";
import { ClerkProvider } from "@clerk/nextjs";
import type { Metadata } from "next";
import "@buzztrip/ui/globals.css";

export const metadata: Metadata = {
  title: "BuzzTrip Admin Dashboard",
  description: "Admin dashboard for managing BuzzTrip platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <body className="antialiased">
          <ConvexClientProvider>{children}</ConvexClientProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
