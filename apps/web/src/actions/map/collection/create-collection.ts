"use server";
import { authAction } from "@/actions/safe-action";
import { IconName } from "@/components/icon";
import { db } from "@/server/db";
import { collections } from "@/server/db/schema";
import { NewCollection } from "@/types";
import { collectionsEditSchema } from "@/types/scheams";

export const createCollection = authAction
  .schema(collectionsEditSchema)
  .metadata({ name: "create-collection" })
  .action(async ({ parsedInput: params, ctx }) => {
    const newCollection: NewCollection = {
      ...params,
      icon: params.icon as IconName,
    };

    const collection = await db
      .insert(collections)
      .values(newCollection)
      .returning();

    if (!collection) {
      return new Error("Error creating new map.", {
        cause: collection,
      });
    }

    return collection
  });
