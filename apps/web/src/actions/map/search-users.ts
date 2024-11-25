"use server";
import { db } from "@/server/db";
import { map_users, maps } from "@buzztrip/db/schema";
import { NewMap, NewMapUser } from "@buzztrip/db/types";
import { searchUsers } from "@buzztrip/db/queries";
import { authAction } from "../safe-action";
import { v4 as uuidv4 } from "uuid";
import { z } from "zod";

const schema = z.object({
  query: z.string(),
});

export const searchUsersAction = authAction
  .schema(schema)
  .metadata({ name: "search-users" })
  .action(async ({ parsedInput: params, ctx }) => {
    return await searchUsers(db, params.query);
  });
