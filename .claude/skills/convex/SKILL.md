---
name: convex
description: Comprehensive Convex development skill for implementing backend features with Zod validation, custom function wrappers, and convex-helpers utilities.
---

# Convex Development Skill

This skill provides comprehensive guidance for implementing Convex backend features in the BuzzTrip project.

## Quick Reference

### Essential Files to Read First

Before implementing any Convex feature, read these files:

1. `packages/backend/convex/helpers.ts` - Custom function wrappers
2. `packages/backend/zod-schemas/shared-schemas.ts` - Schema helper utilities
3. `packages/backend/convex/schema.ts` - Current schema and indexes
4. `packages/backend/CLAUDE.md` - Convex guidelines
5. `.cursor/rules/convex-helpers.mdc` - Full convex-helpers documentation

### Function Wrappers (from helpers.ts)

Use these custom wrappers instead of raw query/mutation:

- **`authedQuery`** - Authenticated queries (ctx.user auto-injected)
- **`authedMutation`** - Authenticated mutations (ctx.user auto-injected)
- **`zodQuery`** - Queries with Zod validation (no auth)
- **`zodMutation`** - Mutations with Zod validation (no auth)
- **`zodInternalMutation`** - Internal mutations with Zod validation

### Schema Helpers (from shared-schemas.ts)

- **`defaultSchema(schema)`** - Adds `_id` and `_creationTime` fields
- **`insertSchema(schema)`** - Makes system fields optional
- **`editSchema(schema)`** - Makes all fields optional

### Type-Safe IDs

Always use `zid("tableName")` from `convex-helpers/server/zod` for ID validation.

## Implementation Workflow

### 1. Design Zod Schema

Create schema in `packages/backend/zod-schemas/[feature]-schema.ts`:

```typescript
import { zid } from "convex-helpers/server/zod";
import * as z from "zod";
import { defaultSchema, insertSchema } from "./shared-schemas";

// Full document schema with system fields
export const myTableSchema = defaultSchema(
  z.object({
    name: z.string(),
    userId: zid("users"),
    status: z.enum(["active", "inactive"]),
  })
);

// Schema for insertions (system fields optional)
export const myTableInsertSchema = insertSchema(myTableSchema);

// Schema for updates (all fields optional)
export const myTableEditSchema = myTableInsertSchema.partial();
```

### 2. Add Table to Schema

Update `packages/backend/convex/schema.ts`:

```typescript
import { zodToConvex } from "convex-helpers/server/zod";
import { myTableSchema } from "../zod-schemas/[feature]-schema";

export default defineSchema({
  myTable: defineTable(zodToConvex(myTableSchema))
    .index("by_user_id", ["userId"])
    .index("by_status", ["status"]),
  // ... other tables
});
```

### 3. Implement Functions

Create functions in `packages/backend/convex/[feature]/[name].ts`:

```typescript
import { zid } from "convex-helpers/server/zod";
import { authedQuery, authedMutation } from "../helpers";
import { myTableInsertSchema } from "../../zod-schemas/[feature]-schema";

// Authenticated query
export const getItem = authedQuery({
  args: {
    itemId: zid("myTable"),
  },
  handler: async (ctx, args) => {
    // ctx.user is automatically available
    return await ctx.db.get(args.itemId);
  },
});

// Authenticated mutation
export const createItem = authedMutation({
  args: myTableInsertSchema.omit({ _id: true, _creationTime: true }),
  handler: async (ctx, args) => {
    const itemId = await ctx.db.insert("myTable", {
      ...args,
      userId: ctx.user._id,
    });
    return itemId;
  },
});

// Update mutation
export const updateItem = authedMutation({
  args: {
    itemId: zid("myTable"),
    updates: myTableEditSchema.omit({ _id: true, _creationTime: true }).partial(),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.itemId, args.updates);
  },
});
```

## Query Optimization Best Practices

### Always Use Indexes

❌ **Bad** - Using filter on large datasets:
```typescript
const items = await ctx.db
  .query("myTable")
  .filter((q) => q.eq(q.field("userId"), userId))
  .collect();
```

✅ **Good** - Using index:
```typescript
const items = await ctx.db
  .query("myTable")
  .withIndex("by_user_id", (q) => q.eq("userId", userId))
  .collect();
```

### Index Naming Convention

Include all indexed fields in the name:
- Single field: `"by_user_id"`
- Multiple fields: `"by_user_id_and_status"`
- Search index: `"search_name"`

### Query Field Order

Query fields must match index order:

```typescript
// Index defined as:
.index("by_status_and_user_id", ["status", "userId"])

// Query must use same order:
.withIndex("by_status_and_user_id", (q) =>
  q.eq("status", "active").eq("userId", userId)
)
```

## Relationship Patterns

Use convex-helpers relationship utilities:

```typescript
import { getOneFrom, getManyFrom } from "convex-helpers/server/relationships";
import { asyncMap } from "convex-helpers";

// Get single related document
const user = await getOneFrom(ctx.db, "users", "_id", userId);

// Get multiple related documents
const items = await getManyFrom(ctx.db, "items", "userId", userId);

// Map over results with async operations
const enrichedItems = await asyncMap(items, async (item) => {
  const details = await ctx.db.get(item.detailsId);
  return { ...item, details };
});
```

## Authentication Pattern

The `getUser()` helper in `convex/helpers.ts` handles authentication:

```typescript
async function getUser(ctx: MutationCtx | QueryCtx) {
  const identity = await ctx.auth.getUserIdentity();
  if (!identity) return null;

  return await ctx.db
    .query("users")
    .withIndex("by_clerk_id", (q) => q.eq("clerkUserId", identity.subject))
    .unique();
}
```

When using `authedQuery` or `authedMutation`, `ctx.user` is automatically available.

## Pagination

Use built-in pagination or convex-helpers `paginator`:

```typescript
import { paginationOptsValidator } from "convex/server";

export const listItems = authedQuery({
  args: {
    paginationOpts: paginationOptsValidator,
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("items")
      .withIndex("by_user_id", (q) => q.eq("userId", ctx.user._id))
      .order("desc")
      .paginate(args.paginationOpts);
  },
});
```

## Error Handling

Always handle errors gracefully:

```typescript
export const createItem = authedMutation({
  args: mySchema,
  handler: async (ctx, args) => {
    try {
      const itemId = await ctx.db.insert("items", {
        ...args,
        userId: ctx.user._id,
      });
      return itemId;
    } catch (error) {
      console.error("Failed to create item:", error);
      throw new Error("Failed to create item");
    }
  },
});
```

## Common Patterns

### Soft Delete

Add `deletedAt` field instead of deleting:

```typescript
export const deleteItem = authedMutation({
  args: { itemId: zid("items") },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.itemId, {
      deletedAt: new Date().toISOString(),
    });
  },
});
```

### Timestamps

Add `updatedAt` field for tracking changes:

```typescript
await ctx.db.patch(itemId, {
  ...updates,
  updatedAt: new Date().toISOString(),
});
```

### Validation with Zod Refinements

```typescript
export const mySchema = z.object({
  icon: iconSchema.nullish(),
  color: z.string().optional(),
}).refine(
  (data) => !(data.icon === null && data.color === null),
  {
    message: "Either icon or color must be provided.",
    path: ["icon"],
  }
);
```

## Component Integration

### Geospatial Queries

```typescript
import { geospatial } from "../helpers";

export const nearbyItems = authedQuery({
  args: {
    lat: z.number(),
    lng: z.number(),
    radiusMeters: z.number(),
  },
  handler: async (ctx, args) => {
    return await geospatial.query(
      ctx.db,
      "items",
      { lat: args.lat, lng: args.lng },
      args.radiusMeters
    );
  },
});
```

## Debugging Tips

1. **Check indexes** - Ensure index exists for your query pattern
2. **Verify field names** - Match exact field names in index and query
3. **Test with dashboard** - Use Convex dashboard to test queries
4. **Read logs** - Check function logs for errors
5. **Type safety** - Let TypeScript catch issues at compile time

## Resources

- **Convex Docs**: https://docs.convex.dev
- **Convex Components**: https://www.convex.dev/components
- **convex-helpers**: See `.cursor/rules/convex-helpers.mdc`
- **Stack Articles**: https://stack.convex.dev

## Checklist Before Implementation

- [ ] Read `packages/backend/convex/helpers.ts` for available wrappers
- [ ] Read `packages/backend/zod-schemas/shared-schemas.ts` for schema utilities
- [ ] Check `packages/backend/convex/schema.ts` for existing tables/indexes
- [ ] Review similar implementations in `packages/backend/convex/` directories
- [ ] Design Zod schema with proper helpers
- [ ] Add table to schema.ts with appropriate indexes
- [ ] Implement functions using appropriate wrappers
- [ ] Add JSDoc comments for complex logic
- [ ] Test with Convex dashboard
- [ ] Verify TypeScript types are correct

Follow BuzzTrip's established patterns for clean, maintainable Convex code!
