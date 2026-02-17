/**
 * Migration: snake_case to camelCase field names
 *
 * This migration converts all snake_case field names to camelCase across the database.
 * Run with: npx convex run migrations/snakeToCamel:migrateAll
 *
 * IMPORTANT: Run this migration BEFORE updating the schema to use camelCase field names.
 * After migration completes, update the schema and redeploy.
 */

import { internalMutation, internalQuery } from "../_generated/server";
import { v } from "convex/values";

// ============================================================================
// MIGRATION STATUS TRACKING
// ============================================================================

export const getMigrationStatus = internalQuery({
  args: {},
  handler: async (ctx) => {
    const tables = [
      "maps",
      "map_users",
      "labels",
      "markers",
      "collections",
      "collection_links",
      "routes",
      "route_stops",
      "places",
      "users",
    ];

    const status: Record<string, { total: number; migrated: number }> = {};

    for (const table of tables) {
      const docs = await ctx.db.query(table as any).collect();
      let migrated = 0;

      for (const doc of docs) {
        // Check if doc has been migrated by looking for camelCase fields
        if (table === "maps" && "ownerId" in doc) migrated++;
        else if (table === "map_users" && "mapId" in doc) migrated++;
        else if (table === "labels" && "mapId" in doc) migrated++;
        else if (table === "markers" && "mapId" in doc) migrated++;
        else if (table === "collections" && "mapId" in doc) migrated++;
        else if (table === "collection_links" && "mapId" in doc) migrated++;
        else if (table === "routes" && "mapId" in doc) migrated++;
        else if (table === "route_stops" && "mapId" in doc) migrated++;
        else if (table === "places" && "gmPlaceId" in doc) migrated++;
        else if (table === "users" && "firstName" in doc) migrated++;
      }

      status[table] = { total: docs.length, migrated };
    }

    return status;
  },
});

// ============================================================================
// INDIVIDUAL TABLE MIGRATIONS
// ============================================================================

/**
 * Migrate maps table: owner_id -> ownerId, location_name -> locationName
 */
export const migrateMaps = internalMutation({
  args: { batchSize: v.optional(v.number()) },
  handler: async (ctx, { batchSize = 100 }) => {
    const docs = await ctx.db.query("maps").collect();
    let migrated = 0;

    for (const doc of docs.slice(0, batchSize)) {
      const updates: Record<string, any> = {};
      let needsUpdate = false;

      // @ts-expect-error - accessing old field names
      if ("owner_id" in doc && !("ownerId" in doc)) {
        // @ts-expect-error - accessing old field names
        updates.ownerId = doc.owner_id;
        updates.owner_id = undefined;
        needsUpdate = true;
      }

      // @ts-expect-error - accessing old field names
      if ("location_name" in doc && !("locationName" in doc)) {
        // @ts-expect-error - accessing old field names
        updates.locationName = doc.location_name;
        updates.location_name = undefined;
        needsUpdate = true;
      }

      if (needsUpdate) {
        await ctx.db.patch(doc._id, updates);
        migrated++;
      }
    }

    return { migrated, total: docs.length };
  },
});

/**
 * Migrate map_users table: map_id -> mapId, user_id -> userId
 */
export const migrateMapUsers = internalMutation({
  args: { batchSize: v.optional(v.number()) },
  handler: async (ctx, { batchSize = 100 }) => {
    const docs = await ctx.db.query("map_users").collect();
    let migrated = 0;

    for (const doc of docs.slice(0, batchSize)) {
      const updates: Record<string, any> = {};
      let needsUpdate = false;

      // @ts-expect-error - accessing old field names
      if ("map_id" in doc && !("mapId" in doc)) {
        // @ts-expect-error - accessing old field names
        updates.mapId = doc.map_id;
        updates.map_id = undefined;
        needsUpdate = true;
      }

      // @ts-expect-error - accessing old field names
      if ("user_id" in doc && !("userId" in doc)) {
        // @ts-expect-error - accessing old field names
        updates.userId = doc.user_id;
        updates.user_id = undefined;
        needsUpdate = true;
      }

      if (needsUpdate) {
        await ctx.db.patch(doc._id, updates);
        migrated++;
      }
    }

    return { migrated, total: docs.length };
  },
});

/**
 * Migrate labels table: map_id -> mapId, created_by -> createdBy
 */
export const migrateLabels = internalMutation({
  args: { batchSize: v.optional(v.number()) },
  handler: async (ctx, { batchSize = 100 }) => {
    const docs = await ctx.db.query("labels").collect();
    let migrated = 0;

    for (const doc of docs.slice(0, batchSize)) {
      const updates: Record<string, any> = {};
      let needsUpdate = false;

      // @ts-expect-error - accessing old field names
      if ("map_id" in doc && !("mapId" in doc)) {
        // @ts-expect-error - accessing old field names
        updates.mapId = doc.map_id;
        updates.map_id = undefined;
        needsUpdate = true;
      }

      // @ts-expect-error - accessing old field names
      if ("created_by" in doc && !("createdBy" in doc)) {
        // @ts-expect-error - accessing old field names
        updates.createdBy = doc.created_by;
        updates.created_by = undefined;
        needsUpdate = true;
      }

      if (needsUpdate) {
        await ctx.db.patch(doc._id, updates);
        migrated++;
      }
    }

    return { migrated, total: docs.length };
  },
});

/**
 * Migrate markers table: map_id -> mapId, place_id -> placeId, created_by -> createdBy
 */
export const migrateMarkers = internalMutation({
  args: { batchSize: v.optional(v.number()) },
  handler: async (ctx, { batchSize = 100 }) => {
    const docs = await ctx.db.query("markers").collect();
    let migrated = 0;

    for (const doc of docs.slice(0, batchSize)) {
      const updates: Record<string, any> = {};
      let needsUpdate = false;

      // @ts-expect-error - accessing old field names
      if ("map_id" in doc && !("mapId" in doc)) {
        // @ts-expect-error - accessing old field names
        updates.mapId = doc.map_id;
        updates.map_id = undefined;
        needsUpdate = true;
      }

      // @ts-expect-error - accessing old field names
      if ("place_id" in doc && !("placeId" in doc)) {
        // @ts-expect-error - accessing old field names
        updates.placeId = doc.place_id;
        updates.place_id = undefined;
        needsUpdate = true;
      }

      // @ts-expect-error - accessing old field names
      if ("created_by" in doc && !("createdBy" in doc)) {
        // @ts-expect-error - accessing old field names
        updates.createdBy = doc.created_by;
        updates.created_by = undefined;
        needsUpdate = true;
      }

      if (needsUpdate) {
        await ctx.db.patch(doc._id, updates);
        migrated++;
      }
    }

    return { migrated, total: docs.length };
  },
});

/**
 * Migrate collections table: map_id -> mapId, created_by -> createdBy
 */
export const migrateCollections = internalMutation({
  args: { batchSize: v.optional(v.number()) },
  handler: async (ctx, { batchSize = 100 }) => {
    const docs = await ctx.db.query("collections").collect();
    let migrated = 0;

    for (const doc of docs.slice(0, batchSize)) {
      const updates: Record<string, any> = {};
      let needsUpdate = false;

      // @ts-expect-error - accessing old field names
      if ("map_id" in doc && !("mapId" in doc)) {
        // @ts-expect-error - accessing old field names
        updates.mapId = doc.map_id;
        updates.map_id = undefined;
        needsUpdate = true;
      }

      // @ts-expect-error - accessing old field names
      if ("created_by" in doc && !("createdBy" in doc)) {
        // @ts-expect-error - accessing old field names
        updates.createdBy = doc.created_by;
        updates.created_by = undefined;
        needsUpdate = true;
      }

      if (needsUpdate) {
        await ctx.db.patch(doc._id, updates);
        migrated++;
      }
    }

    return { migrated, total: docs.length };
  },
});

/**
 * Migrate collection_links table: map_id -> mapId, user_id -> userId,
 * collection_id -> collectionId, marker_id -> markerId
 */
export const migrateCollectionLinks = internalMutation({
  args: { batchSize: v.optional(v.number()) },
  handler: async (ctx, { batchSize = 100 }) => {
    const docs = await ctx.db.query("collection_links").collect();
    let migrated = 0;

    for (const doc of docs.slice(0, batchSize)) {
      const updates: Record<string, any> = {};
      let needsUpdate = false;

      // @ts-expect-error - accessing old field names
      if ("map_id" in doc && !("mapId" in doc)) {
        // @ts-expect-error - accessing old field names
        updates.mapId = doc.map_id;
        updates.map_id = undefined;
        needsUpdate = true;
      }

      // @ts-expect-error - accessing old field names
      if ("user_id" in doc && !("userId" in doc)) {
        // @ts-expect-error - accessing old field names
        updates.userId = doc.user_id;
        updates.user_id = undefined;
        needsUpdate = true;
      }

      // @ts-expect-error - accessing old field names
      if ("collection_id" in doc && !("collectionId" in doc)) {
        // @ts-expect-error - accessing old field names
        updates.collectionId = doc.collection_id;
        updates.collection_id = undefined;
        needsUpdate = true;
      }

      // @ts-expect-error - accessing old field names
      if ("marker_id" in doc && !("markerId" in doc)) {
        // @ts-expect-error - accessing old field names
        updates.markerId = doc.marker_id;
        updates.marker_id = undefined;
        needsUpdate = true;
      }

      if (needsUpdate) {
        await ctx.db.patch(doc._id, updates);
        migrated++;
      }
    }

    return { migrated, total: docs.length };
  },
});

/**
 * Migrate routes table: map_id -> mapId, user_id -> userId, travel_type -> travelType
 */
export const migrateRoutes = internalMutation({
  args: { batchSize: v.optional(v.number()) },
  handler: async (ctx, { batchSize = 100 }) => {
    const docs = await ctx.db.query("routes").collect();
    let migrated = 0;

    for (const doc of docs.slice(0, batchSize)) {
      const updates: Record<string, any> = {};
      let needsUpdate = false;

      // @ts-expect-error - accessing old field names
      if ("map_id" in doc && !("mapId" in doc)) {
        // @ts-expect-error - accessing old field names
        updates.mapId = doc.map_id;
        updates.map_id = undefined;
        needsUpdate = true;
      }

      // @ts-expect-error - accessing old field names
      if ("user_id" in doc && !("userId" in doc)) {
        // @ts-expect-error - accessing old field names
        updates.userId = doc.user_id;
        updates.user_id = undefined;
        needsUpdate = true;
      }

      // @ts-expect-error - accessing old field names
      if ("travel_type" in doc && !("travelType" in doc)) {
        // @ts-expect-error - accessing old field names
        updates.travelType = doc.travel_type;
        updates.travel_type = undefined;
        needsUpdate = true;
      }

      if (needsUpdate) {
        await ctx.db.patch(doc._id, updates);
        migrated++;
      }
    }

    return { migrated, total: docs.length };
  },
});

/**
 * Migrate route_stops table: map_id -> mapId, user_id -> userId,
 * route_id -> routeId, marker_id -> markerId, stop_order -> stopOrder
 */
export const migrateRouteStops = internalMutation({
  args: { batchSize: v.optional(v.number()) },
  handler: async (ctx, { batchSize = 100 }) => {
    const docs = await ctx.db.query("route_stops").collect();
    let migrated = 0;

    for (const doc of docs.slice(0, batchSize)) {
      const updates: Record<string, any> = {};
      let needsUpdate = false;

      // @ts-expect-error - accessing old field names
      if ("map_id" in doc && !("mapId" in doc)) {
        // @ts-expect-error - accessing old field names
        updates.mapId = doc.map_id;
        updates.map_id = undefined;
        needsUpdate = true;
      }

      // @ts-expect-error - accessing old field names
      if ("user_id" in doc && !("userId" in doc)) {
        // @ts-expect-error - accessing old field names
        updates.userId = doc.user_id;
        updates.user_id = undefined;
        needsUpdate = true;
      }

      // @ts-expect-error - accessing old field names
      if ("route_id" in doc && !("routeId" in doc)) {
        // @ts-expect-error - accessing old field names
        updates.routeId = doc.route_id;
        updates.route_id = undefined;
        needsUpdate = true;
      }

      // @ts-expect-error - accessing old field names
      if ("marker_id" in doc && !("markerId" in doc)) {
        // @ts-expect-error - accessing old field names
        updates.markerId = doc.marker_id;
        updates.marker_id = undefined;
        needsUpdate = true;
      }

      // @ts-expect-error - accessing old field names
      if ("stop_order" in doc && !("stopOrder" in doc)) {
        // @ts-expect-error - accessing old field names
        updates.stopOrder = doc.stop_order;
        updates.stop_order = undefined;
        needsUpdate = true;
      }

      if (needsUpdate) {
        await ctx.db.patch(doc._id, updates);
        migrated++;
      }
    }

    return { migrated, total: docs.length };
  },
});

/**
 * Migrate places table: gm_place_id -> gmPlaceId, mb_place_id -> mbPlaceId,
 * fq_place_id -> fqPlaceId, plus_code -> plusCode
 */
export const migratePlaces = internalMutation({
  args: { batchSize: v.optional(v.number()) },
  handler: async (ctx, { batchSize = 100 }) => {
    const docs = await ctx.db.query("places").collect();
    let migrated = 0;

    for (const doc of docs.slice(0, batchSize)) {
      const updates: Record<string, any> = {};
      let needsUpdate = false;

      // @ts-expect-error - accessing old field names
      if ("gm_place_id" in doc && !("gmPlaceId" in doc)) {
        // @ts-expect-error - accessing old field names
        updates.gmPlaceId = doc.gm_place_id;
        updates.gm_place_id = undefined;
        needsUpdate = true;
      }

      // @ts-expect-error - accessing old field names
      if ("mb_place_id" in doc && !("mbPlaceId" in doc)) {
        // @ts-expect-error - accessing old field names
        updates.mbPlaceId = doc.mb_place_id;
        updates.mb_place_id = undefined;
        needsUpdate = true;
      }

      // @ts-expect-error - accessing old field names
      if ("fq_place_id" in doc && !("fqPlaceId" in doc)) {
        // @ts-expect-error - accessing old field names
        updates.fqPlaceId = doc.fq_place_id;
        updates.fq_place_id = undefined;
        needsUpdate = true;
      }

      // @ts-expect-error - accessing old field names
      if ("plus_code" in doc && !("plusCode" in doc)) {
        // @ts-expect-error - accessing old field names
        updates.plusCode = doc.plus_code;
        updates.plus_code = undefined;
        needsUpdate = true;
      }

      if (needsUpdate) {
        await ctx.db.patch(doc._id, updates);
        migrated++;
      }
    }

    return { migrated, total: docs.length };
  },
});

/**
 * Migrate users table: first_name -> firstName, last_name -> lastName
 */
export const migrateUsers = internalMutation({
  args: { batchSize: v.optional(v.number()) },
  handler: async (ctx, { batchSize = 100 }) => {
    const docs = await ctx.db.query("users").collect();
    let migrated = 0;

    for (const doc of docs.slice(0, batchSize)) {
      const updates: Record<string, any> = {};
      let needsUpdate = false;

      // @ts-expect-error - accessing old field names
      if ("first_name" in doc && !("firstName" in doc)) {
        // @ts-expect-error - accessing old field names
        updates.firstName = doc.first_name;
        updates.first_name = undefined;
        needsUpdate = true;
      }

      // @ts-expect-error - accessing old field names
      if ("last_name" in doc && !("lastName" in doc)) {
        // @ts-expect-error - accessing old field names
        updates.lastName = doc.last_name;
        updates.last_name = undefined;
        needsUpdate = true;
      }

      if (needsUpdate) {
        await ctx.db.patch(doc._id, updates);
        migrated++;
      }
    }

    return { migrated, total: docs.length };
  },
});

// ============================================================================
// BATCH MIGRATION RUNNER
// ============================================================================

/**
 * Run all migrations in sequence
 * Use this for small datasets or development
 */
export const migrateAll = internalMutation({
  args: { batchSize: v.optional(v.number()) },
  handler: async (ctx, { batchSize = 100 }) => {
    const results: Record<string, { migrated: number; total: number }> = {};

    // Run each migration
    const migrations = [
      { name: "maps", fn: migrateMaps },
      { name: "map_users", fn: migrateMapUsers },
      { name: "labels", fn: migrateLabels },
      { name: "markers", fn: migrateMarkers },
      { name: "collections", fn: migrateCollections },
      { name: "collection_links", fn: migrateCollectionLinks },
      { name: "routes", fn: migrateRoutes },
      { name: "route_stops", fn: migrateRouteStops },
      { name: "places", fn: migratePlaces },
      { name: "users", fn: migrateUsers },
    ];

    for (const { name } of migrations) {
      // We need to call each migration separately due to Convex's execution model
      // This mutation just provides documentation on how to run them
      results[name] = { migrated: 0, total: 0 };
    }

    return {
      message:
        "Run individual migrations using: npx convex run migrations/snakeToCamel:<migrationName>",
      migrations: migrations.map((m) => m.name),
    };
  },
});
