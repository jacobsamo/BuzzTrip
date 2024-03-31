DO $$ BEGIN
 CREATE TYPE "permissionLLevel" AS ENUM('viewer', 'editer', 'owner');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "collection" (
	"uid" varchar(255) PRIMARY KEY NOT NULL,
	"title" varchar(150) NOT NULL,
	"description" text NOT NULL,
	"color" varchar(7) NOT NULL,
	"icon" text NOT NULL,
	"mapId" varchar(255) NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "map" (
	"uid" varchar(255) PRIMARY KEY NOT NULL,
	"image" text,
	"title" varchar(150) NOT NULL,
	"description" text NOT NULL,
	"createdBy" varchar(255) NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "marker" (
	"uid" varchar(255) PRIMARY KEY NOT NULL,
	"title" varchar(150) NOT NULL,
	"color" varchar(7) NOT NULL,
	"icon" text NOT NULL,
	"address" text NOT NULL,
	"lat" double precision NOT NULL,
	"lng" double precision NOT NULL,
	"collectionId" varchar(255) NOT NULL,
	"mapId" varchar(255) NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "shared_map" (
	"mapId" varchar(255) NOT NULL,
	"userId" varchar(150) NOT NULL,
	"permissionLLevel" "permissionLLevel" DEFAULT 'viewer' NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "collection" ADD CONSTRAINT "collection_mapId_map_uid_fk" FOREIGN KEY ("mapId") REFERENCES "map"("uid") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "marker" ADD CONSTRAINT "marker_collectionId_collection_uid_fk" FOREIGN KEY ("collectionId") REFERENCES "collection"("uid") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "marker" ADD CONSTRAINT "marker_mapId_map_uid_fk" FOREIGN KEY ("mapId") REFERENCES "map"("uid") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "shared_map" ADD CONSTRAINT "shared_map_mapId_map_uid_fk" FOREIGN KEY ("mapId") REFERENCES "map"("uid") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
