"use server";
import { authAction } from "@/actions/safe-action";
import { db } from "@/server/db";
import {
  createCollection,
  CreateCollectionSchema,
} from "@buzztrip/db/mutations/collections";

export const createCollectionAction = authAction
  .schema(CreateCollectionSchema)
  .metadata({ name: "create-collection" })
  .action(async ({ parsedInput: params, ctx }) => {
    return await createCollection(db, {
      mapId: params.map_id,
      userId: ctx.user.id,
      input: params,
    });
  });
