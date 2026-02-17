import * as z from "zod";
import { IconType } from "../types";

export const reviewsSchema = z.object({
  authorName: z.string(),
  authorUrl: z.string().nullable(),
  profilePhotoUrl: z.string(),
  rating: z.number().nullable(),
  description: z.string(),
});

export const bounds = z.object({
  east: z.number(),
  north: z.number(),
  south: z.number(),
  west: z.number(),
});

export const latlng = z.object({
  lat: z.number(),
  lng: z.number(),
});

export const iconSchema = z.union([z.custom<IconType>(), z.string()]);

export const boundsSchema = z.union([bounds, latlng]);

export const mapBoundsSchema = bounds.extend({
  offset: z.number().optional(),
});
