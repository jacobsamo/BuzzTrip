"use server";
import { authAction } from "@/actions/safe-action";
import { IconName } from "@buzztrip/components/icon";
import { db } from "@buzztrip/db";
import { collections } from "@buzztrip/db/schema";
import { NewCollection } from "@buzztrip/db/types";
import { collectionsEditSchema } from "@buzztrip/db/zod-schemas";

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
