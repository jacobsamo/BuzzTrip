import { Tables } from "database.types";
import { z } from "zod";
import { locationSchema } from "./schemas";

export type Map = Tables<"map">;

export type Collection = Tables<"collection">;

export type Marker = Tables<"marker">;

export type Location = z.infer<typeof locationSchema>;