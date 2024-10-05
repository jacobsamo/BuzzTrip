CREATE TABLE `collection_markers` (
	`link_id` text PRIMARY KEY NOT NULL,
	`collection_id` text,
	`marker_id` text,
	`map_id` text,
	`user_id` text,
	FOREIGN KEY (`collection_id`) REFERENCES `collections`(`collection_id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`marker_id`) REFERENCES `markers`(`marker_id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`map_id`) REFERENCES `maps`(`map_id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`user_id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `collections` (
	`collection_id` text PRIMARY KEY NOT NULL,
	`map_id` text,
	`title` text NOT NULL,
	`description` text,
	`created_by` text NOT NULL,
	`created_at` text DEFAULT (CURRENT_TIMESTAMP),
	`icon` text NOT NULL,
	`color` text,
	FOREIGN KEY (`map_id`) REFERENCES `maps`(`map_id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`created_by`) REFERENCES `users`(`user_id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `locations` (
	`location_id` text PRIMARY KEY NOT NULL,
	`title` text NOT NULL,
	`description` text,
	`lat` real NOT NULL,
	`lng` real NOT NULL,
	`bounds` text NOT NULL,
	`address` text,
	`gm_place_id` text,
	`icon` text NOT NULL,
	`photos` text,
	`reviews` text,
	`rating` real,
	`avg_price` integer,
	`types` text,
	`website` text,
	`phone` text,
	`opening_times` text,
	`created_at` text DEFAULT (CURRENT_TIMESTAMP),
	`updated_at` text DEFAULT (CURRENT_TIMESTAMP)
);
--> statement-breakpoint
CREATE TABLE `map_users` (
	`map_id` text,
	`user_id` text,
	`permission` text DEFAULT 'editor' NOT NULL,
	FOREIGN KEY (`map_id`) REFERENCES `maps`(`map_id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`user_id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `maps` (
	`map_id` text PRIMARY KEY NOT NULL,
	`title` text NOT NULL,
	`description` text,
	`image` text,
	`owner_id` text NOT NULL,
	FOREIGN KEY (`owner_id`) REFERENCES `users`(`user_id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `markers` (
	`marker_id` text PRIMARY KEY NOT NULL,
	`collection_id` text,
	`title` text NOT NULL,
	`note` text,
	`lat` real NOT NULL,
	`lng` real NOT NULL,
	`created_by` text NOT NULL,
	`created_at` text DEFAULT (CURRENT_TIMESTAMP),
	`icon` text NOT NULL,
	`color` text,
	`location_id` text,
	`map_id` text,
	FOREIGN KEY (`collection_id`) REFERENCES `collections`(`collection_id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`created_by`) REFERENCES `users`(`user_id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`location_id`) REFERENCES `locations`(`location_id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`map_id`) REFERENCES `maps`(`map_id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `route` (
	`route_id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`description` text,
	`user_id` text,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`user_id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `route_stops` (
	`route_stop_id` text PRIMARY KEY NOT NULL,
	`route_id` text,
	`marker_id` text,
	`stop_order` integer NOT NULL,
	FOREIGN KEY (`route_id`) REFERENCES `route`(`route_id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`marker_id`) REFERENCES `markers`(`marker_id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `users` (
	`user_id` text PRIMARY KEY NOT NULL,
	`first_name` text,
	`last_name` text,
	`username` text,
	`email` text NOT NULL,
	`created_at` text DEFAULT (CURRENT_TIMESTAMP),
	`updated_at` text DEFAULT (CURRENT_TIMESTAMP)
);
--> statement-breakpoint
CREATE UNIQUE INDEX `users_username_unique` ON `users` (`username`);--> statement-breakpoint
CREATE UNIQUE INDEX `users_email_unique` ON `users` (`email`);