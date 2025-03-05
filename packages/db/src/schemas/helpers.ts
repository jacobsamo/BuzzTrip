import type { ReferenceConfig } from "drizzle-orm/sqlite-core";

/**
 * Cascade changes for delete and update
 */
export const cascadeActions: ReferenceConfig["actions"] = {
  onDelete: "cascade",
  onUpdate: "cascade",
};

/**
 * Cascade changes for updates only, deletes are not cascaded
 */
export const cascadeUpdate: ReferenceConfig["actions"] = {
  onDelete: "no action",
  onUpdate: "cascade",
};

/**
 * Cascade changes for delete's only, updates are not cascaded
 */
export const cascadeDelete: ReferenceConfig["actions"] = {
  onDelete: "cascade",
  onUpdate: "no action",
};
