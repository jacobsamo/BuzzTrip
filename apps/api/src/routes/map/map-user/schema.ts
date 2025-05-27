import { z } from "@hono/zod-openapi";
import { MapParamsSchema } from "../../../common/schema";

export const MapUserParamsSchema = MapParamsSchema.extend({
  userId: z.string(),
});
