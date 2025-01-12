"use client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import dynamic from "next/dynamic";
import React from "react";
import { Toaster } from "sonner";

const PostHogProvider = dynamic(() => import("./posthog"), { ssr: false });

const Providers = ({ children }: { children: React.ReactNode }) => {
  const [queryClient] = React.useState(() => new QueryClient());

  return (
    <>
      <PostHogProvider>
        <QueryClientProvider client={queryClient}>
          <Toaster position="top-center" richColors={true} closeButton={true} />
          {children}
        </QueryClientProvider>
      </PostHogProvider>
    </>
  );
};

export default Providers;
