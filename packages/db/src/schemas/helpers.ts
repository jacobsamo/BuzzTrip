import { type ReferenceConfig, customType } from "drizzle-orm/sqlite-core";
import { sql } from "drizzle-orm";

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




const float32Array = customType<{
  data: number[];
  config: { dimensions: number };
  configRequired: true;
  driverData: Buffer;
}>({
  dataType(config) {
    return `F32_BLOB(${config.dimensions})`;
  },
  fromDriver(value: Buffer) {
    return Array.from(new Float32Array(value.buffer));
  },
  toDriver(value: number[]) {
    return sql`vector32(${JSON.stringify(value)})`;
  },
});