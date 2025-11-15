import { zid, zodToConvex } from "convex-helpers/server/zod4";
import { defineTable } from "convex/server";
import * as z from "zod";

/**
 * Defines a Convex table schema with automatic _id and _creationTime fields using convex-helpers.
 *
 * @example
 * ```typescript
 * // Define a table schema
 * const userTable = defineTable("users", {
 *   clerkUserId: z.string(),
 *   name: z.string(),
 *   email: z.string().email(),
 *   role: z.enum(["admin", "user"])
 * });
 *
 * // Use as a normal Zod schema
 * export const userSchema = userTable.schema;
 * type User = z.infer<typeof userTable.schema>;
 *
 * // Get insert schema (optional _id/_creationTime that can't be overridden)
 * const insertUserSchema = userTable.insertSchema();
 * type InsertUser = z.infer<typeof insertUserSchema>;
 *
 * // Get update schema (all fields partial, no _id/_creationTime)
 * const updateUserSchema = userTable.updateSchema();
 * type UpdateUser = z.infer<typeof updateUserSchema>;
 *
 *
 * // Use in Convex schema.ts
 * import { defineSchema } from "convex/server";
 *
 * export default defineSchema({
 *   users: userTable.table()
 *     .index("by_email", ["email"])
 *     .index("by_clerk_id", ["clerkUserId"])
 * });
 *
 * // Or export just the schema for mutations/queries
 * export const { schema: userSchema, insert: userInsert, update: userUpdate } = userTable;
 * ```
 *
 * @param {string} tableName - The name of the Convex table
 * @param {{ [key: string]: z.ZodType }} schema - Zod object shape defining the table fields (without _id and _creationTime)
 * @returns Object with schema, insert(), update(), table() methods and tableName
 */
export const zodTable = <
  Table extends string,
  T extends { [key: string]: z.ZodType },
>(
  tableName: Table,
  schema: T
) => {
  // add _id and _creationTime
  const fullSchema = z.object({
    ...schema,
    _id: zid(tableName),
    _creationTime: z.number(),
  });

  const insertSchema = fullSchema.partial({
    _id: true,
    _creationTime: true,
  });

  const updateSchema = fullSchema
    .omit({ _id: true, _creationTime: true })
    .partial();

  return {
    /**
     * The table name
     */
    tableName,

    /**
     * The complete Zod schema including _id and _creationTime.
     * Use this for type inference and validation of full table rows.
     *
     * @example
     * type User = z.infer<typeof userTable.schema>;
     */
    schema: fullSchema,

    /**
     * Returns an insert schema where _id and _creationTime are optional.
     * These fields cannot be overridden - Convex will generate them automatically.
     *
     * @example
     * ```typescript
     *
     * // In a mutation
     * export const createUser = mutation({
     *   args: userTable.insertSchema,
     *   handler: async (ctx, args) => {
     *     await ctx.db.insert("users", args);
     *   }
     * });
     * ```
     */
    insertSchema,

    /**
     * Returns an update schema where all fields are partial and _id/_creationTime are omitted.
     * Use this for patch operations where you only want to update specific fields.
     *
     * @example
     * ```typescript
     *
     * // In a mutation
     * export const updateUser = mutation({
     *   args: {
     *     userId: zid("users"),
     *     updates: userTable.updateSchema,
     *   },
     *   handler: async (ctx, args) => {
     *     await ctx.db.patch(args.userId, args.updates);
     *   }
     * });
     * ```
     */
    updateSchema,

    /**
     * Converts the Zod schema to a Convex Table
     * This uses the zodToConvex helper from convex-helpers. and the defineTable from "convex/server" to return a table
     *
     * @example
     * ```typescript
     * import { defineSchema } from "convex/server";
     *
     * export default defineSchema({
     *   users: userTable.table()
     *     .index("by_email", ["email"])
     * });
     * ```
     */
    table: () => {
      return defineTable(zodToConvex(fullSchema));
    },
  };
};
