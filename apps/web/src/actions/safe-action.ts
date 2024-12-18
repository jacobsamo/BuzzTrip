import {
  createSafeActionClient,
  DEFAULT_SERVER_ERROR_MESSAGE,
} from "next-safe-action";
import { z } from "zod";
import { currentUser } from "@clerk/nextjs/server";
import logger from "@/server/logger";
import * as Sentry from "@sentry/nextjs";

export const actionWithMeta = createSafeActionClient({
  defineMetadataSchema() {
    return z.object({
      name: z.string(),
    });
  },
  handleServerError(error, utils) {
    const { clientInput, bindArgsClientInputs, metadata, ctx } = utils;
    return DEFAULT_SERVER_ERROR_MESSAGE;
  },
});

export const authAction = actionWithMeta.use(async ({ next, metadata }) => {
  const user = await currentUser();

  if (!user) throw new Error("Not authenticated");

  return Sentry.withServerActionInstrumentation(metadata.name, async () => {
    return next({
      ctx: {
        user,
      },
    });
  });
});
