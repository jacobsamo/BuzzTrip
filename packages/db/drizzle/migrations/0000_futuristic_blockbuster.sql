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