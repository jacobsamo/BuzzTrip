import { getMarkersView } from "@buzztrip/db/queries";
import { collection_links, locations, markers } from "@buzztrip/db/schema";
import type { IconType } from "@buzztrip/db/types";
import { NewCollectionLink, NewLocation } from "@buzztrip/db/types";
import { and, eq } from "drizzle-orm";
import { v4 as uuid } from "uuid";
import { z } from "zod";
import { Database } from "..";
import {
  collection_linksSchema,
  collectionsSchema,
  combinedMarkersSchema,
} from "../zod-schemas";
import { collections } from "@buzztrip/db/schema";
import { NewCollection } from "@buzztrip/db/types";
import { collectionsEditSchema } from "@buzztrip/db/zod-schemas";

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
