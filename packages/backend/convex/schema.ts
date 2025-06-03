import { defineSchema } from "convex/server";
import { authSchema } from "./schemas/auth";
import { mapsSchema } from "./schemas/maps";
import { placesSchema } from "./schemas/places";

export default defineSchema({
  ...mapsSchema,
  ...placesSchema,
  ...authSchema,
});
