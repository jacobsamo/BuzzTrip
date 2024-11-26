"use server";
import { db } from "@/server/db";
import { map_users } from "@buzztrip/db/schema";
import { NewMapUser } from "@buzztrip/db/types";
import { permissionEnumSchema } from "@buzztrip/db/zod-schemas";
import { z } from "zod";
import { authAction } from "../safe-action";

const schema = z.object({
  map_id: z.string(),
  users: z.array(
    z.object({ user_id: z.string(), permission: permissionEnumSchema })
  ),
});

export const shareMap = authAction
  .schema(schema)
  .metadata({ name: "share-map" })
  .action(async ({ parsedInput: params, ctx }) => {
    await Promise.all(
      params.users.map(async (user) => {
        const newMapUser: NewMapUser = {
          map_id: params.map_id,
          user_id: user.user_id,
          permission: user.permission,
        };

        const result = await db.insert(map_users).values(newMapUser);

        if (!result) {
          throw new Error("Error creating new map user", {
            cause: result,
          });
        }
      })
    );

    return {
      message: "Shared map to users successfully",
    };
  });
