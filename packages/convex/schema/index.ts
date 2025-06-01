import { defineSchema } from "convex/server";
import { mapsSchema } from "./maps";
import { placesSchema } from "./places";

export default defineSchema({
  ...mapsSchema,
  ...placesSchema,
});
