"use server";
import { authAction } from "@/actions/safe-action";
import { db } from "@/server/db";
import { CreateMarkerSchema, createMarker } from "@buzztrip/db/mutations";

export const createMarkerAction = authAction
  .schema(CreateMarkerSchema)
  .metadata({ name: "create-marker" })
  .action(async ({ parsedInput: params, ctx }) => {
    const data = await createMarker(db, {
      userId: ctx.user.id,
      mapId: params.marker.map_id!,
      input: params,
    });

    return data;
  });
