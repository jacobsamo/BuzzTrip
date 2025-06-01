import { v } from "convex/values";

export const bounds = v.object({
  east: v.float64(),
  north: v.float64(),
  south: v.float64(),
  west: v.float64(),
});
