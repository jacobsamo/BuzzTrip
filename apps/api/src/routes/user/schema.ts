import { z } from "@hono/zod-openapi";
import { mapsSchema, userMapsSchema } from "@buzztrip/db/zod-schemas";

export const MapsParamsSchema = z.object({
  userId: z
    .string()
    .min(32)
    .openapi({
      param: {
        name: "userId",
        in: "path",
        required: true,
      },
      example: "user_2lmIzCk7BhX5a5MwvgITlFjkoLH",
    }),
});

export const MapsSchema = z
  .object({
    data: userMapsSchema.array(),
  })
  .openapi("MapsSchema");
