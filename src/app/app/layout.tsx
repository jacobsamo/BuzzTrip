"use client";
import { APIProvider } from "@vis.gl/react-google-maps";
import env from "env";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <APIProvider
        apiKey={env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY as string}
        libraries={["places", "marker"]}
      >
        {children}
      </APIProvider>
    </>
  );
}
