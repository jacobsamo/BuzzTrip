import * as z from "zod";

export const mapSchema = z.object({
  uid: z.string(),
  image: z.string(),
  title: z.string().max(150),
  description: z.string(),
  createdBy: z.string(),
  createdAt: z.date().default(() => new Date()),
});

export const collectionSchema = z.object({
  uid: z.string(),
  title: z.string().max(100),
  description: z.string(),
  color: z.string().max(7),
  icon: z.string(),
  mapId: z.string(),
});

export const markerSchema = z.object({
  uid: z.string(),
  title: z.string(),
  color: z.string().max(7),
  icon: z.string(),
  address: z.string(),
  lat: z.number(),
  lng: z.number(),
  collectionId: z.string(),
  mapId: z.string(),
});

export const permissionLLevel = z.enum(["viewer", "editor", "owner"]);

export const sharedMapSchema = z.object({
  mapId: z.string(),
  userId: z.string(),
  permissionLLevel: permissionLLevel.default("viewer"),
});
