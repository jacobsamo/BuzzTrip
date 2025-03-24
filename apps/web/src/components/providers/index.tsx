"use client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import dynamic from "next/dynamic";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import React from "react";
import { Toaster } from "sonner";

const PostHogProvider = dynamic(() => import("./posthog"), { ssr: false });

const Providers = ({ children }: { children: React.ReactNode }) => {
  const [queryClient] = React.useState(() => new QueryClient());

  return (
    <>
      <PostHogProvider>
        <NuqsAdapter>
          <QueryClientProvider client={queryClient}>
            <Toaster
              position="top-center"
              richColors={true}
              closeButton={true}
            />
            {children}
          </QueryClientProvider>
        </NuqsAdapter>
      </PostHogProvider>
    </>
  );
};

export default Providers;
