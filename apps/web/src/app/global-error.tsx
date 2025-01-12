"use client";
import { Button } from "@/components/ui/button";
import * as Sentry from "@sentry/nextjs";
import { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    Sentry.captureException(error, {
      data: {
        digest: error.digest,
      },
    });
  }, [error]);

  return (
    <html>
      <body>
        <h1 className="text-2xl font-bold">Error</h1>
        <p>An error occurred: {error.message}</p>
        <Button onClick={() => reset()}>Try again</Button>
      </body>
    </html>
  );
}
