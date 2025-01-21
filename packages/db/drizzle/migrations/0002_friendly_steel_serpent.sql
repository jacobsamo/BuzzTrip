DROP INDEX "users_email_unique";--> statement-breakpoint
ALTER TABLE `collections` ALTER COLUMN "created_at" TO "created_at" text NOT NULL DEFAULT (CURRENT_TIMESTAMP);--> statement-breakpoint
CREATE UNIQUE INDEX `users_email_unique` ON `users` (`email`);--> statement-breakpoint
ALTER TABLE `collections` ADD `updated_at` text NOT NULL DEFAULT (CURRENT_TIMESTAMP);--> statement-breakpoint
ALTER TABLE `locations` ALTER COLUMN "created_at" TO "created_at" text NOT NULL DEFAULT (CURRENT_TIMESTAMP);--> statement-breakpoint
ALTER TABLE `locations` ALTER COLUMN "updated_at" TO "updated_at" text NOT NULL DEFAULT (CURRENT_TIMESTAMP);--> statement-breakpoint
ALTER TABLE `markers` ALTER COLUMN "created_at" TO "created_at" text NOT NULL DEFAULT (CURRENT_TIMESTAMP);--> statement-breakpoint
ALTER TABLE `markers` ADD `updated_at` text NOT NULL DEFAULT (CURRENT_TIMESTAMP);--> statement-breakpoint
ALTER TABLE `users` ALTER COLUMN "created_at" TO "created_at" text NOT NULL DEFAULT (CURRENT_TIMESTAMP);--> statement-breakpoint
ALTER TABLE `users` ALTER COLUMN "updated_at" TO "updated_at" text NOT NULL DEFAULT (CURRENT_TIMESTAMP);--> statement-breakpoint
ALTER TABLE `collection_links` ADD `created_at` text NOT NULL DEFAULT (CURRENT_TIMESTAMP);--> statement-breakpoint
ALTER TABLE `map_users` ADD `created_at` text NOT NULL DEFAULT (CURRENT_TIMESTAMP);--> statement-breakpoint
ALTER TABLE `map_users` ADD `updated_at` text NOT NULL DEFAULT (CURRENT_TIMESTAMP);--> statement-breakpoint
ALTER TABLE `maps` ADD `created_at` text NOT NULL DEFAULT (CURRENT_TIMESTAMP);--> statement-breakpoint
ALTER TABLE `maps` ADD `updated_at` text NOT NULL DEFAULT (CURRENT_TIMESTAMP);--> statement-breakpoint
ALTER TABLE `route_stops` ADD `created_at` text NOT NULL DEFAULT (CURRENT_TIMESTAMP);--> statement-breakpoint
ALTER TABLE `routes` ADD `created_at` text NOT NULL DEFAULT (CURRENT_TIMESTAMP);