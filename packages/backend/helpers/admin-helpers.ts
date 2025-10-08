import { QueryCtx } from "../convex/_generated/server";

/**
 * Check if the current user has admin role in Clerk metadata
 */
export async function isUserAdmin(ctx: QueryCtx): Promise<boolean> {
  const identity = await ctx.auth.getUserIdentity();
  if (!identity) return false;

  const metadata = identity.publicMetadata as { role?: string };
  return metadata?.role === "admin";
}

/**
 * Require admin role or throw error (for read-only queries)
 */
export async function requireAdmin(ctx: QueryCtx): Promise<void> {
  if (!(await isUserAdmin(ctx))) {
    throw new Error("Unauthorized: Admin access required");
  }
}
