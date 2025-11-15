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

// Keep the default runner for backwards compatibility
export const run = migrations.runner();
