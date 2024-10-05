"use server";
import { db } from "@buzztrip/db";
import { map_users, maps } from "@buzztrip/db/schema";
import { NewMap, NewMapUser } from "@buzztrip/db/types";
import { mapsEditSchema } from "@buzztrip/db/types/scheams";
import { authAction } from "../safe-action";
import { v4 as uuidv4 } from "uuid";
import { z } from "zod";

const schema = z.object({
  title: z.string(),
  description: z.string().nullish(),
});

export const createMap = authAction
  .schema(schema)
  .metadata({ name: "create-map" })
  .action(async ({ parsedInput: params, ctx }) => {
    const newMap: NewMap = {
      title: params.title,
      description: params.description,
      owner_id: ctx.user.id,
    };

    const createdMap = await db.insert(maps).values(newMap).returning();

    if (!createdMap || !createdMap[0]) {
      throw new Error("Error creating new map.", {
        cause: createdMap,
      });
    }

    const shared_map: NewMapUser = {
      map_id: createdMap[0].map_id,
      user_id: ctx.user.id,
      permission: "owner",
    };

    const sharedMap = await db.insert(map_users).values(shared_map).returning();

    if (!sharedMap) {
      throw new Error("Error creating new shared map.", {
        cause: sharedMap,
      });
    }

    return {
      message: "Map created successfully",
      map: createdMap[0] ?? null,
      shared_map: sharedMap ?? null,
    };
  });
