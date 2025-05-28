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

export const ShareMapUserSchema = map_usersEditSchema.omit({
  map_id: true,
  map_user_id: true,
});

export const CreateMapSchema = z.object({
  users: ShareMapUserSchema.array().nullish(),
  map: mapsEditSchema,
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
  const { map, users } = input;

  const newMap: NewMap = {
    ...map,
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

  const sharedMap = await shareMap(db, {
    users: [
      ...(users ?? []),
      {
        user_id: userId,
        permission: "owner",
      },
    ],
    mapId: createdMap.map_id,
  });

  if (!sharedMap) {
    throw new Error("Error creating new shared map.", {
      cause: sharedMap,
    });
  }

  return {
    map: createdMap,
    shared_map: sharedMap.users,
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

  // prevent existing users from being added
  // logic in the frontend should handle this but this is a safety check
  const existingUsers = await db.query.map_users.findMany();
  const newUsers = users.filter((user) => {
    return !existingUsers.some(
      (existingUser) => existingUser.user_id === user.user_id
    );
  });

  newUsers.forEach((user) => {
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
