import type { ReferenceConfig } from "drizzle-orm/sqlite-core";

export const onUpdateOptions: ReferenceConfig["actions"] = {
  onDelete: "cascade",
  onUpdate: "no action",
};
