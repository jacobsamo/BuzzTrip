import { z } from "@hono/zod-openapi";
import { MapParamsSchema } from "../../../common/schema";

export const LabelParamsSchema = MapParamsSchema.extend({
  labelId: z.string().openapi({
    param: {
      name: "labelId",
      in: "path",
      required: true,
    },
    example: "1f36c536-c8cf-4174-8ed4-3150c08212b5",
  }),
});
