"use client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React from "react";
import { Toaster } from "sonner";
import { PostHogProvider } from "./posthog";

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
