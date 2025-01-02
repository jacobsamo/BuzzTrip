"use server";
import { db } from "@/server/db";
import { createMap } from "@buzztrip/db/mutations";
import { z } from "zod";
import { authAction } from "../safe-action";

const schema = z.object({
  title: z.string(),
  description: z.string().nullish(),
});

export const createMapAction = authAction
  .schema(schema)
  .metadata({ name: "create-map" })
  .action(async ({ parsedInput: params, ctx }) => {
    const { map, shared_map } = await createMap(db, {
      userId: ctx.user.id,
      input: {
        ...params,
        userId: ctx.user.id,
      },
    });

    return {
      message: "Map created successfully",
      map,
      shared_map,
    };
  });
