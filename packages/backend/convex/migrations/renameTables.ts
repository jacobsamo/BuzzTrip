/**
 * Migration: Rename snake_case tables to camelCase
 *
 * IMPORTANT: Convex doesn't support renaming tables directly.
 * This migration creates NEW tables and copies data from old tables.
 *
 * Tables being renamed:
 * - map_users -> mapUsers
 * - collection_links -> collectionLinks
 * - route_stops -> routeStops
 * - places_reviews -> placesReviews
 * - place_photos -> placePhotos
 * - beta_users -> betaUsers
 *
 * STEPS:
 * 1. First run the field name migration (snakeToCamel)
 * 2. Update schema.ts to include BOTH old and new table definitions
 * 3. Deploy schema
 * 4. Run this migration to copy data
 * 5. Update all code to use new table names
 * 6. Remove old table definitions from schema
 * 7. Deploy again
 *
 * Run with: npx convex run migrations/renameTables:migrateAllTables
 */

import { internalMutation, internalQuery } from "../_generated/server";
import { v } from "convex/values";

// ============================================================================
// TABLE MIGRATION STATUS
// ============================================================================

export const getTableMigrationStatus = internalQuery({
  args: {},
  handler: async (ctx) => {
    const tablePairs = [
      { old: "map_users", new: "mapUsers" },
      { old: "collection_links", new: "collectionLinks" },
      { old: "route_stops", new: "routeStops" },
      { old: "places_reviews", new: "placesReviews" },
      { old: "place_photos", new: "placePhotos" },
      { old: "beta_users", new: "betaUsers" },
    ];

    const status: Record<
      string,
      { oldCount: number; newCount: number; migrated: boolean }
    > = {};

    for (const { old: oldTable, new: newTable } of tablePairs) {
      try {
        const oldDocs = await ctx.db.query(oldTable as any).collect();
        let newDocs: any[] = [];
        try {
          newDocs = await ctx.db.query(newTable as any).collect();
        } catch {
          // New table doesn't exist yet
        }

        status[`${oldTable} -> ${newTable}`] = {
          oldCount: oldDocs.length,
          newCount: newDocs.length,
          migrated: oldDocs.length === newDocs.length,
        };
      } catch (e) {
        status[`${oldTable} -> ${newTable}`] = {
          oldCount: 0,
          newCount: 0,
          migrated: false,
        };
      }
    }

    return status;
  },
});

// ============================================================================
// INDIVIDUAL TABLE MIGRATIONS
// ============================================================================

/**
 * Migrate map_users -> mapUsers
 */
export const migrateMapUsersTable = internalMutation({
  args: { batchSize: v.optional(v.number()) },
  handler: async (ctx, { batchSize = 100 }) => {
    const oldDocs = await ctx.db.query("map_users").collect();
    let migrated = 0;

    for (const doc of oldDocs.slice(0, batchSize)) {
      // Check if already exists in new table (by checking old _id reference)
      // Since we can't use the same _id, we need to track by unique combination
      const existing = await ctx.db
        .query("mapUsers" as any)
        .filter((q) =>
          q.and(
            q.eq(q.field("mapId"), doc.mapId ?? (doc as any).map_id),
            q.eq(q.field("userId"), doc.userId ?? (doc as any).user_id)
          )
        )
        .first();

      if (!existing) {
        await ctx.db.insert("mapUsers" as any, {
          mapId: doc.mapId ?? (doc as any).map_id,
          userId: doc.userId ?? (doc as any).user_id,
          permission: doc.permission,
          isArchived: (doc as any).isArchived ?? false,
          updatedAt: (doc as any).updatedAt,
        });
        migrated++;
      }
    }

    return { migrated, total: oldDocs.length };
  },
});

/**
 * Migrate collection_links -> collectionLinks
 */
export const migrateCollectionLinksTable = internalMutation({
  args: { batchSize: v.optional(v.number()) },
  handler: async (ctx, { batchSize = 100 }) => {
    const oldDocs = await ctx.db.query("collection_links").collect();
    let migrated = 0;

    for (const doc of oldDocs.slice(0, batchSize)) {
      const existing = await ctx.db
        .query("collectionLinks" as any)
        .filter((q) =>
          q.and(
            q.eq(q.field("collectionId"), doc.collectionId ?? (doc as any).collection_id),
            q.eq(q.field("markerId"), doc.markerId ?? (doc as any).marker_id)
          )
        )
        .first();

      if (!existing) {
        await ctx.db.insert("collectionLinks" as any, {
          collectionId: doc.collectionId ?? (doc as any).collection_id,
          markerId: doc.markerId ?? (doc as any).marker_id,
          mapId: doc.mapId ?? (doc as any).map_id,
          userId: doc.userId ?? (doc as any).user_id,
          isArchived: (doc as any).isArchived ?? false,
          updatedAt: (doc as any).updatedAt,
        });
        migrated++;
      }
    }

    return { migrated, total: oldDocs.length };
  },
});

/**
 * Migrate route_stops -> routeStops
 */
export const migrateRouteStopsTable = internalMutation({
  args: { batchSize: v.optional(v.number()) },
  handler: async (ctx, { batchSize = 100 }) => {
    const oldDocs = await ctx.db.query("route_stops").collect();
    let migrated = 0;

    for (const doc of oldDocs.slice(0, batchSize)) {
      const existing = await ctx.db
        .query("routeStops" as any)
        .filter((q) =>
          q.and(
            q.eq(q.field("routeId"), doc.routeId ?? (doc as any).route_id),
            q.eq(q.field("markerId"), doc.markerId ?? (doc as any).marker_id)
          )
        )
        .first();

      if (!existing) {
        await ctx.db.insert("routeStops" as any, {
          mapId: doc.mapId ?? (doc as any).map_id,
          routeId: doc.routeId ?? (doc as any).route_id,
          markerId: doc.markerId ?? (doc as any).marker_id,
          userId: doc.userId ?? (doc as any).user_id,
          lat: doc.lat,
          lng: doc.lng,
          stopOrder: doc.stopOrder ?? (doc as any).stop_order,
          isArchived: (doc as any).isArchived ?? false,
          updatedAt: (doc as any).updatedAt,
        });
        migrated++;
      }
    }

    return { migrated, total: oldDocs.length };
  },
});

/**
 * Migrate places_reviews -> placesReviews
 */
export const migratePlacesReviewsTable = internalMutation({
  args: { batchSize: v.optional(v.number()) },
  handler: async (ctx, { batchSize = 100 }) => {
    const oldDocs = await ctx.db.query("places_reviews").collect();
    let migrated = 0;

    for (const doc of oldDocs.slice(0, batchSize)) {
      const existing = await ctx.db
        .query("placesReviews" as any)
        .filter((q) =>
          q.and(
            q.eq(q.field("placeId"), doc.placeId),
            q.eq(q.field("userId"), doc.userId)
          )
        )
        .first();

      if (!existing) {
        await ctx.db.insert("placesReviews" as any, {
          placeId: doc.placeId,
          userId: doc.userId,
          authorName: doc.authorName,
          authorUrl: doc.authorUrl,
          profilePhotoUrl: doc.profilePhotoUrl,
          rating: doc.rating,
          description: doc.description,
          isArchived: (doc as any).isArchived ?? false,
          updatedAt: (doc as any).updatedAt,
        });
        migrated++;
      }
    }

    return { migrated, total: oldDocs.length };
  },
});

/**
 * Migrate place_photos -> placePhotos
 */
export const migratePlacePhotosTable = internalMutation({
  args: { batchSize: v.optional(v.number()) },
  handler: async (ctx, { batchSize = 100 }) => {
    const oldDocs = await ctx.db.query("place_photos").collect();
    let migrated = 0;

    for (const doc of oldDocs.slice(0, batchSize)) {
      const existing = await ctx.db
        .query("placePhotos" as any)
        .filter((q) =>
          q.and(
            q.eq(q.field("placeId"), doc.placeId),
            q.eq(q.field("photoUrl"), doc.photoUrl)
          )
        )
        .first();

      if (!existing) {
        await ctx.db.insert("placePhotos" as any, {
          placeId: doc.placeId,
          userId: doc.userId,
          photoUrl: doc.photoUrl,
          width: doc.width,
          height: doc.height,
          caption: doc.caption,
          isArchived: (doc as any).isArchived ?? false,
          updatedAt: (doc as any).updatedAt,
        });
        migrated++;
      }
    }

    return { migrated, total: oldDocs.length };
  },
});

/**
 * Migrate beta_users -> betaUsers
 */
export const migrateBetaUsersTable = internalMutation({
  args: { batchSize: v.optional(v.number()) },
  handler: async (ctx, { batchSize = 100 }) => {
    const oldDocs = await ctx.db.query("beta_users").collect();
    let migrated = 0;

    for (const doc of oldDocs.slice(0, batchSize)) {
      const existing = await ctx.db
        .query("betaUsers" as any)
        .filter((q) => q.eq(q.field("email"), doc.email))
        .first();

      if (!existing) {
        await ctx.db.insert("betaUsers" as any, {
          email: doc.email,
          firstName: doc.firstName,
          lastName: doc.lastName,
          token: doc.token,
          expiresAt: doc.expiresAt,
          emailConfirmed: doc.emailConfirmed,
          emailConfirmedAt: doc.emailConfirmedAt,
          questionnaireCompleted: doc.questionnaireCompleted,
          questionnaireCompletedAt: doc.questionnaireCompletedAt,
          whatsappOptIn: doc.whatsappOptIn,
          questionnaireResponses: doc.questionnaireResponses,
          userId: doc.userId,
          createdAt: doc.createdAt,
          updatedAt: doc.updatedAt,
          isArchived: (doc as any).isArchived ?? false,
        });
        migrated++;
      }
    }

    return { migrated, total: oldDocs.length };
  },
});

// ============================================================================
// BATCH MIGRATION RUNNER
// ============================================================================

export const migrateAllTables = internalMutation({
  args: {},
  handler: async () => {
    return {
      message: "Run individual table migrations in this order:",
      steps: [
        "1. npx convex run migrations/renameTables:migrateMapUsersTable",
        "2. npx convex run migrations/renameTables:migrateCollectionLinksTable",
        "3. npx convex run migrations/renameTables:migrateRouteStopsTable",
        "4. npx convex run migrations/renameTables:migratePlacesReviewsTable",
        "5. npx convex run migrations/renameTables:migratePlacePhotosTable",
        "6. npx convex run migrations/renameTables:migrateBetaUsersTable",
      ],
      note: "After all migrations complete, update code to use new table names and remove old tables from schema.",
    };
  },
});

// ============================================================================
// CLEANUP: Delete old tables after verifying migration
// ============================================================================

export const deleteOldMapUsers = internalMutation({
  args: { confirm: v.boolean() },
  handler: async (ctx, { confirm }) => {
    if (!confirm) {
      return { message: "Set confirm: true to delete old map_users data" };
    }

    const oldDocs = await ctx.db.query("map_users").collect();
    for (const doc of oldDocs) {
      await ctx.db.delete(doc._id);
    }
    return { deleted: oldDocs.length };
  },
});

export const deleteOldCollectionLinks = internalMutation({
  args: { confirm: v.boolean() },
  handler: async (ctx, { confirm }) => {
    if (!confirm) {
      return { message: "Set confirm: true to delete old collection_links data" };
    }

    const oldDocs = await ctx.db.query("collection_links").collect();
    for (const doc of oldDocs) {
      await ctx.db.delete(doc._id);
    }
    return { deleted: oldDocs.length };
  },
});

export const deleteOldRouteStops = internalMutation({
  args: { confirm: v.boolean() },
  handler: async (ctx, { confirm }) => {
    if (!confirm) {
      return { message: "Set confirm: true to delete old route_stops data" };
    }

    const oldDocs = await ctx.db.query("route_stops").collect();
    for (const doc of oldDocs) {
      await ctx.db.delete(doc._id);
    }
    return { deleted: oldDocs.length };
  },
});

export const deleteOldPlacesReviews = internalMutation({
  args: { confirm: v.boolean() },
  handler: async (ctx, { confirm }) => {
    if (!confirm) {
      return { message: "Set confirm: true to delete old places_reviews data" };
    }

    const oldDocs = await ctx.db.query("places_reviews").collect();
    for (const doc of oldDocs) {
      await ctx.db.delete(doc._id);
    }
    return { deleted: oldDocs.length };
  },
});

export const deleteOldPlacePhotos = internalMutation({
  args: { confirm: v.boolean() },
  handler: async (ctx, { confirm }) => {
    if (!confirm) {
      return { message: "Set confirm: true to delete old place_photos data" };
    }

    const oldDocs = await ctx.db.query("place_photos").collect();
    for (const doc of oldDocs) {
      await ctx.db.delete(doc._id);
    }
    return { deleted: oldDocs.length };
  },
});

export const deleteOldBetaUsers = internalMutation({
  args: { confirm: v.boolean() },
  handler: async (ctx, { confirm }) => {
    if (!confirm) {
      return { message: "Set confirm: true to delete old beta_users data" };
    }

    const oldDocs = await ctx.db.query("beta_users").collect();
    for (const doc of oldDocs) {
      await ctx.db.delete(doc._id);
    }
    return { deleted: oldDocs.length };
  },
});
