import { GeospatialIndex } from "@convex-dev/geospatial";
import { NoOp } from "convex-helpers/server/customFunctions";
import { zCustomMutation, zCustomQuery } from "convex-helpers/server/zod";
import { components } from "./_generated/api";
import type { Id } from "./_generated/dataModel";
import {
  type MutationCtx,
  type QueryCtx,
  mutation,
  query,
} from "./_generated/server";

export const geospatial = new GeospatialIndex(components.geospatial);

export function withoutSystemFields<
  T extends { _creationTime: number; _id: Id<any> },
>(doc: T) {
  const { _id, _creationTime, ...rest } = doc;
  return rest;
}

async function getUser(ctx: MutationCtx | QueryCtx) {
  const identity = await ctx.auth.getUserIdentity();
  console.log("IDENTITY", identity);
  if (!identity) return null;

  const user = await ctx.db
    .query("user")
    .withIndex("by_id", (q) => q.eq("_id", identity.subject as any))
    .unique();
  if (!user) return null;

  return user;
}

export const authedMutation = zCustomMutation(mutation, {
  args: {},
  input: async (ctx, args) => {
    const user = await getUser(ctx);
    console.log("USER", user);
    if (!user) throw new Error("Unauthorized");

    return {
      ctx: {
        ...ctx,
        user,
      },
      args,
    };
  },
});

export const authedQuery = zCustomQuery(query, {
  args: {},
  input: async (ctx, args) => {
    const user = await getUser(ctx);
    console.log("USER", user);
    if (!user) throw new Error("Unauthorized");

    return { ctx: { ...ctx, user }, args };
  },
});

export const zodQuery = zCustomQuery(query, NoOp);
export const zodMutation = zCustomMutation(mutation, NoOp);
