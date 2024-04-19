import { Tables } from "@/../database.types";
import { z } from "zod";
import { locationsSchema, locationsEditSchema, permissionLevel, markersSchema } from "./schemas";

export type Map = Tables<"map">;

export type Collection = Tables<"collection">;

export type Marker = z.infer<typeof markersSchema>;

export type SharedMap = Tables<"map"> & Tables<"shared_map">;

export type Location = z.infer<typeof locationsSchema>;
export type LocationEdit = z.infer<typeof locationsEditSchema>;

export type Permissions = z.infer<typeof permissionLevel>;