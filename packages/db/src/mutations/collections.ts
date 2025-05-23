import { collections } from "../schemas";
import type { IconType } from "@buzztrip/db/types";
import { NewCollection } from "@buzztrip/db/types";
import { collectionsEditSchema } from "@buzztrip/db/zod-schemas";
import { z } from "zod";
import { Database } from "..";
import { collectionsSchema } from "../zod-schemas";

export const CreateCollectionSchema = collectionsEditSchema;

export const CreateCollectionReturnSchema = collectionsSchema;

export type CreateCollectionParams = {
  userId: string;
  mapId: string;
  input: z.infer<typeof CreateCollectionSchema>;
};

export const createCollection = async (
  db: Database,
  { userId, mapId, input }: CreateCollectionParams
): Promise<z.infer<typeof CreateCollectionReturnSchema>> => {
  const newCollection: NewCollection = {
    ...input,
    icon: input.icon as IconType,
    created_by: userId,
    map_id: mapId,
  };

  const [collection] = await db
    .insert(collections)
    .values(newCollection)
    .returning();

  if (!collection) {
    throw new Error("Error creating new map.", {
      cause: collection,
    });
  }

  return collection;
};
