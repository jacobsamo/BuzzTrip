"use server";
import { authAction } from "@/actions/safe-action";
import { db } from "@/server/db";
import {
  editMarker,
  EditMarkerSchema
} from "@buzztrip/db/mutations/markers";

export const updateMarkerAction = authAction
  .schema(EditMarkerSchema)
  .metadata({ name: "update-marker" })
  .action(async ({ parsedInput: params, ctx }) => {
    return await editMarker(db, {
      userId: ctx.user.id,
      mapId: params.marker.map_id!,
      input: params,
    });
  });
