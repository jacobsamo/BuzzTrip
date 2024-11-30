import { map_users, maps } from "@buzztrip/db/schema";
import { NewMap, NewMapUser } from "@buzztrip/db/types";
import {
  map_usersSchema,
  mapsEditSchema,
  mapsSchema,
} from "@buzztrip/db/zod-schemas";
import { z } from "zod";
import { Database } from "..";
import { eq } from "drizzle-orm";

export const CreateMapSchema = z.object({
  title: z.string(),
  description: z.string().nullish(),
});

export const CreateMapReturnSchema = z.object({
  map: mapsSchema,
  shared_map: map_usersSchema.array(),
});

export type CreateMapParams = {
  userId: string;
  input: z.infer<typeof CreateMapSchema>;
};

export const createMap = async (
  db: Database,
  { userId, input }: CreateMapParams
): Promise<z.infer<typeof CreateMapReturnSchema>> => {
  const newMap: NewMap = {
    title: input.title,
    description: input.description,
    owner_id: userId,
  };

  const [createdMap] = await db.insert(maps).values(newMap).returning();

  if (!createdMap) {
    throw new Error("Error creating new map.", {
      cause: createdMap,
    });
  }

  const shared_map: NewMapUser = {
    map_id: createdMap.map_id,
    user_id: userId,
    permission: "owner",
  };

  const sharedMap = await db.insert(map_users).values(shared_map).returning();

  if (!sharedMap) {
    throw new Error("Error creating new shared map.", {
      cause: sharedMap,
    });
  }

  return {
    map: createdMap,
    shared_map: sharedMap,
  };
};

export const EditMapSchema = mapsEditSchema;
export const EditMapReturnSchema = mapsSchema;

export type EditMapParams = {
  mapId: string;
  input: z.infer<typeof EditMapSchema>;
};

export const editMap = async (
  db: Database,
  { mapId, input }: EditMapParams
): Promise<z.infer<typeof EditMapReturnSchema>> => {
  const [updatedMap] = await db
    .update(maps)
    .set(input)
    .where(eq(maps.map_id, mapId))
    .returning();

  if (!updatedMap) {
    throw new Error("Error updating map.", {
      cause: updatedMap,
    });
  }

  return updatedMap;
};

export const DeleteMapSchema = z.object({
  mapId: z.string(),
});
export const DeleteMapReturnSchema = DeleteMapSchema;

export type DeleteMapParams = {
  mapId: string;
};

export const deleteMap = async (
  db: Database,
  { mapId }: DeleteMapParams
): Promise<z.infer<typeof DeleteMapReturnSchema>> => {
  const [deletedMap] = await db
    .delete(maps)
    .where(eq(maps.map_id, mapId))
    .returning({ deletedId: maps.map_id });

  if (!deletedMap) {
    throw new Error("Error deleting map.", {
      cause: deletedMap,
    });
  }

  return { mapId: deletedMap.deletedId };
};
