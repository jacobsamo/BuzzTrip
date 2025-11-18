import { Migrations } from "@convex-dev/migrations";
import { components, internal } from "./_generated/api.js";
import { DataModel } from "./_generated/dataModel.js";

export const migrations = new Migrations<DataModel>(components.migrations);

/**
 * Convert icon string from old format to new kebab-case format
 * Examples:
 * - "Train" -> "train"
 * - "IceCream" -> "ice-cream"
 * - "MapPin" -> "map-pin"
 */
function convertIconToKebabCase(icon: string | null | undefined): string | null {
  if (!icon) return null;

  return (
    icon
      // Insert hyphen before uppercase letters that follow lowercase letters
      .replace(/([a-z])([A-Z])/g, "$1-$2")
      // Convert to lowercase
      .toLowerCase()
  );
}

/**
 * Migration to convert old icon format to new kebab-case format
 *
 * Old format: "Train", "Car", "IceCream" (PascalCase/TitleCase)
 * New format: "train", "car", "ice-cream" (lowercase with hyphens)
 *
 * Tables affected:
 * - maps (icon field)
 * - labels (icon field)
 * - markers (icon field)
 * - collections (icon field)
 * - places (icon field)
 */

export const migrateMapsIcons = migrations.define({
  table: "maps",
  migrateOne: async (_ctx, doc) => {
    if (doc.icon) {
      const newIcon = convertIconToKebabCase(doc.icon);
      if (newIcon && newIcon !== doc.icon) {
        return { icon: newIcon };
      }
    }
  },
});

export const migrateLabelsIcons = migrations.define({
  table: "labels",
  migrateOne: async (_ctx, doc) => {
    if (doc.icon) {
      const newIcon = convertIconToKebabCase(doc.icon);
      if (newIcon && newIcon !== doc.icon) {
        return { icon: newIcon };
      }
    }
  },
});

export const migrateMarkersIcons = migrations.define({
  table: "markers",
  migrateOne: async (_ctx, doc) => {
    if (doc.icon) {
      const newIcon = convertIconToKebabCase(doc.icon);
      if (newIcon && newIcon !== doc.icon) {
        return { icon: newIcon };
      }
    }
  },
});

export const migrateCollectionsIcons = migrations.define({
  table: "collections",
  migrateOne: async (_ctx, doc) => {
    if (doc.icon) {
      const newIcon = convertIconToKebabCase(doc.icon);
      if (newIcon && newIcon !== doc.icon) {
        return { icon: newIcon };
      }
    }
  },
});

export const migratePlacesIcons = migrations.define({
  table: "places",
  migrateOne: async (_ctx, doc) => {
    if (doc.icon) {
      const newIcon = convertIconToKebabCase(doc.icon);
      if (newIcon && newIcon !== doc.icon) {
        return { icon: newIcon };
      }
    }
  },
});

// Runner to execute all icon migrations in sequence
export const runAllIconMigrations = migrations.runner([
  internal.migrations.migrateMapsIcons,
  internal.migrations.migrateLabelsIcons,
  internal.migrations.migrateMarkersIcons,
  internal.migrations.migrateCollectionsIcons,
  internal.migrations.migratePlacesIcons,
]);

// Migration to add isArchived field to all tables
export const addIsArchivedToMaps = migrations.define({
  table: "maps",
  migrateOne: async (_ctx, doc) => {
    if (doc.isArchived === undefined) {
      return { isArchived: false };
    }
  },
});

export const addIsArchivedToMapUsers = migrations.define({
  table: "map_users",
  migrateOne: async (_ctx, doc) => {
    if (doc.isArchived === undefined) {
      return { isArchived: false };
    }
  },
});

export const addIsArchivedToLabels = migrations.define({
  table: "labels",
  migrateOne: async (_ctx, doc) => {
    if (doc.isArchived === undefined) {
      return { isArchived: false };
    }
  },
});

export const addIsArchivedToMarkers = migrations.define({
  table: "markers",
  migrateOne: async (_ctx, doc) => {
    if (doc.isArchived === undefined) {
      return { isArchived: false };
    }
  },
});

export const addIsArchivedToCollections = migrations.define({
  table: "collections",
  migrateOne: async (_ctx, doc) => {
    if (doc.isArchived === undefined) {
      return { isArchived: false };
    }
  },
});

export const addIsArchivedToCollectionLinks = migrations.define({
  table: "collection_links",
  migrateOne: async (_ctx, doc) => {
    if (doc.isArchived === undefined) {
      return { isArchived: false };
    }
  },
});

export const addIsArchivedToRoutes = migrations.define({
  table: "routes",
  migrateOne: async (_ctx, doc) => {
    if (doc.isArchived === undefined) {
      return { isArchived: false };
    }
  },
});

export const addIsArchivedToRouteStops = migrations.define({
  table: "route_stops",
  migrateOne: async (_ctx, doc) => {
    if (doc.isArchived === undefined) {
      return { isArchived: false };
    }
  },
});

export const addIsArchivedToPaths = migrations.define({
  table: "paths",
  migrateOne: async (_ctx, doc) => {
    if (doc.isArchived === undefined) {
      return { isArchived: false };
    }
  },
});

export const addIsArchivedToUsers = migrations.define({
  table: "users",
  migrateOne: async (_ctx, doc) => {
    if (doc.isArchived === undefined) {
      return { isArchived: false };
    }
  },
});

export const addIsArchivedToBetaUsers = migrations.define({
  table: "beta_users",
  migrateOne: async (_ctx, doc) => {
    if (doc.isArchived === undefined) {
      return { isArchived: false };
    }
  },
});

export const addIsArchivedToPlaces = migrations.define({
  table: "places",
  migrateOne: async (_ctx, doc) => {
    if (doc.isArchived === undefined) {
      return { isArchived: false };
    }
  },
});

export const addIsArchivedToPlacesReviews = migrations.define({
  table: "places_reviews",
  migrateOne: async (_ctx, doc) => {
    if (doc.isArchived === undefined) {
      return { isArchived: false };
    }
  },
});

export const addIsArchivedToPlacePhotos = migrations.define({
  table: "place_photos",
  migrateOne: async (_ctx, doc) => {
    if (doc.isArchived === undefined) {
      return { isArchived: false };
    }
  },
});

export const addIsArchivedToMapViews = migrations.define({
  table: "mapViews",
  migrateOne: async (_ctx, doc) => {
    if (doc.isArchived === undefined) {
      return { isArchived: false };
    }
  },
});

export const addIsArchivedToMapEvents = migrations.define({
  table: "mapEvents",
  migrateOne: async (_ctx, doc) => {
    if (doc.isArchived === undefined) {
      return { isArchived: false };
    }
  },
});

export const addIsArchivedToDataLayers = migrations.define({
  table: "dataLayers",
  migrateOne: async (_ctx, doc) => {
    if (doc.isArchived === undefined) {
      return { isArchived: false };
    }
  },
});

// Runner to execute all isArchived migrations
export const runAllIsArchivedMigrations = migrations.runner([
  internal.migrations.addIsArchivedToMaps,
  internal.migrations.addIsArchivedToMapUsers,
  internal.migrations.addIsArchivedToLabels,
  internal.migrations.addIsArchivedToMarkers,
  internal.migrations.addIsArchivedToCollections,
  internal.migrations.addIsArchivedToCollectionLinks,
  internal.migrations.addIsArchivedToRoutes,
  internal.migrations.addIsArchivedToRouteStops,
  internal.migrations.addIsArchivedToPaths,
  internal.migrations.addIsArchivedToUsers,
  internal.migrations.addIsArchivedToBetaUsers,
  internal.migrations.addIsArchivedToPlaces,
  internal.migrations.addIsArchivedToPlacesReviews,
  internal.migrations.addIsArchivedToPlacePhotos,
  internal.migrations.addIsArchivedToMapViews,
  internal.migrations.addIsArchivedToMapEvents,
  internal.migrations.addIsArchivedToDataLayers,
]);

// Keep the default runner for backwards compatibility
export const run = migrations.runner();
