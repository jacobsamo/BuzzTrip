import { zid } from "convex-helpers/server/zod4";
import * as z from "zod";
import { zodTable } from "./helpers";

// Define mapViews table
export const mapViewsTable = zodTable("mapViews", {
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

export const mapViewSchema = mapViewsTable.schema;
export const mapViewEditSchema = mapViewsTable.insertSchema;
