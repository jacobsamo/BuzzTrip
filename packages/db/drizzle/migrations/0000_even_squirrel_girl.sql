CREATE TABLE `passkey` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text,
	`public_key` text NOT NULL,
	`user_id` text NOT NULL,
	`credential_i_d` text NOT NULL,
	`counter` integer NOT NULL,
	`device_type` text NOT NULL,
	`backed_up` integer NOT NULL,
	`transports` text,
	`created_at` integer,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`user_id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `passkey_user_id_idx` ON `passkey` (`user_id`);--> statement-breakpoint
CREATE TABLE `two_factor` (
	`id` text PRIMARY KEY NOT NULL,
	`secret` text NOT NULL,
	`backup_codes` text NOT NULL,
	`user_id` text NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`user_id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `secret_idx` ON `two_factor` (`secret`);--> statement-breakpoint
CREATE TABLE `user_accounts` (
	`id` text PRIMARY KEY NOT NULL,
	`account_id` text NOT NULL,
	`provider_id` text NOT NULL,
	`user_id` text NOT NULL,
	`access_token` text,
	`refresh_token` text,
	`id_token` text,
	`access_token_expires_at` integer,
	`refresh_token_expires_at` integer,
	`scope` text,
	`password` text,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`user_id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `user_account_user_id_idx` ON `user_accounts` (`user_id`);--> statement-breakpoint
CREATE TABLE `user_sessions` (
	`id` text PRIMARY KEY NOT NULL,
	`expires_at` integer NOT NULL,
	`token` text NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	`ip_address` text,
	`user_agent` text,
	`user_id` text NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`user_id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `user_sessions_token_unique` ON `user_sessions` (`token`);--> statement-breakpoint
CREATE INDEX `user_sessions_user_id_idx` ON `user_sessions` (`user_id`);--> statement-breakpoint
CREATE INDEX `token_idx` ON `user_sessions` (`token`);--> statement-breakpoint
CREATE TABLE `user_verifications` (
	`id` text PRIMARY KEY NOT NULL,
	`identifier` text NOT NULL,
	`value` text NOT NULL,
	`expires_at` integer NOT NULL,
	`created_at` integer,
	`updated_at` integer
);
--> statement-breakpoint
CREATE INDEX `identifier_idx` ON `user_verifications` (`identifier`);--> statement-breakpoint
CREATE TABLE `users` (
	`user_id` text PRIMARY KEY NOT NULL,
	`full_name` text NOT NULL,
	`email` text NOT NULL,
	`email_verified` integer NOT NULL,
	`profile_picture` text,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	`two_factor_enabled` integer,
	`first_name` text,
	`last_name` text,
	`username` text,
	`bio` text
);
--> statement-breakpoint
CREATE UNIQUE INDEX `users_email_unique` ON `users` (`email`);--> statement-breakpoint
CREATE INDEX `user_email_idx` ON `users` (`email`);--> statement-breakpoint
CREATE TABLE `collection_links` (
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
CREATE INDEX `collection_links_map_id_idx` ON `collection_links` (`map_id`);--> statement-breakpoint
CREATE INDEX `collection_links_marker_id_idx` ON `collection_links` (`marker_id`);--> statement-breakpoint
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
	FOREIGN KEY (`map_id`) REFERENCES `maps`(`map_id`) ON UPDATE cascade ON DELETE cascade,
	FOREIGN KEY (`created_by`) REFERENCES `users`(`user_id`) ON UPDATE cascade ON DELETE no action
);
--> statement-breakpoint
CREATE INDEX `collections_map_id_idx` ON `collections` (`map_id`);--> statement-breakpoint
CREATE TABLE `labels` (
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
CREATE INDEX `labels_map_id_idx` ON `labels` (`map_id`);--> statement-breakpoint
CREATE TABLE `map_users` (
	`map_user_id` text PRIMARY KEY NOT NULL,
	`map_id` text NOT NULL,
	`user_id` text NOT NULL,
	`permission` text DEFAULT 'editor' NOT NULL,
	FOREIGN KEY (`map_id`) REFERENCES `maps`(`map_id`) ON UPDATE cascade ON DELETE cascade,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`user_id`) ON UPDATE cascade ON DELETE no action
);
--> statement-breakpoint
CREATE INDEX `map_users_map_id_idx` ON `map_users` (`map_id`);--> statement-breakpoint
CREATE TABLE `maps` (
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
	FOREIGN KEY (`created_by`) REFERENCES `users`(`user_id`) ON UPDATE cascade ON DELETE no action,
	FOREIGN KEY (`place_id`) REFERENCES `places`(`place_id`) ON UPDATE cascade ON DELETE no action,
	FOREIGN KEY (`map_id`) REFERENCES `maps`(`map_id`) ON UPDATE cascade ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `markers_map_id_idx` ON `markers` (`map_id`);--> statement-breakpoint
CREATE INDEX `markers_place_id_idx` ON `markers` (`place_id`);--> statement-breakpoint
CREATE TABLE `route_stops` (
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
CREATE INDEX `route_stops_map_id_idx` ON `route_stops` (`map_id`);--> statement-breakpoint
CREATE TABLE `routes` (
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
CREATE INDEX `routes_map_id_idx` ON `routes` (`map_id`);--> statement-breakpoint
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
CREATE INDEX `gm_place_id_ixd` ON `places` (`gm_place_id`);--> statement-breakpoint
CREATE INDEX `mb_place_id_ixd` ON `places` (`mb_place_id`);--> statement-breakpoint
CREATE INDEX `fq_place_id_ixd` ON `places` (`fq_place_id`);--> statement-breakpoint
CREATE INDEX `places_lat_idx` ON `places` (`lat`);--> statement-breakpoint
CREATE INDEX `places_lng_idx` ON `places` (`lng`);--> statement-breakpoint
CREATE INDEX `places_address_idx` ON `places` (`address`);