CREATE TABLE `collection_markers` (
	`collection_id` text,
	`marker_id` text,
	`map_id` text,
	FOREIGN KEY (`collection_id`) REFERENCES `collections`(`collection`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`marker_id`) REFERENCES `markers`(`marker_id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`map_id`) REFERENCES `maps`(`map_id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `collections` (
	`collection` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`description` text,
	`map_id` text,
	FOREIGN KEY (`map_id`) REFERENCES `maps`(`map_id`) ON UPDATE no action ON DELETE no action
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
	`name` text NOT NULL,
	`description` text,
	`owner_id` text NOT NULL,
	FOREIGN KEY (`owner_id`) REFERENCES `users`(`user_id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `markers` (
	`marker_id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`lat` real NOT NULL,
	`lng` real NOT NULL,
	`map_id` text,
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
	`first_name` text NOT NULL,
	`last_name` text NOT NULL,
	`email` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `users_email_unique` ON `users` (`email`);