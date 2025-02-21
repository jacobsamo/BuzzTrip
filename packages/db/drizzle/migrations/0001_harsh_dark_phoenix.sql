CREATE TABLE `labels` (
	`label_id` text PRIMARY KEY NOT NULL,
	`map_id` text NOT NULL,
	`title` text NOT NULL,
	`description` text,
	`icon` text,
	`color` text,
	`created_at` text DEFAULT (CURRENT_TIMESTAMP) NOT NULL,
	`updated_at` text DEFAULT (CURRENT_TIMESTAMP) NOT NULL,
	FOREIGN KEY (`map_id`) REFERENCES `maps`(`map_id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
ALTER TABLE `maps` ADD `icon` text;--> statement-breakpoint
ALTER TABLE `maps` ADD `color` text;--> statement-breakpoint
ALTER TABLE `maps` ADD `lat` real;--> statement-breakpoint
ALTER TABLE `maps` ADD `lng` real;--> statement-breakpoint
ALTER TABLE `maps` ADD `bounds` blob;