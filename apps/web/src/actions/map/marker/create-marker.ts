"use server";
import { authAction } from "@/actions/safe-action";
import { IconName } from "@/components/icon";
import { db } from "@/server/db";
import { markers } from "@/server/db/schema";
import { NewMarker } from "@/types";
import { markersEditSchema } from "@/types/scheams";

export const createMarker = authAction
  .schema(markersEditSchema)
  .metadata({ name: "create-marker" })
  .action(async ({ parsedInput: params, ctx }) => {
    const newMarker: NewMarker = {
      ...params,
      icon: params.icon as IconName,
    };

    const marker = await db
      .insert(markers)
      .values(newMarker)
      .returning();

    if (!marker) {
      return new Error("Error creating new map.", {
        cause: marker,
      });
    }

    return marker
  });
