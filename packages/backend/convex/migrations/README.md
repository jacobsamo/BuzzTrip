# Database Migration: snake_case to camelCase

This migration converts all snake_case field names to camelCase across the Convex database.

## Overview

### Fields Being Migrated

| Table | Old Field | New Field |
|-------|-----------|-----------|
| **maps** | `owner_id` | `ownerId` |
| **maps** | `location_name` | `locationName` |
| **map_users** | `map_id` | `mapId` |
| **map_users** | `user_id` | `userId` |
| **labels** | `map_id` | `mapId` |
| **labels** | `created_by` | `createdBy` |
| **markers** | `map_id` | `mapId` |
| **markers** | `place_id` | `placeId` |
| **markers** | `created_by` | `createdBy` |
| **collections** | `map_id` | `mapId` |
| **collections** | `created_by` | `createdBy` |
| **collection_links** | `map_id` | `mapId` |
| **collection_links** | `user_id` | `userId` |
| **collection_links** | `collection_id` | `collectionId` |
| **collection_links** | `marker_id` | `markerId` |
| **routes** | `map_id` | `mapId` |
| **routes** | `user_id` | `userId` |
| **routes** | `travel_type` | `travelType` |
| **route_stops** | `map_id` | `mapId` |
| **route_stops** | `user_id` | `userId` |
| **route_stops** | `route_id` | `routeId` |
| **route_stops** | `marker_id` | `markerId` |
| **route_stops** | `stop_order` | `stopOrder` |
| **places** | `gm_place_id` | `gmPlaceId` |
| **places** | `mb_place_id` | `mbPlaceId` |
| **places** | `fq_place_id` | `fqPlaceId` |
| **places** | `plus_code` | `plusCode` |
| **users** | `first_name` | `firstName` |
| **users** | `last_name` | `lastName` |

### Table Names (Cannot be changed via migration)

Convex doesn't support renaming tables. These table names will remain as-is:
- `map_users`
- `collection_links`
- `route_stops`
- `places_reviews`
- `place_photos`
- `beta_users`

## Migration Steps

### Step 1: Deploy Migration Functions

First, deploy the migration functions without changing the schema:

```bash
cd packages/backend
npx convex deploy
```

### Step 2: Check Current Status

Check which documents need migration:

```bash
npx convex run migrations/snakeToCamel:getMigrationStatus
```

### Step 3: Run Migrations

Run each migration individually (recommended for production):

```bash
# Run each migration - repeat until all documents are migrated
npx convex run migrations/snakeToCamel:migrateMaps
npx convex run migrations/snakeToCamel:migrateMapUsers
npx convex run migrations/snakeToCamel:migrateLabels
npx convex run migrations/snakeToCamel:migrateMarkers
npx convex run migrations/snakeToCamel:migrateCollections
npx convex run migrations/snakeToCamel:migrateCollectionLinks
npx convex run migrations/snakeToCamel:migrateRoutes
npx convex run migrations/snakeToCamel:migrateRouteStops
npx convex run migrations/snakeToCamel:migratePlaces
npx convex run migrations/snakeToCamel:migrateUsers
```

For large tables, run with batch size and repeat until complete:

```bash
npx convex run migrations/snakeToCamel:migrateMaps '{"batchSize": 500}'
```

### Step 4: Verify Migration

Check that all documents have been migrated:

```bash
npx convex run migrations/snakeToCamel:getMigrationStatus
```

All tables should show `migrated === total`.

### Step 5: Update Schema Files

After migration is complete, update the schema files:

```bash
# Backup original files
cp zod-schemas/maps-schema.ts zod-schemas/maps-schema.backup.ts
cp zod-schemas/places-schema.ts zod-schemas/places-schema.backup.ts
cp zod-schemas/auth-schema.ts zod-schemas/auth-schema.backup.ts
cp convex/schema.ts convex/schema.backup.ts

# Replace with camelCase versions
cp zod-schemas/maps-schema.camelCase.ts zod-schemas/maps-schema.ts
cp zod-schemas/places-schema.camelCase.ts zod-schemas/places-schema.ts
cp zod-schemas/auth-schema.camelCase.ts zod-schemas/auth-schema.ts
cp convex/schema.camelCase.ts convex/schema.ts
```

### Step 6: Update Application Code

Update all references in your application code:
- `packages/backend/convex/**/*.ts` - Convex functions
- `apps/web/src/**/*.ts` - Web app
- `apps/admin/src/**/*.ts` - Admin app

### Step 7: Deploy Updated Schema

```bash
npx convex deploy
```

### Step 8: Clean Up

After verifying everything works:

```bash
# Remove backup and camelCase files
rm zod-schemas/*.backup.ts
rm zod-schemas/*.camelCase.ts
rm convex/schema.backup.ts
rm convex/schema.camelCase.ts
```

## Rollback

If you need to rollback, you can run a reverse migration (not included).
The old field values are set to `undefined` but not deleted, so data is preserved.

To restore:
1. Restore the backup schema files
2. Deploy the old schema
3. Create reverse migration functions if needed

## Important Notes

1. **Index Changes**: After updating the schema, indexes will be recreated automatically by Convex.

2. **Downtime**: There will be a brief period where both old and new field names exist. The migration is designed to be idempotent - you can run it multiple times safely.

3. **Application Compatibility**: Update your application code to use new field names AFTER the migration is complete and verified.

4. **Batch Size**: For production databases with many documents, use smaller batch sizes (100-500) to avoid timeout issues.
