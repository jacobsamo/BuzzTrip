PRAGMA foreign_keys = OFF; -- Temporarily disable foreign keys for the migration

-- Rename existing tables to *-old
ALTER TABLE collection_links RENAME TO collection_links_old;
ALTER TABLE collections RENAME TO collections_old;
ALTER TABLE places RENAME TO places_old;
ALTER TABLE map_users RENAME TO map_users_old;
ALTER TABLE maps RENAME TO maps_old;
ALTER TABLE markers RENAME TO markers_old;
ALTER TABLE route_stops RENAME TO route_stops_old;
ALTER TABLE routes RENAME TO routes_old;
ALTER TABLE users RENAME TO users_old;

-- Create new tables (from futuristic_blockbuster.sql)
-- ... existing code from futuristic_blockbuster.sql for creating tables ...
CREATE TABLE `collection_links` (
	`link_id` text PRIMARY KEY NOT NULL,
	`collection_id` text,
	`marker_id` text NOT NULL,
	`map_id` text NOT NULL,
	`user_id` text,
	`created_at` text DEFAULT (CURRENT_TIMESTAMP) NOT NULL,
	FOREIGN KEY (`collection_id`) REFERENCES `collections`(`collection_id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`marker_id`) REFERENCES `markers`(`marker_id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`map_id`) REFERENCES `maps`(`map_id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`user_id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `collections` (
	`collection_id` text PRIMARY KEY NOT NULL,
	`map_id` text NOT NULL,
	`title` text NOT NULL,
	`description` text,
	`created_by` text NOT NULL,
	`icon` text NOT NULL,
	`color` text,
	`created_at` text DEFAULT (CURRENT_TIMESTAMP) NOT NULL,
	`updated_at` text DEFAULT (CURRENT_TIMESTAMP) NOT NULL,
	FOREIGN KEY (`map_id`) REFERENCES `maps`(`map_id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`created_by`) REFERENCES `users`(`user_id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `map_users` (
	`map_user_id` text PRIMARY KEY NOT NULL,
	`map_id` text NOT NULL,
	`user_id` text NOT NULL,
	`permission` text DEFAULT 'editor' NOT NULL,
	FOREIGN KEY (`map_id`) REFERENCES `maps`(`map_id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`user_id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `maps` (
	`map_id` text PRIMARY KEY NOT NULL,
	`title` text NOT NULL,
	`description` text,
	`image` text,
	`owner_id` text NOT NULL,
	`created_at` text DEFAULT (CURRENT_TIMESTAMP) NOT NULL,
	`updated_at` text DEFAULT (CURRENT_TIMESTAMP) NOT NULL,
	FOREIGN KEY (`owner_id`) REFERENCES `users`(`user_id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `markers` (
	`marker_id` text PRIMARY KEY NOT NULL,
	`title` text NOT NULL,
	`note` text,
	`lat` real NOT NULL,
	`lng` real NOT NULL,
	`created_by` text NOT NULL,
	`icon` text NOT NULL,
	`color` text,
	`place_id` text NOT NULL,
	`map_id` text NOT NULL,
	`created_at` text DEFAULT (CURRENT_TIMESTAMP) NOT NULL,
	`updated_at` text DEFAULT (CURRENT_TIMESTAMP) NOT NULL,
	FOREIGN KEY (`created_by`) REFERENCES `users`(`user_id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`place_id`) REFERENCES `places`(`place_id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`map_id`) REFERENCES `maps`(`map_id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `places` (
	`place_id` text PRIMARY KEY NOT NULL,
	`title` text NOT NULL,
	`description` text,
	`lat` real NOT NULL,
	`lng` real NOT NULL,
	`bounds` text NOT NULL,
	`address` text,
	`gm_place_id` text,
	`mb_place_id` text,
	`fq_place_id` text,
	`plus_code` text,
	`icon` text NOT NULL,
	`photos` text,
	`reviews` text,
	`rating` real,
	`avg_price` integer,
	`types` text,
	`website` text,
	`phone` text,
	`opening_times` text,
	`created_at` text DEFAULT (CURRENT_TIMESTAMP) NOT NULL,
	`updated_at` text DEFAULT (CURRENT_TIMESTAMP) NOT NULL
);
--> statement-breakpoint
CREATE TABLE `route_stops` (
	`route_stop_id` text PRIMARY KEY NOT NULL,
	`map_user_id` text NOT NULL,
	`route_id` text NOT NULL,
	`marker_id` text,
	`lat` real NOT NULL,
	`lng` real NOT NULL,
	`stop_order` integer NOT NULL,
	`created_at` text DEFAULT (CURRENT_TIMESTAMP) NOT NULL,
	FOREIGN KEY (`map_user_id`) REFERENCES `maps`(`map_id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`route_id`) REFERENCES `routes`(`route_id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`marker_id`) REFERENCES `markers`(`marker_id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `routes` (
	`route_id` text PRIMARY KEY NOT NULL,
	`map_user_id` text NOT NULL,
	`name` text NOT NULL,
	`description` text,
	`travel_type` text DEFAULT 'driving' NOT NULL,
	`user_id` text,
	`created_at` text DEFAULT (CURRENT_TIMESTAMP) NOT NULL,
	FOREIGN KEY (`map_user_id`) REFERENCES `maps`(`map_id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`user_id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `users` (
	`user_id` text PRIMARY KEY NOT NULL,
	`first_name` text,
	`last_name` text,
	`full_name` text GENERATED ALWAYS AS (first_name || ' ' || last_name) STORED,
	`email` text NOT NULL,
	`profile_picture` text,
	`username` text,
	`bio` text,
	`created_at` text DEFAULT (CURRENT_TIMESTAMP) NOT NULL,
	`updated_at` text DEFAULT (CURRENT_TIMESTAMP) NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `users_email_unique` ON `users` (`email`);



-- Migrate data from old tables to new tables
INSERT INTO users (user_id, first_name, last_name, email, username, created_at, updated_at)
SELECT user_id, first_name, last_name, email, username, created_at, updated_at
FROM users_old;

INSERT INTO maps (map_id, title, description, image, owner_id)
SELECT map_id, title, description, image, owner_id
FROM maps_old;

INSERT INTO map_users (map_user_id, map_id, user_id, permission)
SELECT map_user_id, map_id, user_id, permission
FROM map_users_old;

INSERT INTO places (
    place_id, title, description, lat, lng, bounds, address, 
    gm_place_id, icon, photos, reviews, rating, avg_price, 
    types, website, phone, opening_times, created_at, updated_at
)
SELECT 
    place_id, title, description, lat, lng, bounds, address,
    gm_place_id, icon, photos, reviews, rating, avg_price,
    types, website, phone, opening_times, created_at, updated_at
FROM places_old;


INSERT INTO markers (marker_id, title, note, lat, lng, created_by, created_at, icon, color, place_id, map_id)
SELECT marker_id, title, note, lat, lng, created_by, created_at, icon, color, place_id, map_id
FROM markers_old;

INSERT INTO collections (collection_id, map_id, title, description, created_by, created_at, icon, color)
SELECT collection_id, map_id, title, description, created_by, created_at, icon, color
FROM collections_old;

INSERT INTO collection_links (link_id, collection_id, marker_id, map_id, user_id)
SELECT link_id, collection_id, marker_id, map_id, user_id
FROM collection_links_old;


INSERT INTO routes (route_id, map_user_id, name, description, user_id)
SELECT route_id, map_user_id, name, description, user_id
FROM routes_old;


INSERT INTO route_stops (route_stop_id, map_user_id, route_id, marker_id, stop_order)
SELECT route_stop_id, map_user_id, route_id, marker_id, stop_order
FROM route_stops_old;



-- Drop old tables
DROP TABLE maps_old;
DROP TABLE map_users_old;
DROP TABLE places_old;
DROP TABLE markers_old;
DROP TABLE collections_old;
DROP TABLE collection_links_old;
DROP TABLE routes_old;
DROP TABLE route_stops_old;
DROP TABLE users_old;

PRAGMA foreign_keys = ON; -- Re-enable foreign keys