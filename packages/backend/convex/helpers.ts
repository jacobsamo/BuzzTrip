import { GeospatialIndex } from "@convex-dev/geospatial";
import { NoOp } from "convex-helpers/server/customFunctions";
import {
  zCustomAction,
  zCustomMutation,
  zCustomQuery,
} from "convex-helpers/server/zod4";
import { components } from "./_generated/api";
import type { Id } from "./_generated/dataModel";
import {
  type MutationCtx,
  type QueryCtx,
  action,
  internalMutation,
  mutation,
  query,
} from "./_generated/server";

/**
 * Logs a map event to the mapEvents table
 * @param ctx - The mutation context
 * @param mapId - The ID of the map
 * @param event - The event type (e.g., "marker.create", "path.delete")
 * @param details - Additional metadata to store (e.g., document IDs, important fields)
 * @param userId - Optional user ID (defaults to authenticated user if available)
 */
export async function logMapEvent(
  ctx: MutationCtx,
  mapId: Id<"maps">,
  event: string,
  details: Record<string, any> = {},
  userId?: Id<"users">
) {
  await ctx.db.insert("mapEvents", {
    mapId,
    event,
    details,
    userId,
    isArchived: false,
  });
}

export const geospatial = new GeospatialIndex(components.geospatial);

async function getUser(ctx: MutationCtx | QueryCtx) {
  const identity = await ctx.auth.getUserIdentity();
  console.log("IDENTITY", identity);
  if (!identity) return null;

  const user = await ctx.db
    .query("users")
    .withIndex("by_clerk_id", (q) =>
      q.eq("clerkUserId", identity.subject as any)
    )
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
export const zodInternalMutation = zCustomMutation(internalMutation, NoOp);
export const zodAction = zCustomAction(action, NoOp);
