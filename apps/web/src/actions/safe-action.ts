import * as Sentry from "@sentry/nextjs";
import {
  DEFAULT_SERVER_ERROR_MESSAGE,
  createSafeActionClient,
} from "next-safe-action";
import { z } from "zod";

export const actionClient = createSafeActionClient();

export const actionWithMeta = createSafeActionClient({
  defineMetadataSchema() {
    return z.object({
      name: z.string(),
    });
  },
});

export const publicAction = actionWithMeta.use(async ({ next, metadata }) => {
  return Sentry.withServerActionInstrumentation(metadata.name, async () => {
    return next();
  });
});
