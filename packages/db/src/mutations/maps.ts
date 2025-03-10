import { NewMap, NewMapUser } from "@buzztrip/db/types";
import {
  map_usersEditSchema,
  map_usersSchema,
  mapsEditSchema,
  mapsSchema,
} from "@buzztrip/db/zod-schemas";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { Database } from "..";
import { map_users, maps } from "../schemas";

export const CreateMapSchema = mapsEditSchema;

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
    ...input,
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

export const ShareMapUserSchema = map_usersEditSchema.omit({
  map_id: true,
  map_user_id: true,
});

export type TShareMapUserSchema = z.infer<typeof ShareMapUserSchema>;

export const ShareMapSchema = z.object({
  users: ShareMapUserSchema.array(),
  mapId: z.string(),
});

export const ShareMapReturnSchema = z.object({
  users: map_usersSchema.array(),
});

export const shareMap = async (
  db: Database,
  { users, mapId }: z.infer<typeof ShareMapSchema>
): Promise<z.infer<typeof ShareMapReturnSchema>> => {
  let newMapUsers: NewMapUser[] = [];

  users.forEach((user) => {
    newMapUsers.push({
      map_id: mapId,
      user_id: user.user_id,
      permission: user.permission,
    });
  });

  const mapUsers = await db.insert(map_users).values(newMapUsers).returning();

  return {
    users: mapUsers,
  };
};
