DROP INDEX `users_username_unique`;--> statement-breakpoint
ALTER TABLE `users` ADD `full_name` text GENERATED ALWAYS AS ("first_name" "last_name") VIRTUAL;--> statement-breakpoint
ALTER TABLE `users` ADD `profile_picture` text;--> statement-breakpoint
ALTER TABLE `users` ADD `bio` text;