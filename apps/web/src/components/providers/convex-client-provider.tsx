"use client";
import { useAuth } from "@clerk/nextjs";
import { ConvexQueryClient } from "@convex-dev/react-query";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ConvexReactClient } from "convex/react";
import { ConvexProviderWithClerk } from "convex/react-clerk";
import { env } from "env";
import { usePostHog } from "posthog-js/react";
import { ReactNode, useEffect } from "react";
import * as Sentry from "@sentry/nextjs";

if (!env.NEXT_PUBLIC_CONVEX_URL) {
  throw new Error("Missing NEXT_PUBLIC_CONVEX_URL in your .env file");
}

const convex = new ConvexReactClient(env.NEXT_PUBLIC_CONVEX_URL);
const convexQueryClient = new ConvexQueryClient(convex);
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryKeyHashFn: convexQueryClient.hashFn(),
      queryFn: convexQueryClient.queryFn(),
    },
  },
});
convexQueryClient.connect(queryClient);

export default function ConvexClientProvider({
  children,
}: {
  children: ReactNode;
}) {
  const posthog = usePostHog();
  const session = useAuth();

  // track users by id in posthog
  useEffect(() => {
    if (session && session.userId) {
      posthog.identify(session.userId);
      Sentry.setUser({ id: session.userId,  });
    }
  }, [posthog, session]);

  return (
    <ConvexProviderWithClerk client={convex} useAuth={useAuth}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </ConvexProviderWithClerk>
  );
}
