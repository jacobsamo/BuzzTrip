"use client";

import { ReactNode } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { ThemeProvider } from "next-themes";
import ConvexClientProvider from "./convex-client-provider";
import PostHogProvider from "./posthog-provider";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
    },
  },
});

interface ProvidersProps {
  children: ReactNode;
}

export default function Providers({ children }: ProvidersProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        <PostHogProvider>
          <ConvexClientProvider>
            {children}
            <ReactQueryDevtools initialIsOpen={false} />
          </ConvexClientProvider>
        </PostHogProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}