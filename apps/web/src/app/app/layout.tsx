"use client";
import { APIProvider } from "@vis.gl/react-google-maps";
import { env } from "env";

interface LayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: LayoutProps) {
  return (
    <>
      <APIProvider
        apiKey={env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}
        libraries={["places", "marker"]}
        
      >
        <main className="p-2">{children}</main>
      </APIProvider>
    </>
  );
}
