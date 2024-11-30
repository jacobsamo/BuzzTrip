"use server";
import { authAction } from "@/actions/safe-action";
import { db } from "@/server/db";
import {
  CreateMarkerSchema,
  createMarker as createMarkerFunction,
} from "@buzztrip/db/queries";

export const createMarker = authAction
  .schema(CreateMarkerSchema)
  .metadata({ name: "create-marker" })
  .action(async ({ parsedInput: params, ctx }) => {
    const data = await createMarkerFunction(db, {
      userId: ctx.user.id,
      mapId: params.marker.map_id!,
      input: params,
    });

    return data;
  });
