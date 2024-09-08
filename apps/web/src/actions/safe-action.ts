import {
  createSafeActionClient,
  DEFAULT_SERVER_ERROR_MESSAGE,
} from "next-safe-action";
import { z } from "zod";
import { currentUser } from "@clerk/nextjs/server";

export const actionWithMeta = createSafeActionClient({
  handleServerError(error) {
    console.error(error);
    return DEFAULT_SERVER_ERROR_MESSAGE;
  },
  defineMetadataSchema() {
    return z.object({
      name: z.string(),
    });
  },
});

export const authAction = actionWithMeta.use(async ({ next, metadata }) => {
  const user = await currentUser();

  if (!user) throw new Error("Not authenticated");

  return next({
    ctx: {
      user,
    },
  });
});
