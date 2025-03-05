PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_route_stops` (
	`route_stop_id` text PRIMARY KEY NOT NULL,
	`map_id` text NOT NULL,
	`route_id` text NOT NULL,
	`marker_id` text,
	`user_id` text NOT NULL,
	`lat` real NOT NULL,
	`lng` real NOT NULL,
	`stop_order` integer NOT NULL,
	`created_at` text DEFAULT (CURRENT_TIMESTAMP) NOT NULL,
	FOREIGN KEY (`map_id`) REFERENCES `maps`(`map_id`) ON UPDATE cascade ON DELETE cascade,
	FOREIGN KEY (`route_id`) REFERENCES `routes`(`route_id`) ON UPDATE cascade ON DELETE cascade,
	FOREIGN KEY (`marker_id`) REFERENCES `markers`(`marker_id`) ON UPDATE cascade ON DELETE cascade,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`user_id`) ON UPDATE cascade ON DELETE no action
);
--> statement-breakpoint
INSERT INTO `__new_route_stops`("route_stop_id", "map_id", "route_id", "marker_id", "lat", "lng", "stop_order", "created_at") SELECT "route_stop_id", "map_user_id", "route_id", "marker_id", "lat", "lng", "stop_order", "created_at" FROM `route_stops`;--> statement-breakpoint
DROP TABLE `route_stops`;--> statement-breakpoint
ALTER TABLE `__new_route_stops` RENAME TO `route_stops`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE TABLE `__new_routes` (
	`route_id` text PRIMARY KEY NOT NULL,
	`map_id` text NOT NULL,
	`name` text NOT NULL,
	`description` text,
	`travel_type` text DEFAULT 'driving' NOT NULL,
	`user_id` text NOT NULL,
	`created_at` text DEFAULT (CURRENT_TIMESTAMP) NOT NULL,
	FOREIGN KEY (`map_id`) REFERENCES `maps`(`map_id`) ON UPDATE cascade ON DELETE cascade,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`user_id`) ON UPDATE cascade ON DELETE no action
);
--> statement-breakpoint
INSERT INTO `__new_routes`("route_id", "map_id", "name", "description", "travel_type", "user_id", "created_at") SELECT "route_id", "map_user_id", "name", "description", "travel_type", "user_id", "created_at" FROM `routes`;--> statement-breakpoint
DROP TABLE `routes`;--> statement-breakpoint
ALTER TABLE `__new_routes` RENAME TO `routes`;--> statement-breakpoint
CREATE TABLE `__new_collection_links` (
	`link_id` text PRIMARY KEY NOT NULL,
	`collection_id` text,
	`marker_id` text NOT NULL,
	`map_id` text NOT NULL,
	`user_id` text NOT NULL,
	`created_at` text DEFAULT (CURRENT_TIMESTAMP) NOT NULL,
	FOREIGN KEY (`collection_id`) REFERENCES `collections`(`collection_id`) ON UPDATE cascade ON DELETE cascade,
	FOREIGN KEY (`marker_id`) REFERENCES `markers`(`marker_id`) ON UPDATE cascade ON DELETE cascade,
	FOREIGN KEY (`map_id`) REFERENCES `maps`(`map_id`) ON UPDATE cascade ON DELETE cascade,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`user_id`) ON UPDATE cascade ON DELETE no action
);
--> statement-breakpoint
INSERT INTO `__new_collection_links`("link_id", "collection_id", "marker_id", "map_id", "user_id", "created_at") SELECT "link_id", "collection_id", "marker_id", "map_id", "user_id", "created_at" FROM `collection_links`;--> statement-breakpoint
DROP TABLE `collection_links`;--> statement-breakpoint
ALTER TABLE `__new_collection_links` RENAME TO `collection_links`;--> statement-breakpoint
CREATE TABLE `__new_collections` (
	`collection_id` text PRIMARY KEY NOT NULL,
	`map_id` text NOT NULL,
	`title` text NOT NULL,
	`description` text,
	`created_by` text NOT NULL,
	`icon` text NOT NULL,
	`color` text,
	`created_at` text DEFAULT (CURRENT_TIMESTAMP) NOT NULL,
	`updated_at` text DEFAULT (CURRENT_TIMESTAMP) NOT NULL,
	FOREIGN KEY (`map_id`) REFERENCES `maps`(`map_id`) ON UPDATE cascade ON DELETE cascade,
	FOREIGN KEY (`created_by`) REFERENCES `users`(`user_id`) ON UPDATE cascade ON DELETE no action
);
--> statement-breakpoint
INSERT INTO `__new_collections`("collection_id", "map_id", "title", "description", "created_by", "icon", "color", "created_at", "updated_at") SELECT "collection_id", "map_id", "title", "description", "created_by", "icon", "color", "created_at", "updated_at" FROM `collections`;--> statement-breakpoint
DROP TABLE `collections`;--> statement-breakpoint
ALTER TABLE `__new_collections` RENAME TO `collections`;--> statement-breakpoint
CREATE TABLE `__new_labels` (
	`label_id` text PRIMARY KEY NOT NULL,
	`map_id` text NOT NULL,
	`title` text NOT NULL,
	`description` text,
	`icon` text,
	`color` text,
	`created_at` text DEFAULT (CURRENT_TIMESTAMP) NOT NULL,
	`updated_at` text DEFAULT (CURRENT_TIMESTAMP) NOT NULL,
	FOREIGN KEY (`map_id`) REFERENCES `maps`(`map_id`) ON UPDATE cascade ON DELETE cascade
);
--> statement-breakpoint
INSERT INTO `__new_labels`("label_id", "map_id", "title", "description", "icon", "color", "created_at", "updated_at") SELECT "label_id", "map_id", "title", "description", "icon", "color", "created_at", "updated_at" FROM `labels`;--> statement-breakpoint
DROP TABLE `labels`;--> statement-breakpoint
ALTER TABLE `__new_labels` RENAME TO `labels`;--> statement-breakpoint
CREATE TABLE `__new_map_users` (
	`map_user_id` text PRIMARY KEY NOT NULL,
	`map_id` text NOT NULL,
	`user_id` text NOT NULL,
	`permission` text DEFAULT 'editor' NOT NULL,
	FOREIGN KEY (`map_id`) REFERENCES `maps`(`map_id`) ON UPDATE cascade ON DELETE cascade,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`user_id`) ON UPDATE cascade ON DELETE no action
);
--> statement-breakpoint
INSERT INTO `__new_map_users`("map_user_id", "map_id", "user_id", "permission") SELECT "map_user_id", "map_id", "user_id", "permission" FROM `map_users`;--> statement-breakpoint
DROP TABLE `map_users`;--> statement-breakpoint
ALTER TABLE `__new_map_users` RENAME TO `map_users`;--> statement-breakpoint
CREATE TABLE `__new_maps` (
	`map_id` text PRIMARY KEY NOT NULL,
	`title` text NOT NULL,
	`description` text,
	`image` text,
	`icon` text,
	`color` text,
	`owner_id` text NOT NULL,
	`lat` real,
	`lng` real,
	`bounds` blob,
	`created_at` text DEFAULT (CURRENT_TIMESTAMP) NOT NULL,
	`updated_at` text DEFAULT (CURRENT_TIMESTAMP) NOT NULL,
	FOREIGN KEY (`owner_id`) REFERENCES `users`(`user_id`) ON UPDATE cascade ON DELETE no action
);
--> statement-breakpoint
INSERT INTO `__new_maps`("map_id", "title", "description", "image", "icon", "color", "owner_id", "lat", "lng", "bounds", "created_at", "updated_at") SELECT "map_id", "title", "description", "image", "icon", "color", "owner_id", "lat", "lng", "bounds", "created_at", "updated_at" FROM `maps`;--> statement-breakpoint
DROP TABLE `maps`;--> statement-breakpoint
ALTER TABLE `__new_maps` RENAME TO `maps`;--> statement-breakpoint
CREATE TABLE `__new_markers` (
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
	FOREIGN KEY (`created_by`) REFERENCES `users`(`user_id`) ON UPDATE cascade ON DELETE no action,
	FOREIGN KEY (`place_id`) REFERENCES `places`(`place_id`) ON UPDATE cascade ON DELETE no action,
	FOREIGN KEY (`map_id`) REFERENCES `maps`(`map_id`) ON UPDATE cascade ON DELETE cascade
);
--> statement-breakpoint
INSERT INTO `__new_markers`("marker_id", "title", "note", "lat", "lng", "created_by", "icon", "color", "place_id", "map_id", "created_at", "updated_at") SELECT "marker_id", "title", "note", "lat", "lng", "created_by", "icon", "color", "place_id", "map_id", "created_at", "updated_at" FROM `markers`;--> statement-breakpoint
DROP TABLE `markers`;--> statement-breakpoint
ALTER TABLE `__new_markers` RENAME TO `markers`;