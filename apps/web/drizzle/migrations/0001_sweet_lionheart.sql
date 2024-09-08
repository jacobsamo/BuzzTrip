/*
 SQLite does not support "Drop not null from column" out of the box, we do not generate automatic migration for that, so it has to be done manually
 Please refer to: https://www.techonthenet.com/sqlite/tables/alter_table.php
                  https://www.sqlite.org/lang_altertable.html
                  https://stackoverflow.com/questions/2083543/modify-a-columns-type-in-sqlite3

 Due to that we don't generate migration automatically and it has to be done manually
*/--> statement-breakpoint
ALTER TABLE `users` ADD `username` text;--> statement-breakpoint
ALTER TABLE `users` ADD `created_at` text DEFAULT (CURRENT_TIMESTAMP);--> statement-breakpoint
ALTER TABLE `users` ADD `updated_at` text DEFAULT (CURRENT_TIMESTAMP);--> statement-breakpoint
CREATE UNIQUE INDEX `users_username_unique` ON `users` (`username`);