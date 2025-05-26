ALTER TABLE `maps` ADD `location_name` text;--> statement-breakpoint
ALTER TABLE `maps` ADD `visibility` text DEFAULT 'private' NOT NULL;