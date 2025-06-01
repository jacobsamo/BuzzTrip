import { defineSchema, defineTable } from "convex/server";
import { mapsSchema } from "./schemas/maps";
import { placesSchema } from "./schemas/places";
import { v } from "convex/values";

export default defineSchema({
  ...mapsSchema,
  ...placesSchema,
  users: defineTable({
    name: v.string(),
    email: v.string(),
    profile_picture: v.string(),
  })
});
