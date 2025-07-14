import * as z from "zod";
import { iconsList, IconType } from "../types";

export const defaultFields = {
  _id: z.string(),
  _creationTime: z.number(),
};

// Add default fields to a schema to form a complete table schema
export const defaultSchema = <T extends z.ZodRawShape>(
  schema: z.ZodObject<T>
) => {
  return schema.extend(defaultFields);
};

// Make _id and _creationTime optional for inserts
export const insertSchema = <T extends z.ZodRawShape>(
  schema: z.ZodObject<T>
) => {
  return schema.extend({
    _id: defaultFields._id.optional(),
    _creationTime: defaultFields._creationTime.optional(),
  });
};

// Make all fields optional for editing
export const editSchema = <T extends z.ZodRawShape>(schema: z.ZodObject<T>) => {
  return insertSchema(schema).partial();
};

export const reviewsSchema = z.object({
  author_name: z.string(),
  author_url: z.string().nullable(),
  profile_photo_url: z.string(),
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

export const iconSchema = z.custom<IconType>()

export const boundsSchema = z.union([bounds, latlng]);

export const mapBoundsSchema = bounds.extend({
  offset: z.number().optional(),
});
