"use client";
import { APIProvider } from "@vis.gl/react-google-maps";
import { env } from "env";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <APIProvider
        apiKey={env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}
        libraries={["places", "marker", "routes"]}
        onError={(error) => {
          console.error("Google Maps API Error:", error);}}
        onLoad={() => {
          console.log("Google Maps API Loaded Successfully");
        }}
        
      >
        <main>{children}</main>
      </APIProvider>
    </>
  );
}
