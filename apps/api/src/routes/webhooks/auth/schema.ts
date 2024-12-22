import { z } from "@hono/zod-openapi";

export const ClerkWebhookReturn = z.object({
  message: z.string(),
});
