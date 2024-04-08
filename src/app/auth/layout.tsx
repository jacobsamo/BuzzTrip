import Image from "next/image";
import React from "react";

export default async function AuhLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative flex h-dvh w-full items-center justify-center">
      <div className="bg-grey/20 dark:bg-grey/60 z-10 flex max-w-md flex-col items-center justify-center  gap-3 rounded-3xl p-3 text-center shadow backdrop-blur-sm">
        {children}
      </div>
      {/* <Image
        src="/images/auth-background.webp"
        alt="background image"
        fill
        className="absolute -z-50 h-full w-full object-cover object-center"
      /> */}
    </div>
  );
}
