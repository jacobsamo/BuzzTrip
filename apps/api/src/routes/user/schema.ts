import { refinedUserSchema, userMapsSchema } from "@buzztrip/db/zod-schemas";
import { z } from "@hono/zod-openapi";

export const MapsParamsSchema = z.object({
  userId: z
    .string()
    .openapi({
      param: {
        name: "userId",
        in: "path",
        required: true,
      },
      example: "user_2lmIzCk7BhX5a5MwvgITlFjkoLH",
    }),
});

export const MapsSchema = userMapsSchema.array().openapi("MapsSchema");

export const SearchUsersSchema = z.object({
  q: z.string(),
});



export const SearchUserReturnSchema = z.object({
  users: refinedUserSchema.array().nullable(),
});
