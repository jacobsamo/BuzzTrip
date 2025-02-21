import { sql } from "drizzle-orm";
import { sqliteTable, text } from "drizzle-orm/sqlite-core";

export const users = sqliteTable("users", {
  user_id: text("user_id").primaryKey().notNull(),
  first_name: text("first_name"),
  last_name: text("last_name"),
  full_name: text("full_name").generatedAlwaysAs(
    sql`first_name || ' ' || last_name`,
    {
      mode: "stored",
    }
  ),
  email: text("email").notNull().unique(),
  profile_picture: text("profile_picture"),
  username: text("username"),
  bio: text("bio"),
  created_at: text("created_at")
    .default(sql`(CURRENT_TIMESTAMP)`)
    .notNull(),
  updated_at: text("updated_at")
    .default(sql`(CURRENT_TIMESTAMP)`)
    .notNull(),
});
