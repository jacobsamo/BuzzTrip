"use client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React from "react";
import posthog from "posthog-js";
import { PostHogProvider } from "posthog-js/react";
import env from "env";

if (typeof window !== "undefined" && process.env.NODE_ENV === "production") {
  posthog.init(env.NEXT_PUBLIC_POSTHOG_KEY, {
    api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST,
  });
}

const Providers = ({ children }: { children: React.ReactNode }) => {
  const [queryClient] = React.useState(() => new QueryClient());

  return (
    <>
      <PostHogProvider client={posthog}>
        <QueryClientProvider client={queryClient}>
          {children}
          {/* {process.env.NODE_ENV === "development" && (
          <ReactQueryDevtools initialIsOpen={false} />
        )} */}
        </QueryClientProvider>
      </PostHogProvider>
    </>
  );
};

export default Providers;
