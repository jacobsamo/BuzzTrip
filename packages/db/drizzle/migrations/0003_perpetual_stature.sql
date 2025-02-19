ALTER TABLE `locations` RENAME TO `places`;--> statement-breakpoint
ALTER TABLE `places` RENAME COLUMN "location_id" TO "place_id";--> statement-breakpoint
ALTER TABLE `markers` RENAME COLUMN "location_id" TO "place_id";--> statement-breakpoint
DROP INDEX "users_email_unique";--> statement-breakpoint
ALTER TABLE `places` ALTER COLUMN "created_at" TO "created_at" text NOT NULL DEFAULT (CURRENT_TIMESTAMP);--> statement-breakpoint
CREATE UNIQUE INDEX `users_email_unique` ON `users` (`email`);--> statement-breakpoint
ALTER TABLE `places` ALTER COLUMN "updated_at" TO "updated_at" text NOT NULL DEFAULT (CURRENT_TIMESTAMP);--> statement-breakpoint
ALTER TABLE `places` ADD `mb_place_id` text;--> statement-breakpoint
ALTER TABLE `places` ADD `fq_place_id` text;--> statement-breakpoint
ALTER TABLE `places` ADD `plus_code` text;--> statement-breakpoint
ALTER TABLE `markers` ALTER COLUMN "created_at" TO "created_at" text NOT NULL DEFAULT (CURRENT_TIMESTAMP);--> statement-breakpoint
ALTER TABLE `markers` ADD `updated_at` text DEFAULT (CURRENT_TIMESTAMP) NOT NULL;--> statement-breakpoint
ALTER TABLE `markers` ALTER COLUMN "place_id" TO "place_id" text NOT NULL REFERENCES places(place_id) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
DROP INDEX `users_username_unique`;--> statement-breakpoint
ALTER TABLE `users` ALTER COLUMN "created_at" TO "created_at" text NOT NULL DEFAULT (CURRENT_TIMESTAMP);--> statement-breakpoint
ALTER TABLE `users` ALTER COLUMN "updated_at" TO "updated_at" text NOT NULL DEFAULT (CURRENT_TIMESTAMP);--> statement-breakpoint
ALTER TABLE `users` ADD `profile_picture` text;--> statement-breakpoint
ALTER TABLE `users` ADD `bio` text;--> statement-breakpoint
ALTER TABLE `collections` ALTER COLUMN "created_at" TO "created_at" text NOT NULL DEFAULT (CURRENT_TIMESTAMP);--> statement-breakpoint
ALTER TABLE `collections` ADD `updated_at` text DEFAULT (CURRENT_TIMESTAMP) NOT NULL;--> statement-breakpoint
ALTER TABLE `collection_links` ADD `created_at` text DEFAULT (CURRENT_TIMESTAMP) NOT NULL;--> statement-breakpoint
ALTER TABLE `maps` ADD `created_at` text DEFAULT (CURRENT_TIMESTAMP) NOT NULL;--> statement-breakpoint
ALTER TABLE `maps` ADD `updated_at` text DEFAULT (CURRENT_TIMESTAMP) NOT NULL;--> statement-breakpoint
ALTER TABLE `route_stops` ADD `lat` real NOT NULL;--> statement-breakpoint
ALTER TABLE `route_stops` ADD `lng` real NOT NULL;--> statement-breakpoint
ALTER TABLE `route_stops` ADD `created_at` text DEFAULT (CURRENT_TIMESTAMP) NOT NULL;--> statement-breakpoint
ALTER TABLE `routes` ADD `travel_type` text DEFAULT 'driving' NOT NULL;--> statement-breakpoint
ALTER TABLE `routes` ADD `created_at` text DEFAULT (CURRENT_TIMESTAMP) NOT NULL;