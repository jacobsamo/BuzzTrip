import { zid } from "convex-helpers/server/zod4";
import * as z from "zod";
import { zodTable } from "./helpers";
import { iconSchema } from "./shared-schemas";

export const dataLayerTable = zodTable("dataLayers", {
  title: z.string(),
  description: z.string().nullish(),
  icon: iconSchema.nullish(),
  color: z.string().nullish(),
  /** Whether this data layer is hidden on the map */
  hidden: z.boolean().default(false),
  createdBy: zid("users"),
  mapId: zid("maps"),
})