# Data Layers Implementation Plan

## Overview
Implement data layers to group map entities (markers, collections, paths, labels, routes) with hierarchy ordering, soft deletion, and UI management.

## Key Decisions
- **Archive behavior**: Archiving a layer also archives all its entities
- **Naming**: Use `camelCase` (dataLayerId)
- **Ordering**: Manual `order` field (1-indexed), controls both sidebar and map rendering. Oldest layer = order 1, newest = n+1
- **Selection UX**: Remember last used layer per entity type, default to map's default layer initially

---

## Phase 1: Schema Updates

### 1.1 Update dataLayers schema
**File**: `packages/backend/zod-schemas/data-layers-schema.ts`

**Changes**:
- Add `order: z.number().int().positive()` field
- Export create schema: `dataLayerCreateSchema`
- Export edit schema: `dataLayerEditSchema`

```typescript
export const dataLayerTable = zodTable("dataLayers", {
  title: z.string(),
  description: z.string().nullish(),
  icon: iconSchema.nullish(),
  color: z.string().nullish(),
  order: z.number().int().positive(), // NEW: 1-indexed ordering
  hidden: z.boolean().default(false),
  isArchived: z.boolean().default(false),
  createdBy: zid("users"),
  mapId: zid("maps"),
});

export const dataLayerCreateSchema = dataLayerTable.insertSchema.pick({
  title: true,
  description: true,
  icon: true,
  color: true,
  mapId: true,
});

export const dataLayerEditSchema = dataLayerTable.updateSchema.pick({
  title: true,
  description: true,
  icon: true,
  color: true,
  hidden: true,
});
```

### 1.2 Update entity schemas
**Files**:
- `packages/backend/zod-schemas/maps-schema.ts` (markers, collections, labels, routes, routeStops, collectionLinks)
- `packages/backend/zod-schemas/paths-schema.ts`

**Add to each table**:
```typescript
dataLayerId: zid("dataLayers")
```

**Keep existing** `map_id`/`mapId` for backwards compatibility

**Affected tables**:
- `markersTable` → add `dataLayerId`
- `collectionsTable` → add `dataLayerId`
- `labelsTable` → add `dataLayerId`
- `routesTable` → add `dataLayerId`
- `routeStopsTable` → add `dataLayerId`
- `collectionLinksTable` → add `dataLayerId`
- `pathsTable` → add `dataLayerId`

### 1.3 Update schema.ts indexes
**File**: `packages/backend/convex/schema.ts`

**Add index to each table**:
```typescript
export default defineSchema({
  dataLayers: dataLayerTable
    .table()
    .index("by_map_id", ["mapId"])
    .index("by_created_by", ["createdBy"])
    .index("by_map_and_order", ["mapId", "order"]), // NEW

  markers: markersTable
    .table()
    .index("by_map_id", ["map_id"])
    .index("by_place_id", ["place_id"])
    .index("by_data_layer_id", ["dataLayerId"]), // NEW

  collections: collectionsTable
    .table()
    .index("by_map_id", ["map_id"])
    .index("by_data_layer_id", ["dataLayerId"]), // NEW

  paths: pathsTable
    .table()
    .index("byMapId", ["mapId"])
    .index("by_data_layer_id", ["dataLayerId"]), // NEW

  labels: labelsTable
    .table()
    .index("by_map_id", ["map_id"])
    .index("by_data_layer_id", ["dataLayerId"]), // NEW

  routes: routesTable
    .table()
    .index("by_map_id", ["map_id"])
    .index("by_data_layer_id", ["dataLayerId"]), // NEW

  route_stops: routeStopsTable
    .table()
    .index("by_map_id", ["map_id"])
    .index("by_data_layer_id", ["dataLayerId"]), // NEW

  collection_links: collectionLinksTable
    .table()
    .index("by_map_id", ["map_id"])
    .index("by_collection_id", ["collection_id"])
    .index("by_data_layer_id", ["dataLayerId"]), // NEW
});
```

---

## Phase 2: Backend - Data Layer CRUD

### 2.1 Create data layer operations
**File**: `packages/backend/convex/maps/dataLayers.ts` (NEW)

**Imports**:
```typescript
import { v } from "convex/values";
import { zid } from "convex-helpers/server/zod4";
import { authedMutation, authedQuery } from "../helpers";
import { dataLayerCreateSchema, dataLayerEditSchema, dataLayerTable } from "../../zod-schemas/data-layers-schema";
import { internal } from "../_generated/api";
import { logMapEvent } from "../analytics";
```

**Queries**:

```typescript
// Get all data layers for a map, ordered by order field
export const getDataLayersForMap = authedQuery({
  args: { mapId: zid("maps") },
  returns: dataLayerTable.schema.array().nullable(),
  handler: async (ctx, args) => {
    const layers = await ctx.db
      .query("dataLayers")
      .withIndex("by_map_id", (q) => q.eq("mapId", args.mapId))
      .filter((q) => q.eq(q.field("isArchived"), false))
      .collect();

    // Sort by order field
    return layers.sort((a, b) => a.order - b.order);
  },
});

// Get single data layer by ID
export const getDataLayer = authedQuery({
  args: { dataLayerId: zid("dataLayers") },
  returns: dataLayerTable.schema.nullable(),
  handler: async (ctx, args) => {
    const layer = await ctx.db.get(args.dataLayerId);
    if (!layer || layer.isArchived) return null;
    return layer;
  },
});

// Get count of non-archived layers for a map
export const countNonArchivedLayers = authedQuery({
  args: { mapId: zid("maps") },
  returns: v.number(),
  handler: async (ctx, args) => {
    const layers = await ctx.db
      .query("dataLayers")
      .withIndex("by_map_id", (q) => q.eq("mapId", args.mapId))
      .filter((q) => q.eq(q.field("isArchived"), false))
      .collect();
    return layers.length;
  },
});
```

**Mutations**:

```typescript
// Create new data layer
export const createDataLayer = authedMutation({
  args: dataLayerCreateSchema.extend({
    title: zid("string"),
    description: zid("string").optional(),
    icon: v.optional(v.union(v.string(), v.any())),
    color: v.optional(v.string()),
  }),
  handler: async (ctx, args) => {
    // Calculate next order number
    const existingLayers = await ctx.db
      .query("dataLayers")
      .withIndex("by_map_id", (q) => q.eq("mapId", args.mapId))
      .collect();

    const maxOrder = Math.max(0, ...existingLayers.map(l => l.order));
    const nextOrder = maxOrder + 1;

    const dataLayerId = await ctx.db.insert("dataLayers", {
      title: args.title,
      description: args.description ?? null,
      icon: args.icon ?? null,
      color: args.color ?? null,
      order: nextOrder,
      hidden: false,
      isArchived: false,
      createdBy: ctx.user._id,
      mapId: args.mapId,
    });

    await logMapEvent(ctx, args.mapId, "dataLayer.create", {
      dataLayerId,
      title: args.title,
      order: nextOrder,
    }, ctx.user._id);

    return dataLayerId;
  },
});

// Update data layer
export const updateDataLayer = authedMutation({
  args: {
    dataLayerId: zid("dataLayers"),
    ...dataLayerEditSchema.shape,
  },
  handler: async (ctx, args) => {
    const { dataLayerId, ...updates } = args;

    const layer = await ctx.db.get(dataLayerId);
    if (!layer) throw new Error("Data layer not found");

    await ctx.db.patch(dataLayerId, updates);

    await logMapEvent(ctx, layer.mapId, "dataLayer.update", {
      dataLayerId,
      updates,
    }, ctx.user._id);

    return dataLayerId;
  },
});

// Reorder data layers
export const reorderDataLayers = authedMutation({
  args: {
    mapId: zid("maps"),
    layerIds: v.array(zid("dataLayers")),
  },
  handler: async (ctx, args) => {
    // Validate all layers belong to this map
    const layers = await Promise.all(
      args.layerIds.map(id => ctx.db.get(id))
    );

    if (layers.some(l => !l || l.mapId !== args.mapId)) {
      throw new Error("Invalid layer IDs");
    }

    // Update order based on array position (1-indexed)
    await Promise.all(
      args.layerIds.map((layerId, index) =>
        ctx.db.patch(layerId, { order: index + 1 })
      )
    );

    await logMapEvent(ctx, args.mapId, "dataLayer.reorder", {
      layerIds: args.layerIds,
    }, ctx.user._id);

    return null;
  },
});

// Toggle data layer visibility
export const toggleDataLayerVisibility = authedMutation({
  args: { dataLayerId: zid("dataLayers") },
  handler: async (ctx, args) => {
    const layer = await ctx.db.get(args.dataLayerId);
    if (!layer) throw new Error("Data layer not found");

    await ctx.db.patch(args.dataLayerId, { hidden: !layer.hidden });

    await logMapEvent(ctx, layer.mapId, "dataLayer.toggleVisibility", {
      dataLayerId: args.dataLayerId,
      hidden: !layer.hidden,
    }, ctx.user._id);

    return null;
  },
});

// Archive data layer (soft delete + cascade to entities)
export const archiveDataLayer = authedMutation({
  args: { dataLayerId: zid("dataLayers") },
  handler: async (ctx, args) => {
    const layer = await ctx.db.get(args.dataLayerId);
    if (!layer) throw new Error("Data layer not found");

    // Check if this is the last non-archived layer
    const nonArchivedLayers = await ctx.db
      .query("dataLayers")
      .withIndex("by_map_id", (q) => q.eq("mapId", layer.mapId))
      .filter((q) => q.eq(q.field("isArchived"), false))
      .collect();

    if (nonArchivedLayers.length <= 1) {
      throw new Error("Cannot archive the last data layer. Maps must have at least one layer.");
    }

    // Archive the layer
    await ctx.db.patch(args.dataLayerId, { isArchived: true });

    // Cascade archive to all entities
    const archivedCount = await archiveEntitiesForDataLayer(ctx, args.dataLayerId, layer.mapId);

    await logMapEvent(ctx, layer.mapId, "dataLayer.archive", {
      dataLayerId: args.dataLayerId,
      title: layer.title,
      archivedEntities: archivedCount,
    }, ctx.user._id);

    return { archivedCount };
  },
});
```

**Helper Functions**:

```typescript
// Helper: Create data layer (for system use)
export async function createDataLayerFunction(
  ctx: any,
  mapId: string,
  title: string,
  options?: {
    description?: string;
    icon?: any;
    color?: string;
    order?: number;
    skipLogging?: boolean;
  }
) {
  const existingLayers = await ctx.db
    .query("dataLayers")
    .withIndex("by_map_id", (q) => q.eq("mapId", mapId))
    .collect();

  const order = options?.order ?? Math.max(0, ...existingLayers.map(l => l.order)) + 1;

  const dataLayerId = await ctx.db.insert("dataLayers", {
    title,
    description: options?.description ?? null,
    icon: options?.icon ?? null,
    color: options?.color ?? null,
    order,
    hidden: false,
    isArchived: false,
    createdBy: ctx.user._id,
    mapId,
  });

  if (!options?.skipLogging) {
    await logMapEvent(ctx, mapId, "dataLayer.create", {
      dataLayerId,
      title,
      order,
    }, ctx.user._id);
  }

  return dataLayerId;
}

// Helper: Archive all entities for a data layer
async function archiveEntitiesForDataLayer(ctx: any, dataLayerId: string, mapId: string) {
  let archivedCount = 0;

  // Archive markers
  const markers = await ctx.db
    .query("markers")
    .withIndex("by_data_layer_id", (q) => q.eq("dataLayerId", dataLayerId))
    .collect();

  for (const marker of markers) {
    await ctx.db.patch(marker._id, { isArchived: true });
    await logMapEvent(ctx, mapId, "marker.archive", {
      markerId: marker._id,
      reason: "dataLayerArchived",
    }, ctx.user._id);
    archivedCount++;
  }

  // Archive collections
  const collections = await ctx.db
    .query("collections")
    .withIndex("by_data_layer_id", (q) => q.eq("dataLayerId", dataLayerId))
    .collect();

  for (const collection of collections) {
    await ctx.db.patch(collection._id, { isArchived: true });
    await logMapEvent(ctx, mapId, "collection.archive", {
      collectionId: collection._id,
      reason: "dataLayerArchived",
    }, ctx.user._id);
    archivedCount++;
  }

  // Archive paths
  const paths = await ctx.db
    .query("paths")
    .withIndex("by_data_layer_id", (q) => q.eq("dataLayerId", dataLayerId))
    .collect();

  for (const path of paths) {
    await ctx.db.patch(path._id, { isArchived: true });
    await logMapEvent(ctx, mapId, "path.archive", {
      pathId: path._id,
      reason: "dataLayerArchived",
    }, ctx.user._id);
    archivedCount++;
  }

  // Archive labels
  const labels = await ctx.db
    .query("labels")
    .withIndex("by_data_layer_id", (q) => q.eq("dataLayerId", dataLayerId))
    .collect();

  for (const label of labels) {
    await ctx.db.patch(label._id, { isArchived: true });
    await logMapEvent(ctx, mapId, "label.archive", {
      labelId: label._id,
      reason: "dataLayerArchived",
    }, ctx.user._id);
    archivedCount++;
  }

  // Archive routes
  const routes = await ctx.db
    .query("routes")
    .withIndex("by_data_layer_id", (q) => q.eq("dataLayerId", dataLayerId))
    .collect();

  for (const route of routes) {
    await ctx.db.patch(route._id, { isArchived: true });
    await logMapEvent(ctx, mapId, "route.archive", {
      routeId: route._id,
      reason: "dataLayerArchived",
    }, ctx.user._id);
    archivedCount++;
  }

  // Archive route stops
  const routeStops = await ctx.db
    .query("route_stops")
    .withIndex("by_data_layer_id", (q) => q.eq("dataLayerId", dataLayerId))
    .collect();

  for (const stop of routeStops) {
    await ctx.db.patch(stop._id, { isArchived: true });
    archivedCount++;
  }

  // Archive collection links
  const collectionLinks = await ctx.db
    .query("collection_links")
    .withIndex("by_data_layer_id", (q) => q.eq("dataLayerId", dataLayerId))
    .collect();

  for (const link of collectionLinks) {
    await ctx.db.patch(link._id, { isArchived: true });
    archivedCount++;
  }

  return archivedCount;
}
```

### 2.2 Add event logging types
**File**: Wherever `logMapEvent` is defined (likely `packages/backend/convex/analytics.ts`)

**Add event types**:
- `dataLayer.create`
- `dataLayer.update`
- `dataLayer.reorder`
- `dataLayer.archive`
- `dataLayer.toggleVisibility`

---

## Phase 3: Migration

### 3.1 Create migration
**File**: `packages/backend/convex/migrations.ts`

**Add migration**:
```typescript
import { Migrations } from "@convex-dev/migrations";
import type { DataModel } from "./_generated/dataModel";

export const migrations = new Migrations<DataModel>(components.migrations);

// Migration: Add default data layers to all existing maps
export const addDefaultDataLayersToMaps = migrations.define({
  table: "maps",
  migrateOne: async (ctx, map) => {
    // Check if this map already has a data layer
    const existingLayers = await ctx.db
      .query("dataLayers")
      .withIndex("by_map_id", (q) => q.eq("mapId", map._id))
      .collect();

    if (existingLayers.length > 0) {
      // Map already has data layers, skip
      return;
    }

    // Create default data layer
    const dataLayerId = await ctx.db.insert("dataLayers", {
      title: "Default Layer",
      description: null,
      icon: null,
      color: null,
      order: 1,
      hidden: false,
      isArchived: false,
      createdBy: map.createdBy,
      mapId: map._id,
    });

    // Update all markers
    const markers = await ctx.db
      .query("markers")
      .withIndex("by_map_id", (q) => q.eq("map_id", map._id))
      .collect();

    for (const marker of markers) {
      await ctx.db.patch(marker._id, { dataLayerId });
    }

    // Update all collections
    const collections = await ctx.db
      .query("collections")
      .withIndex("by_map_id", (q) => q.eq("map_id", map._id))
      .collect();

    for (const collection of collections) {
      await ctx.db.patch(collection._id, { dataLayerId });
    }

    // Update all paths
    const paths = await ctx.db
      .query("paths")
      .withIndex("byMapId", (q) => q.eq("mapId", map._id))
      .collect();

    for (const path of paths) {
      await ctx.db.patch(path._id, { dataLayerId });
    }

    // Update all labels
    const labels = await ctx.db
      .query("labels")
      .withIndex("by_map_id", (q) => q.eq("map_id", map._id))
      .collect();

    for (const label of labels) {
      await ctx.db.patch(label._id, { dataLayerId });
    }

    // Update all routes
    const routes = await ctx.db
      .query("routes")
      .withIndex("by_map_id", (q) => q.eq("map_id", map._id))
      .collect();

    for (const route of routes) {
      await ctx.db.patch(route._id, { dataLayerId });
    }

    // Update all route stops
    const routeStops = await ctx.db
      .query("route_stops")
      .withIndex("by_map_id", (q) => q.eq("map_id", map._id))
      .collect();

    for (const stop of routeStops) {
      await ctx.db.patch(stop._id, { dataLayerId });
    }

    // Update all collection links
    const collectionLinks = await ctx.db
      .query("collection_links")
      .withIndex("by_map_id", (q) => q.eq("map_id", map._id))
      .collect();

    for (const link of collectionLinks) {
      await ctx.db.patch(link._id, { dataLayerId });
    }

    return { defaultLayerCreated: true, dataLayerId };
  },
});

// Update runner to include new migration
export const runAll = migrations.runner([
  // ... existing migrations
  internal.migrations.addDefaultDataLayersToMaps,
]);
```

### 3.2 Run migration
Execute migration using Convex dashboard or CLI:
```bash
# Run migration
npx convex run migrations:runAll
```

---

## Phase 4: Update Map Creation

### 4.1 Update createMapFunction
**File**: `packages/backend/convex/maps/index.ts`

**Import**:
```typescript
import { createDataLayerFunction } from "./dataLayers";
```

**Update createMapFunction** (around line 107-170):
```typescript
export async function createMapFunction(
  ctx: any,
  args: any,
  options?: { skipLogging?: boolean }
) {
  // ... existing map creation code ...

  const mapId = await ctx.db.insert("maps", {
    // ... existing fields
  });

  // Create default data layer FIRST
  const dataLayerId = await createDataLayerFunction(
    ctx,
    mapId,
    "Default Layer",
    {
      order: 1,
      skipLogging: true
    }
  );

  // Create default collection with dataLayerId
  await createCollectionFunction(
    ctx,
    {
      map_id: mapId,
      dataLayerId, // NEW
      collection: {
        title: "Saved",
        icon: "bookmark-simple",
        color: "#0B7138",
      },
    },
    { skipLogging: true }
  );

  // ... rest of function
}
```

---

## Phase 5: Update Entity Mutations

### 5.1 Update markers
**File**: `packages/backend/convex/maps/markers.ts`

**Update createMarker mutation**:
```typescript
export const createMarker = authedMutation({
  args: markersEditSchema.extend({
    dataLayerId: zid("dataLayers"), // NEW
  }),
  handler: async (ctx, args) => {
    // Validate dataLayerId belongs to same map
    const dataLayer = await ctx.db.get(args.dataLayerId);
    if (!dataLayer || dataLayer.mapId !== args.map_id) {
      throw new Error("Invalid data layer");
    }

    const markerId = await ctx.db.insert("markers", {
      ...args,
      dataLayerId: args.dataLayerId, // NEW
      created_by: ctx.user._id,
    });

    await logMapEvent(ctx, args.map_id, "marker.create", {
      markerId,
      dataLayerId: args.dataLayerId, // NEW
    }, ctx.user._id);

    return markerId;
  },
});
```

**Update helper function** (if exists):
```typescript
export async function createMarkerFunction(
  ctx: any,
  args: any,
  options?: { skipLogging?: boolean }
) {
  // Add dataLayerId validation
  const dataLayer = await ctx.db.get(args.dataLayerId);
  if (!dataLayer || dataLayer.mapId !== args.map_id) {
    throw new Error("Invalid data layer");
  }

  // ... rest of function with dataLayerId in insert
}
```

### 5.2 Update collections
**File**: `packages/backend/convex/maps/collections.ts`

Apply same pattern:
- Add `dataLayerId: zid("dataLayers")` to args
- Validate dataLayerId belongs to same map
- Include in insert object
- Update createCollectionFunction helper

### 5.3 Update paths
**File**: `packages/backend/convex/maps/paths.ts`

Apply same pattern

### 5.4 Update labels
**File**: `packages/backend/convex/maps/labels.ts`

Apply same pattern

### 5.5 Update routes
**File**: `packages/backend/convex/maps/routes.ts`

Apply same pattern

### 5.6 Update route stops & collection links
Update these tables similarly if they have create mutations

---

## Phase 6: Export Schemas & Types

### 6.1 Export schemas
**File**: `packages/backend/zod-schemas/index.ts`

**Add exports**:
```typescript
export {
  dataLayerTable,
  dataLayerCreateSchema,
  dataLayerEditSchema,
} from "./data-layers-schema";
```

### 6.2 Create types
**File**: `packages/backend/types/index.ts`

**Add types**:
```typescript
import { z } from "zod";
import { dataLayerTable, dataLayerCreateSchema, dataLayerEditSchema } from "../zod-schemas";
import type { Doc, Id } from "../convex/_generated/dataModel";

export type DataLayer = Doc<"dataLayers">;
export type DataLayerId = Id<"dataLayers">;
export type DataLayerCreateInput = z.infer<typeof dataLayerCreateSchema>;
export type DataLayerEditInput = z.infer<typeof dataLayerEditSchema>;
```

---

## Phase 7: Frontend - State Management

### 7.1 Update map state provider
**File**: `apps/web/src/components/providers/map-state-provider.tsx`

**Add to preloaded data**:
```typescript
const preloadedData = usePreloadedQueryWithAuth({
  // ... existing preloads
  dataLayers: {
    query: api.maps.dataLayers.getDataLayersForMap,
    args: { mapId: mapId as Id<"maps"> },
  },
});
```

**Add to store state**:
```typescript
interface MapStore {
  // ... existing state
  dataLayers: DataLayer[];
  selectedDataLayerId: {
    marker?: Id<"dataLayers">;
    collection?: Id<"dataLayers">;
    path?: Id<"dataLayers">;
    label?: Id<"dataLayers">;
    route?: Id<"dataLayers">;
  };
  setSelectedDataLayer: (entityType: keyof MapStore["selectedDataLayerId"], layerId: Id<"dataLayers">) => void;
}

const useMapStore = create<MapStore>()((set) => ({
  // ... existing state
  dataLayers: [],
  selectedDataLayerId: {},
  setSelectedDataLayer: (entityType, layerId) =>
    set((state) => ({
      selectedDataLayerId: {
        ...state.selectedDataLayerId,
        [entityType]: layerId,
      },
    })),
}));
```

**Initialize from preloaded data**:
```typescript
useEffect(() => {
  if (preloadedData.dataLayers) {
    useMapStore.setState({ dataLayers: preloadedData.dataLayers });

    // Set default layer as selected for all entity types
    const defaultLayer = preloadedData.dataLayers.find(l => l.order === 1);
    if (defaultLayer) {
      useMapStore.setState({
        selectedDataLayerId: {
          marker: defaultLayer._id,
          collection: defaultLayer._id,
          path: defaultLayer._id,
          label: defaultLayer._id,
          route: defaultLayer._id,
        },
      });
    }
  }
}, [preloadedData.dataLayers]);
```

---

## Phase 8: Frontend - Data Layer Management UI

### 8.1 Create DataLayersList component
**File**: `apps/web/src/components/layouts/map-view/components/data-layers-list.tsx` (NEW)

**Features**:
```typescript
import { DataLayer } from "@repo/backend/types";
import { Id } from "@repo/backend/convex/_generated/dataModel";
import { useMutation } from "convex/react";
import { api } from "@repo/backend/convex/_generated/api";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";

export function DataLayersList({ mapId }: { mapId: Id<"maps"> }) {
  const dataLayers = useMapStore((state) => state.dataLayers);
  const toggleVisibility = useMutation(api.maps.dataLayers.toggleDataLayerVisibility);
  const reorderLayers = useMutation(api.maps.dataLayers.reorderDataLayers);
  const archiveLayer = useMutation(api.maps.dataLayers.archiveDataLayer);

  const handleDragEnd = (result) => {
    if (!result.destination) return;

    const reordered = Array.from(dataLayers);
    const [removed] = reordered.splice(result.source.index, 1);
    reordered.splice(result.destination.index, 0, removed);

    reorderLayers({
      mapId,
      layerIds: reordered.map(l => l._id),
    });
  };

  const handleArchive = async (layerId: Id<"dataLayers">) => {
    if (dataLayers.length <= 1) {
      toast.error("Cannot delete the last data layer");
      return;
    }

    // Show confirmation
    const confirmed = await showConfirmDialog({
      title: "Archive Data Layer",
      message: "This will archive the layer and all its markers, collections, and paths. Continue?",
    });

    if (confirmed) {
      await archiveLayer({ dataLayerId: layerId });
      toast.success("Data layer archived");
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold">Data Layers</h3>
        <Button
          size="sm"
          onClick={() => setActiveState({ event: "dataLayer:create" })}
        >
          Add Layer
        </Button>
      </div>

      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="data-layers">
          {(provided) => (
            <div {...provided.droppableProps} ref={provided.innerRef}>
              {dataLayers.map((layer, index) => (
                <Draggable
                  key={layer._id}
                  draggableId={layer._id}
                  index={index}
                >
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      className="flex items-center gap-2 p-2 border rounded hover:bg-accent"
                    >
                      {/* Layer icon/color */}
                      <div
                        className="w-4 h-4 rounded"
                        style={{ backgroundColor: layer.color ?? "#ccc" }}
                      />

                      {/* Layer title */}
                      <span className="flex-1">{layer.title}</span>

                      {/* Visibility toggle */}
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => toggleVisibility({ dataLayerId: layer._id })}
                      >
                        {layer.hidden ? <EyeSlash /> : <Eye />}
                      </Button>

                      {/* Edit button */}
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => setActiveState({
                          event: "dataLayer:update",
                          data: layer,
                        })}
                      >
                        <PencilSimple />
                      </Button>

                      {/* Archive button */}
                      <Button
                        size="icon"
                        variant="ghost"
                        disabled={dataLayers.length <= 1}
                        onClick={() => handleArchive(layer._id)}
                      >
                        <Trash />
                      </Button>
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
}
```

### 8.2 Create DataLayerForm component
**File**: `apps/web/src/components/forms/data-layer-form.tsx` (NEW)

**Structure**:
```typescript
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { dataLayerCreateSchema, dataLayerEditSchema } from "@repo/backend/zod-schemas";

export function DataLayerForm({ mode, mapId, existingLayer }) {
  const createLayer = useMutation(api.maps.dataLayers.createDataLayer);
  const updateLayer = useMutation(api.maps.dataLayers.updateDataLayer);

  const schema = mode === "create" ? dataLayerCreateSchema : dataLayerEditSchema;
  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: existingLayer ?? { title: "", mapId },
  });

  const onSubmit = async (data) => {
    const promise = mode === "create"
      ? createLayer({ ...data, mapId })
      : updateLayer({ dataLayerId: existingLayer._id, ...data });

    toast.promise(promise, {
      loading: `${mode === "create" ? "Creating" : "Updating"} layer...`,
      success: `Layer ${mode === "create" ? "created" : "updated"}!`,
      error: "Failed to save layer",
    });

    await promise;
    setActiveState({ event: null });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Layer name" />
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description (optional)</FormLabel>
              <FormControl>
                <Textarea {...field} placeholder="Describe this layer" />
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="icon"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Icon (optional)</FormLabel>
              <FormControl>
                <IconPicker {...field} />
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="color"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Color (optional)</FormLabel>
              <FormControl>
                <ColorPicker {...field} />
              </FormControl>
            </FormItem>
          )}
        />

        <Button type="submit">
          {mode === "create" ? "Create Layer" : "Update Layer"}
        </Button>
      </form>
    </Form>
  );
}
```

### 8.3 Add to map sidebar
**File**: Wherever sidebar tabs are defined (likely in map view layout)

**Add "Layers" tab**:
```typescript
<Tabs>
  <TabsList>
    <TabsTrigger value="markers">Markers</TabsTrigger>
    <TabsTrigger value="collections">Collections</TabsTrigger>
    <TabsTrigger value="layers">Layers</TabsTrigger> {/* NEW */}
  </TabsList>

  <TabsContent value="layers">
    <DataLayersList mapId={mapId} />
  </TabsContent>
</Tabs>
```

---

## Phase 9: Frontend - Entity Creation Updates

### 9.1 Update marker form
**File**: `apps/web/src/components/forms/marker-create-edit-form.tsx`

**Add data layer selector**:
```typescript
export function MarkerCreateEditForm({ mode, mapId, existingMarker }) {
  const dataLayers = useMapStore((state) => state.dataLayers);
  const selectedDataLayerId = useMapStore((state) => state.selectedDataLayerId.marker);
  const setSelectedDataLayer = useMapStore((state) => state.setSelectedDataLayer);

  const form = useForm({
    defaultValues: {
      // ... existing defaults
      dataLayerId: existingMarker?.dataLayerId ?? selectedDataLayerId,
    },
  });

  return (
    <Form {...form}>
      <form>
        {/* Existing fields */}

        {/* NEW: Data Layer selector */}
        <FormField
          control={form.control}
          name="dataLayerId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Data Layer</FormLabel>
              <Select
                onValueChange={(value) => {
                  field.onChange(value);
                  setSelectedDataLayer("marker", value as Id<"dataLayers">);
                }}
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select layer" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {dataLayers.map((layer) => (
                    <SelectItem key={layer._id} value={layer._id}>
                      <div className="flex items-center gap-2">
                        <div
                          className="w-3 h-3 rounded"
                          style={{ backgroundColor: layer.color ?? "#ccc" }}
                        />
                        {layer.title}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormItem>
          )}
        />

        {/* Submit button */}
      </form>
    </Form>
  );
}
```

### 9.2 Update collection form
**File**: `apps/web/src/components/forms/collection-create-edit-form.tsx`

Apply same pattern as markers, but use `selectedDataLayerId.collection`

### 9.3 Update path form
Apply same pattern with `selectedDataLayerId.path`

### 9.4 Update label/route forms
Apply same pattern for labels and routes

---

## Phase 10: Frontend - Layer Filtering & Display

### 10.1 Update entity display components
**Files**: Components that display markers/collections/paths

**Group by layer**:
```typescript
export function MarkersDisplay() {
  const markers = useMapStore((state) => state.markers);
  const dataLayers = useMapStore((state) => state.dataLayers);

  // Group markers by data layer
  const markersByLayer = dataLayers.map((layer) => ({
    layer,
    markers: markers.filter((m) => m.dataLayerId === layer._id && !m.isArchived),
  }));

  return (
    <div>
      {markersByLayer.map(({ layer, markers }) => (
        <div key={layer._id}>
          <div className="flex items-center gap-2 font-semibold">
            <div
              className="w-3 h-3 rounded"
              style={{ backgroundColor: layer.color ?? "#ccc" }}
            />
            {layer.title}
            <span className="text-muted-foreground">({markers.length})</span>
          </div>

          {!layer.hidden && (
            <div className="ml-5">
              {markers.map((marker) => (
                <MarkerItem key={marker._id} marker={marker} />
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
```

### 10.2 Map rendering integration
**File**: Where map markers/paths are rendered

**Respect layer order and visibility**:
```typescript
// Render layers in order (bottom to top)
const sortedLayers = [...dataLayers].sort((a, b) => a.order - b.order);

for (const layer of sortedLayers) {
  if (layer.hidden) continue;

  // Get all markers for this layer
  const layerMarkers = markers.filter(m => m.dataLayerId === layer._id && !m.isArchived);

  // Add to map using map.addLayer or similar
  // This ensures bottom layers render first
}
```

---

## Phase 11: Testing

### 11.1 Backend tests
**Create test file**: `packages/backend/convex/maps/dataLayers.test.ts`

**Test cases**:
- ✅ Create data layer with correct order number
- ✅ Cannot archive last layer
- ✅ Archive cascade updates all entities
- ✅ Reorder updates order field correctly
- ✅ Toggle visibility works
- ✅ Migration creates default layers for existing maps

### 11.2 Frontend tests
**Test cases**:
- ✅ Data layer CRUD operations
- ✅ Drag-drop reordering
- ✅ Entity creation with layer selection
- ✅ "Remember last used" layer works
- ✅ Visibility toggle hides/shows entities
- ✅ Archive confirmation dialog
- ✅ Cannot archive last layer (button disabled)

### 11.3 Integration tests
- ✅ Create map → default layer created
- ✅ Add marker → assigned to correct layer
- ✅ Archive layer → entities archived
- ✅ Layer order affects map rendering

---

## Phase 12: Documentation

### 12.1 Update architecture docs
**File**: `docs/architecture.md`

**Add section**:
```markdown
## Data Layers

Data layers provide a way to organize and group map entities (markers, collections, paths, labels, routes) with visual hierarchy.

### Key Concepts
- Every map has at least one data layer (cannot delete the last one)
- Entities belong to exactly one data layer
- Layers have an `order` field (1-indexed) that controls rendering order
- Bottom layers (order=1) render first, top layers render last
- Archiving a layer cascades to all its entities

### Schema
- `dataLayers` table with fields: title, description, icon, color, order, hidden, isArchived
- All map entities have `dataLayerId` field

### Business Rules
1. Maps must have ≥1 non-archived layer
2. Cannot archive the last layer
3. Archiving layer sets `isArchived=true` on all entities
4. Order is sequential (1, 2, 3...) per map
5. UI remembers last-used layer per entity type
```

### 12.2 Create feature doc
**File**: `docs/features/data-layers.md` (NEW)

**Contents**:
```markdown
# Data Layers Feature

## Overview
Data layers allow users to organize map content into hierarchical groups with independent visibility controls.

## User Features
- Create unlimited layers per map
- Reorder layers via drag-drop
- Toggle layer visibility
- Archive layers (with cascade to entities)
- Assign entities to layers during creation
- Visual indicators (color, icon)

## Technical Implementation
See `docs/architecture.md` for schema details.

### API Endpoints
- `api.maps.dataLayers.getDataLayersForMap` - Query all layers
- `api.maps.dataLayers.createDataLayer` - Create new layer
- `api.maps.dataLayers.updateDataLayer` - Edit layer
- `api.maps.dataLayers.archiveDataLayer` - Archive layer
- `api.maps.dataLayers.reorderDataLayers` - Update order
- `api.maps.dataLayers.toggleDataLayerVisibility` - Show/hide

### UI Components
- `DataLayersList` - Main layers management panel
- `DataLayerForm` - Create/edit modal
- Layer selectors in all entity forms

## Future Enhancements
- Data stacks (layer groups)
- Layer templates
- Import/export layers
- Layer permissions (collaborator-specific)
```

---

## Implementation Checklist

### Backend
- [ ] Update `dataLayers` schema with `order` field
- [ ] Add `dataLayerId` to all entity schemas
- [ ] Add indexes for `by_data_layer_id`
- [ ] Create `dataLayers.ts` with CRUD operations
- [ ] Implement cascade archive logic
- [ ] Create migration for default layers
- [ ] Run migration on dev/staging
- [ ] Update `createMapFunction` to create default layer
- [ ] Update all entity mutations to require `dataLayerId`
- [ ] Add event logging types
- [ ] Export schemas and types

### Frontend
- [ ] Update map state provider with data layers
- [ ] Create `DataLayersList` component
- [ ] Create `DataLayerForm` component
- [ ] Add layers tab to sidebar
- [ ] Update marker form with layer selector
- [ ] Update collection form with layer selector
- [ ] Update path form with layer selector
- [ ] Update label form with layer selector
- [ ] Update route form with layer selector
- [ ] Group entities by layer in display
- [ ] Implement drag-drop reordering
- [ ] Respect layer visibility in rendering
- [ ] Implement map rendering by layer order

### Testing
- [ ] Backend unit tests
- [ ] Frontend component tests
- [ ] Integration tests
- [ ] Manual QA testing

### Documentation
- [ ] Update architecture docs
- [ ] Create feature documentation
- [ ] Update API reference

---

## Rollout Plan

### Phase 1: Backend (Week 1)
1. Schema updates
2. CRUD operations
3. Migration
4. Testing

### Phase 2: Integration (Week 2)
1. Map creation updates
2. Entity mutation updates
3. Backend testing

### Phase 3: Frontend (Week 3-4)
1. State management
2. UI components
3. Form updates
4. Display grouping

### Phase 4: Testing & Polish (Week 5)
1. End-to-end testing
2. Bug fixes
3. Performance optimization
4. Documentation

---

## Key Validation Rules Summary

1. ✅ Maps must always have ≥1 non-archived data layer
2. ✅ Cannot archive last non-archived layer
3. ✅ Archiving layer cascades `isArchived=true` to all entities
4. ✅ `dataLayerId` must belong to same map as entity
5. ✅ Order field must be unique per map and sequential (1, 2, 3...)
6. ✅ UI remembers last used layer per entity type
7. ✅ New maps start with "Default Layer" at order=1
8. ✅ Layer visibility (`hidden`) controls entity rendering

---

## Dependencies

**NPM Packages**:
- `@hello-pangea/dnd` - Drag and drop for layer reordering
- Existing: `react-hook-form`, `zod`, `@tanstack/react-table`

**Convex Packages**:
- `@convex-dev/migrations` - Already installed
- `convex-helpers` - Already installed

---

## Estimated Timeline

- **Backend**: 6-8 hours
- **Frontend**: 8-10 hours
- **Testing**: 3-4 hours
- **Documentation**: 2-3 hours
- **Total**: ~19-25 hours (3-4 days of development)
