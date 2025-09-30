# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

# Convex guidelines + Clerk setup
- documentation: https://docs.convex.dev/
- extending convex with components:
    - documentation: https://docs.convex.dev/components
    - components list: https://www.convex.dev/components

## Extras
### Push Notifications
If you are doing a push notification related to data stored in convex follow this guide https://www.convex.dev/components/push-notifications, the base is already setup in the project the rest needs to be setup

### Zod
We are using the convex-helpers library to setup zod validation for convex this covers: table creation and querys/mutations validation, these zod schemas as located in @../src/zod-schemas/* there is a shared schemas file for shared items like default fields from convex and more to help with validation throughout the app.

## Function Guidelines

### New Function Syntax (REQUIRED)
ALWAYS use the new function syntax for Convex functions:

```typescript
import { query } from "./_generated/server";
import { v } from "convex/values";

export const f = query({
    args: {},
    returns: v.null(),
    handler: async (ctx, args) => {
        // Function body
    },
});
```

### HTTP Endpoint Syntax
HTTP endpoints are defined in `convex/http.ts`:

```typescript
import { httpRouter } from "convex/server";
import { httpAction } from "./_generated/server";

const http = httpRouter();
http.route({
    path: "/echo",
    method: "POST",
    handler: httpAction(async (ctx, req) => {
        const body = await req.bytes();
        return new Response(body, { status: 200 });
    }),
});
```

### Validators and Type Mapping

**Array Validator Example**:
```typescript
export const exampleMutation = mutation({
    args: {
        simpleArray: v.array(v.union(v.string(), v.number())),
    },
    handler: async (ctx, args) => {
        // Implementation
    },
});
```

**Discriminated Union Schema**:
```typescript
export default defineSchema({
    results: defineTable(
        v.union(
            v.object({
                kind: v.literal("error"),
                errorMessage: v.string(),
            }),
            v.object({
                kind: v.literal("success"),
                value: v.number(),
            }),
        ),
    )
});
```

**Always use `v.null()` for null returns**:
```typescript
export const exampleQuery = query({
    args: {},
    returns: v.null(),
    handler: async (ctx, args) => {
        console.log("This query returns a null value");
        return null;
    },
});
```

### Convex Type Reference Table

| Convex Type | TS/JS Type  | Example Usage         | Validator                              | Notes                                                                                                                                                                                                 |
|-------------|-------------|-----------------------|----------------------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Id          | string      | `doc._id`             | `v.id(tableName)`                      |                                                                                                                                                                                                       |
| Null        | null        | `null`                | `v.null()`                             | JavaScript's `undefined` is not a valid Convex value. Functions that return `undefined` or do not return will return `null` when called from a client. Use `null` instead.                        |
| Int64       | bigint      | `3n`                  | `v.int64()`                            | Int64s only support BigInts between -2^63 and 2^63-1. Convex supports `bigint`s in most modern browsers.                                                                                           |
| Float64     | number      | `3.1`                 | `v.number()`                           | Convex supports all IEEE-754 double-precision floating point numbers (such as NaNs). Inf and NaN are JSON serialized as strings.                                                                  |
| Boolean     | boolean     | `true`                | `v.boolean()`                          |                                                                                                                                                                                                       |
| String      | string      | `"abc"`               | `v.string()`                           | Strings are stored as UTF-8 and must be valid Unicode sequences. Strings must be smaller than the 1MB total size limit when encoded as UTF-8.                                                     |
| Bytes       | ArrayBuffer | `new ArrayBuffer(8)`  | `v.bytes()`                            | Convex supports first class bytestrings, passed in as `ArrayBuffer`s. Bytestrings must be smaller than the 1MB total size limit for Convex types.                                                |
| Array       | Array       | `[1, 3.2, "abc"]`     | `v.array(values)`                      | Arrays can have at most 8192 values.                                                                                                                                                                |
| Object      | Object      | `{a: "abc"}`          | `v.object({property: value})`          | Convex only supports "plain old JavaScript objects" (objects that do not have a custom prototype). Objects can have at most 1024 entries. Field names must be nonempty and not start with "$" or "_". |
| Record      | Record      | `{"a": "1", "b": "2"}` | `v.record(keys, values)`               | Records are objects at runtime, but can have dynamic keys. Keys must be only ASCII characters, nonempty, and not start with "$" or "_".                                                           |

## Function Registration

- Use `internalQuery`, `internalMutation`, and `internalAction` for **private** functions (imported from `./_generated/server`)
- Use `query`, `mutation`, and `action` for **public** functions (exposed to public Internet)
- **ALWAYS** include argument and return validators for ALL Convex functions
- If a function doesn't return anything, include `returns: v.null()`

## Function Calling

- Use `ctx.runQuery` to call a query from a query, mutation, or action
- Use `ctx.runMutation` to call a mutation from a mutation or action
- Use `ctx.runAction` to call an action from an action
- All calls take a `FunctionReference` - do NOT pass the function directly

**Type Annotation Example for Same-File Calls**:
```typescript
export const f = query({
    args: { name: v.string() },
    returns: v.string(),
    handler: async (ctx, args) => {
        return "Hello " + args.name;
    },
});

export const g = query({
    args: {},
    returns: v.null(),
    handler: async (ctx, args) => {
        const result: string = await ctx.runQuery(api.example.f, { name: "Bob" });
        return null;
    },
});
```

## Function References

- Use `api` object for public functions: `api.example.f`
- Use `internal` object for internal functions: `internal.example.g`
- Convex uses file-based routing: `convex/messages/access.ts` → `api.messages.access.functionName`

## API Design

- Thoughtfully organize files within the `convex/` directory
- Use public functions for client-facing APIs
- Use internal functions for server-side logic

## Pagination

```typescript
import { paginationOptsValidator } from "convex/server";

export const listWithPagination = query({
    args: { paginationOpts: paginationOptsValidator, author: v.string() },
    handler: async (ctx, args) => {
        return await ctx.db
            .query("messages")
            .filter((q) => q.eq(q.field("author"), args.author))
            .order("desc")
            .paginate(args.paginationOpts);
    },
});
```

**PaginationOpts Properties**:
- `numItems`: maximum number of documents to return (`v.number()`)
- `cursor`: cursor for next page (`v.union(v.string(), v.null())`)

**Paginate Response**:
- `page`: array of documents
- `isDone`: boolean indicating if this is the last page
- `continueCursor`: string cursor for the next page

## Schema Guidelines

- Always define schema in `convex/schema.ts`
- Import schema definition functions from `convex/server`
- System fields `_creationTime` (`v.number()`) and `_id` (`v.id(tableName)`) are automatically added
- **Index naming**: Include all index fields in the name (e.g., "by_field1_and_field2")
- Index fields must be queried in the same order they are defined

## TypeScript Guidelines

### Type Helpers
```typescript
import { Doc, Id } from "./_generated/dataModel";

// Use Id<'tableName'> for document IDs
const userId: Id<'users'> = "user123";

// Record example with proper typing
export const getUsernames = query({
    args: { userIds: v.array(v.id("users")) },
    returns: v.record(v.id("users"), v.string()),
    handler: async (ctx, args) => {
        const idToUsername: Record<Id<"users">, string> = {};
        for (const userId of args.userIds) {
            const user = await ctx.db.get(userId);
            if (user) {
                idToUsername[user._id] = user.username;
            }
        }
        return idToUsername;
    },
});
```

### Type Safety Best Practices
- Be strict with types, especially document IDs
- Use `as const` for string literals in discriminated unions
- Define arrays as `const array: Array<T> = [...];`
- Define records as `const record: Record<KeyType, ValueType> = {...};`
- Add `@types/node` when using Node.js built-in modules

## Query Guidelines

- **DO NOT** use `filter` in queries - use indexes with `withIndex` instead
- Use `.unique()` to get a single document (throws error if multiple matches)
- For deletion: `.collect()` results, then iterate and call `ctx.db.delete(row._id)`
- For async iteration: use `for await (const row of query)` syntax

### Ordering
- Default order: ascending `_creationTime`
- Use `.order('asc')` or `.order('desc')` to specify order
- Index-based queries are ordered by index columns

## Mutation Guidelines

- Use `ctx.db.replace` to fully replace an existing document
- Use `ctx.db.patch` to shallow merge updates into an existing document
- Both methods throw errors if the document does not exist

## Action Guidelines

- Add `"use node";` to the top of files using Node.js built-in modules
- **Never** use `ctx.db` inside actions - they don't have database access

```typescript
export const exampleAction = action({
    args: {},
    returns: v.null(),
    handler: async (ctx, args) => {
        console.log("This action does not return anything");
        return null;
    },
});
```

## Cron Jobs

```typescript
import { cronJobs } from "convex/server";
import { internal } from "./_generated/api";

const crons = cronJobs();

// Use interval or cron methods (NOT hourly, daily, weekly helpers)
crons.interval("delete inactive users", { hours: 2 }, internal.crons.cleanup, {});

export default crons;
```

## File Storage

- Use `ctx.storage.getUrl()` for signed URLs (returns `null` if file doesn't exist)
- **DO NOT** use deprecated `ctx.storage.getMetadata`
- Query `_storage` system table instead:

```typescript
export const getFileMetadata = query({
    args: { fileId: v.id("_storage") },
    returns: v.union(v.object({
        _id: v.id("_storage"),
        _creationTime: v.number(),
        contentType: v.optional(v.string()),
        sha256: v.string(),
        size: v.number(),
    }), v.null()),
    handler: async (ctx, args) => {
        return await ctx.db.system.get(args.fileId);
    },
});
```

## Full Text Search

```typescript
const messages = await ctx.db
    .query("messages")
    .withSearchIndex("search_body", (q) =>
        q.search("body", "hello hi").eq("channel", "#general"),
    )
    .take(10);
```

## Convex-Helpers Integration

When using convex-helpers for enhanced functionality:

```typescript
import { zodToConvex } from "convex-helpers/server/zod";
import { withUser } from "convex-helpers/server/sessions";

// Zod schema conversion
defineTable(zodToConvex(myZodSchema))

// Session helpers for authentication
export const protectedQuery = withUser(query({
    args: {},
    returns: v.null(),
    handler: async (ctx, args) => {
        // ctx.user is automatically available
    },
}));
```

## Project-Specific Patterns

### BuzzTrip Schema Structure
The project uses these main table groups:
- **Maps**: `maps`, `markers`, `collections`, `paths`, `labels`
- **Places**: `places`, `places_reviews`, `place_photos`
- **Users**: `users` with Clerk integration
- **Relationships**: `map_users`, `collection_links`, `route_stops`

### Common Exports
The package exports these utilities for use in apps:
- `./api` - Generated API types
- `./dataModel` - Generated data model types
- `./zod-schemas` - Zod validation schemas
- `./types` - Custom TypeScript types
- `./helpers` - Utility functions
- `./generateId` - ID generation utilities