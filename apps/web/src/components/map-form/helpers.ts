import { ShareMapUserSchema } from "@buzztrip/db/mutations";
import { mapsEditSchema } from "@buzztrip/db/zod-schemas";
import { z } from "zod";

export const createMapSchema = z.object({
  users: ShareMapUserSchema.array().nullish(),
  map: mapsEditSchema,
});
