import React from "react";
import Image from "next/image";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main className="relative min-h-screen flex flex-col items-center justify-center">
      {children}
      <Image
        src="/assets/app-screenshot.webp"
        alt="BuzzTrip"
        width={1200}
        height={630}
        className="absolute top-0 -z-10 h-full w-full object-cover blur-sm"
      />
    </main>
  );
}
