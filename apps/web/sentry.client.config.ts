// This file configures the initialization of Sentry on the client.
// The config you add here will be used whenever a users loads a page in their browser.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  // Define how likely traces are sampled. Adjust this value in production, or use tracesSampler for greater control.
  tracesSampleRate: 1,
  // Setting this option to true will print useful information to the console while you're setting up Sentry.
  debug: false,
  enabled: process.env.NODE_ENV === "production",
  
  // // If the entire session is not sampled, use the below sample rate to sample
  // // sessions when an error occurs.
  // replaysSessionSampleRate: 0.1,
  // replaysOnErrorSampleRate: 1.0,

  // integrations: [
  //   Sentry.replayIntegration({
  //     // Additional SDK configuration goes in here, for example:
  //     maskAllText: false, // as errors can occur in the UI, we want to see the full error
  //     blockAllMedia: false,
  //   }),
  // ],
});
