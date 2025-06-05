import { zid } from "convex-helpers/server/zod";
import * as z from "zod";
import { defaultFields, insertSchema } from "./shared-schemas";

export const userSchema = z.object({
  ...defaultFields,
  clerkUserId: z.string(),
  name: z.string(),
  email: z.string(),
  image: z.string(),
  updatedAt: z.string(),
  createdAt: z.string().optional(),
  first_name: z.string().optional(),
  last_name: z.string().optional(),
  username: z.string().optional(),
  bio: z.string().optional(),
});

export const usersEditSchema = insertSchema(userSchema);

export const refinedUserSchema = userSchema.pick({
  _id: true,
  email: true,
  username: true,
  first_name: true,
  last_name: true,
  name: true,
  image: true,
});
