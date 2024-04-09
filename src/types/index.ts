import { Tables } from "@/../database.types";
import { z } from "zod";
import { locationSchema, permissionLevel } from "./schemas";

export type Map = Tables<"map">;

export type Collection = Tables<"collection">;

export type Marker = Tables<"marker">;

export type SharedMap = Tables<"map"> & Tables<"shared_map">;

export type Location = z.infer<typeof locationSchema>;

export type Permissions = z.infer<typeof permissionLevel>;