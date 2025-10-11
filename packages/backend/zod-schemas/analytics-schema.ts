import { zid } from "convex-helpers/server/zod";
import * as z from "zod";
import { defaultFields, insertSchema } from "./shared-schemas";

export const mapViewSchema = z.object({
  ...defaultFields,
  userId: zid("users").optional(),
  mapId: zid("maps"),
  ip: z.string().optional(),
  country: z.string().optional(),
  region: z.string().optional(),
  city: z.string().optional(),
  userAgent: z.string().optional(),
  os: z.string().optional(),
  browser: z.string().optional(),
  device: z.string().optional(),
});

export const mapViewEditSchema = insertSchema(mapViewSchema);
