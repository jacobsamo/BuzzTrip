"use server";
import { authAction } from "@/actions/safe-action";
import { IconName } from "@/components/icon";
import { db } from "@/server/db";
import { collections } from "@/server/db/schema";
import { NewCollection } from "@/types";
import { collectionsEditSchema } from "@/types/scheams";

const schema = collectionsEditSchema.omit({
  created_by: true,
});

export const createCollection = authAction
  .schema(schema)
  .metadata({ name: "create-collection" })
  .action(async ({ parsedInput: params, ctx }) => {
    const newCollection: NewCollection = {
      ...params,
      icon: params.icon as IconName,
      created_by: ctx.user.id,
    };

    const collection = await db
      .insert(collections)
      .values(newCollection)
      .returning();

    if (!collection) {
      throw new Error("Error creating new map.", {
        cause: collection,
      });
    }

    return collection;
  });
