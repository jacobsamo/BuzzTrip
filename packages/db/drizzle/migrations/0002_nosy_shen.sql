DROP INDEX "passkey_user_id_idx";--> statement-breakpoint
DROP INDEX "secret_idx";--> statement-breakpoint
DROP INDEX "user_account_user_id_idx";--> statement-breakpoint
DROP INDEX "user_sessions_token_unique";--> statement-breakpoint
DROP INDEX "user_sessions_user_id_idx";--> statement-breakpoint
DROP INDEX "token_idx";--> statement-breakpoint
DROP INDEX "identifier_idx";--> statement-breakpoint
DROP INDEX "users_email_unique";--> statement-breakpoint
DROP INDEX "user_email_idx";--> statement-breakpoint
DROP INDEX "collection_links_map_id_idx";--> statement-breakpoint
DROP INDEX "collection_links_marker_id_idx";--> statement-breakpoint
DROP INDEX "collections_map_id_idx";--> statement-breakpoint
DROP INDEX "labels_map_id_idx";--> statement-breakpoint
DROP INDEX "map_users_map_id_idx";--> statement-breakpoint
DROP INDEX "markers_map_id_idx";--> statement-breakpoint
DROP INDEX "markers_place_id_idx";--> statement-breakpoint
DROP INDEX "route_stops_map_id_idx";--> statement-breakpoint
DROP INDEX "routes_map_id_idx";--> statement-breakpoint
DROP INDEX "gm_place_id_ixd";--> statement-breakpoint
DROP INDEX "mb_place_id_ixd";--> statement-breakpoint
DROP INDEX "fq_place_id_ixd";--> statement-breakpoint
DROP INDEX "places_lat_idx";--> statement-breakpoint
DROP INDEX "places_lng_idx";--> statement-breakpoint
DROP INDEX "places_address_idx";--> statement-breakpoint
ALTER TABLE `users` ALTER COLUMN "email_verified" TO "email_verified" integer NOT NULL DEFAULT false;--> statement-breakpoint
CREATE INDEX `passkey_user_id_idx` ON `passkey` (`user_id`);--> statement-breakpoint
CREATE INDEX `secret_idx` ON `two_factor` (`secret`);--> statement-breakpoint
CREATE INDEX `user_account_user_id_idx` ON `user_accounts` (`user_id`);--> statement-breakpoint
CREATE UNIQUE INDEX `user_sessions_token_unique` ON `user_sessions` (`token`);--> statement-breakpoint
CREATE INDEX `user_sessions_user_id_idx` ON `user_sessions` (`user_id`);--> statement-breakpoint
CREATE INDEX `token_idx` ON `user_sessions` (`token`);--> statement-breakpoint
CREATE INDEX `identifier_idx` ON `user_verifications` (`identifier`);--> statement-breakpoint
CREATE UNIQUE INDEX `users_email_unique` ON `users` (`email`);--> statement-breakpoint
CREATE INDEX `user_email_idx` ON `users` (`email`);--> statement-breakpoint
CREATE INDEX `collection_links_map_id_idx` ON `collection_links` (`map_id`);--> statement-breakpoint
CREATE INDEX `collection_links_marker_id_idx` ON `collection_links` (`marker_id`);--> statement-breakpoint
CREATE INDEX `collections_map_id_idx` ON `collections` (`map_id`);--> statement-breakpoint
CREATE INDEX `labels_map_id_idx` ON `labels` (`map_id`);--> statement-breakpoint
CREATE INDEX `map_users_map_id_idx` ON `map_users` (`map_id`);--> statement-breakpoint
CREATE INDEX `markers_map_id_idx` ON `markers` (`map_id`);--> statement-breakpoint
CREATE INDEX `markers_place_id_idx` ON `markers` (`place_id`);--> statement-breakpoint
CREATE INDEX `route_stops_map_id_idx` ON `route_stops` (`map_id`);--> statement-breakpoint
CREATE INDEX `routes_map_id_idx` ON `routes` (`map_id`);--> statement-breakpoint
CREATE INDEX `gm_place_id_ixd` ON `places` (`gm_place_id`);--> statement-breakpoint
CREATE INDEX `mb_place_id_ixd` ON `places` (`mb_place_id`);--> statement-breakpoint
CREATE INDEX `fq_place_id_ixd` ON `places` (`fq_place_id`);--> statement-breakpoint
CREATE INDEX `places_lat_idx` ON `places` (`lat`);--> statement-breakpoint
CREATE INDEX `places_lng_idx` ON `places` (`lng`);--> statement-breakpoint
CREATE INDEX `places_address_idx` ON `places` (`address`);--> statement-breakpoint
ALTER TABLE `users` ADD `role` text;--> statement-breakpoint
ALTER TABLE `users` ADD `banned` integer;--> statement-breakpoint
ALTER TABLE `users` ADD `ban_reason` text;--> statement-breakpoint
ALTER TABLE `users` ADD `ban_expires` integer;--> statement-breakpoint
ALTER TABLE `user_sessions` ADD `impersonated_by` text;