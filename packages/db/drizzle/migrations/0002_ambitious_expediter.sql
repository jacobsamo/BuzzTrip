ALTER TABLE `locations` RENAME TO `places`;--> statement-breakpoint
ALTER TABLE `places` RENAME COLUMN "location_id" TO "place_id";--> statement-breakpoint
ALTER TABLE `markers` RENAME COLUMN "location_id" TO "place_id";--> statement-breakpoint
ALTER TABLE `places` ADD `mb_place_id` text;--> statement-breakpoint
ALTER TABLE `places` ADD `fq_place_id` text;--> statement-breakpoint
ALTER TABLE `places` ADD `plus_code` text;--> statement-breakpoint
ALTER TABLE `markers` ALTER COLUMN "place_id" TO "place_id" text NOT NULL REFERENCES places(place_id) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
DROP INDEX `users_username_unique`;--> statement-breakpoint
ALTER TABLE `users` ADD `profile_picture` text;--> statement-breakpoint
ALTER TABLE `users` ADD `bio` text;--> statement-breakpoint
ALTER TABLE `users` ADD `full_name` text GENERATED ALWAYS AS (first_name || ' ' || last_name) STORED--> statement-breakpoint
ALTER TABLE `route_stops` ADD `lat` real NOT NULL;--> statement-breakpoint
ALTER TABLE `route_stops` ADD `lng` real NOT NULL;--> statement-breakpoint
ALTER TABLE `routes` ADD `travel_type` text DEFAULT 'driving' NOT NULL;