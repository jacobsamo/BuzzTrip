import { QueryCtx } from "../convex/_generated/server";

/**
 * Check if the current user has admin role in Clerk metadata
 *
 * Note: Requires Clerk JWT template to include publicMetadata claim:
 * In Clerk Dashboard > JWT Templates > convex > Claims, add:
 * "public_metadata": {{user.public_metadata}}
 */
export async function isUserAdmin(ctx: QueryCtx): Promise<boolean> {
  const identity = await ctx.auth.getUserIdentity();
  if (!identity) return false;

  // Access publicMetadata from JWT claims (requires JWT template configuration)
  const publicMetadata = (identity as any).public_metadata as { role?: string } | undefined;
  return publicMetadata?.role === "admin";
}

/**
 * Require admin role or throw error (for read-only queries)
 */
export async function requireAdmin(ctx: QueryCtx): Promise<void> {
  if (!(await isUserAdmin(ctx))) {
    throw new Error("Unauthorized: Admin access required");
  }
}
