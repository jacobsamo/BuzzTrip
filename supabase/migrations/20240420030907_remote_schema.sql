
SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

CREATE EXTENSION IF NOT EXISTS "pgsodium" WITH SCHEMA "pgsodium";

CREATE SCHEMA IF NOT EXISTS "public";

ALTER SCHEMA "public" OWNER TO "pg_database_owner";

COMMENT ON SCHEMA "public" IS 'standard public schema';

CREATE EXTENSION IF NOT EXISTS "pg_graphql" WITH SCHEMA "graphql";

CREATE EXTENSION IF NOT EXISTS "pg_stat_statements" WITH SCHEMA "extensions";

CREATE EXTENSION IF NOT EXISTS "pgcrypto" WITH SCHEMA "extensions";

CREATE EXTENSION IF NOT EXISTS "pgjwt" WITH SCHEMA "extensions";

CREATE EXTENSION IF NOT EXISTS "supabase_vault" WITH SCHEMA "vault";

CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA "extensions";

CREATE TYPE "public"."feedback_type" AS ENUM (
    'feature',
    'bug',
    'other'
);

ALTER TYPE "public"."feedback_type" OWNER TO "postgres";

CREATE TYPE "public"."permission_level" AS ENUM (
    'viewer',
    'editor',
    'admin',
    'owner'
);

ALTER TYPE "public"."permission_level" OWNER TO "postgres";

SET default_tablespace = '';

SET default_table_access_method = "heap";

CREATE TABLE IF NOT EXISTS "public"."collection" (
    "uid" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "title" character varying(150) NOT NULL,
    "description" "text",
    "color" character varying(7),
    "icon" "text",
    "map_id" "uuid" NOT NULL
);

ALTER TABLE "public"."collection" OWNER TO "postgres";

CREATE TABLE IF NOT EXISTS "public"."feedback" (
    "uid" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "type" "public"."feedback_type" DEFAULT 'other'::"public"."feedback_type" NOT NULL,
    "title" "text" NOT NULL,
    "description" "text" NOT NULL,
    "page" "text",
    "user_email" "text" NOT NULL,
    "user_id" "uuid",
    "created_at" timestamp with time zone DEFAULT ("now"() AT TIME ZONE 'utc'::"text") NOT NULL
);

ALTER TABLE "public"."feedback" OWNER TO "postgres";

CREATE TABLE IF NOT EXISTS "public"."locations" (
    "uid" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "title" character varying(150) NOT NULL,
    "description" "text",
    "lat" double precision NOT NULL,
    "lng" double precision NOT NULL,
    "bounds" "json",
    "address" "text",
    "gm_place_id" "text",
    "icon" "text",
    "photos" "json",
    "reviews" "json",
    "rating" double precision,
    "avg_price" smallint,
    "types" "text"[],
    "website" "text",
    "phone" "text",
    "opening_times" "text"[],
    "created_at" timestamp with time zone DEFAULT "timezone"('utc'::"text", "now"()) NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "timezone"('utc'::"text", "now"()) NOT NULL
);

ALTER TABLE "public"."locations" OWNER TO "postgres";

CREATE TABLE IF NOT EXISTS "public"."map" (
    "uid" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "image" "text",
    "title" character varying(150) NOT NULL,
    "description" "text",
    "created_by" "uuid" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "timezone"('utc'::"text", "now"()) NOT NULL
);

ALTER TABLE "public"."map" OWNER TO "postgres";

CREATE TABLE IF NOT EXISTS "public"."marker" (
    "uid" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "title" character varying(150),
    "note" "text",
    "lat" double precision,
    "lng" double precision,
    "collection_id" "uuid" NOT NULL,
    "created_by" "uuid" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "timezone"('utc'::"text", "now"()) NOT NULL,
    "map_id" "uuid" NOT NULL,
    "icon" "text",
    "color" character varying(7),
    "location_id" "uuid"
);

ALTER TABLE "public"."marker" OWNER TO "postgres";

CREATE OR REPLACE VIEW "public"."markers_view" AS
 SELECT "m"."uid",
    "l"."title",
    "m"."note",
    "l"."description",
    "m"."icon",
    "m"."color",
    "m"."collection_id",
    "m"."created_by",
    "m"."created_at",
    "m"."map_id",
    "m"."location_id",
    "l"."lat",
    "l"."lng",
    "l"."bounds",
    "l"."address",
    "l"."gm_place_id",
    "l"."photos",
    "l"."reviews",
    "l"."rating",
    "l"."avg_price",
    "l"."types",
    "l"."website",
    "l"."phone",
    "l"."opening_times"
   FROM ("public"."marker" "m"
     LEFT JOIN "public"."locations" "l" ON (("m"."location_id" = "l"."uid")));

ALTER TABLE "public"."markers_view" OWNER TO "postgres";

CREATE TABLE IF NOT EXISTS "public"."shared_map" (
    "map_id" "uuid" NOT NULL,
    "user_id" "uuid" NOT NULL,
    "permission" "public"."permission_level" NOT NULL,
    "uid" "uuid" DEFAULT "gen_random_uuid"() NOT NULL
);

ALTER TABLE "public"."shared_map" OWNER TO "postgres";

CREATE OR REPLACE VIEW "public"."shared_map_view" AS
 SELECT "sp"."map_id",
    "sp"."user_id",
    "sp"."permission",
    "map"."uid",
    "map"."image",
    "map"."title",
    "map"."description",
    "map"."created_by",
    "map"."created_at"
   FROM ("public"."shared_map" "sp"
     LEFT JOIN "public"."map" ON (("sp"."map_id" = "map"."uid")));

ALTER TABLE "public"."shared_map_view" OWNER TO "postgres";

ALTER TABLE ONLY "public"."collection"
    ADD CONSTRAINT "collection_pkey" PRIMARY KEY ("uid");

ALTER TABLE ONLY "public"."feedback"
    ADD CONSTRAINT "feedback_pkey" PRIMARY KEY ("uid");

ALTER TABLE ONLY "public"."locations"
    ADD CONSTRAINT "locations_pkey" PRIMARY KEY ("uid");

ALTER TABLE ONLY "public"."map"
    ADD CONSTRAINT "map_pkey" PRIMARY KEY ("uid");

ALTER TABLE ONLY "public"."marker"
    ADD CONSTRAINT "marker_pkey" PRIMARY KEY ("uid");

ALTER TABLE ONLY "public"."shared_map"
    ADD CONSTRAINT "shared_map_pkey" PRIMARY KEY ("uid");

ALTER TABLE ONLY "public"."collection"
    ADD CONSTRAINT "collection_map_id_fkey" FOREIGN KEY ("map_id") REFERENCES "public"."map"("uid") ON DELETE CASCADE;

ALTER TABLE ONLY "public"."feedback"
    ADD CONSTRAINT "feedback_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id");

ALTER TABLE ONLY "public"."map"
    ADD CONSTRAINT "map_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "auth"."users"("id");

ALTER TABLE ONLY "public"."marker"
    ADD CONSTRAINT "marker_collection_id_fkey" FOREIGN KEY ("collection_id") REFERENCES "public"."collection"("uid") ON DELETE CASCADE;

ALTER TABLE ONLY "public"."marker"
    ADD CONSTRAINT "marker_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "auth"."users"("id");

ALTER TABLE ONLY "public"."marker"
    ADD CONSTRAINT "marker_location_id_fkey" FOREIGN KEY ("location_id") REFERENCES "public"."locations"("uid");

ALTER TABLE ONLY "public"."marker"
    ADD CONSTRAINT "marker_map_id_fkey" FOREIGN KEY ("map_id") REFERENCES "public"."map"("uid") ON DELETE CASCADE;

ALTER TABLE ONLY "public"."shared_map"
    ADD CONSTRAINT "shared_map_map_id_fkey" FOREIGN KEY ("map_id") REFERENCES "public"."map"("uid") ON DELETE CASCADE;

ALTER TABLE ONLY "public"."shared_map"
    ADD CONSTRAINT "shared_map_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id");

GRANT USAGE ON SCHEMA "public" TO "postgres";
GRANT USAGE ON SCHEMA "public" TO "anon";
GRANT USAGE ON SCHEMA "public" TO "authenticated";
GRANT USAGE ON SCHEMA "public" TO "service_role";

GRANT ALL ON TABLE "public"."collection" TO "anon";
GRANT ALL ON TABLE "public"."collection" TO "authenticated";
GRANT ALL ON TABLE "public"."collection" TO "service_role";

GRANT ALL ON TABLE "public"."feedback" TO "anon";
GRANT ALL ON TABLE "public"."feedback" TO "authenticated";
GRANT ALL ON TABLE "public"."feedback" TO "service_role";

GRANT ALL ON TABLE "public"."locations" TO "anon";
GRANT ALL ON TABLE "public"."locations" TO "authenticated";
GRANT ALL ON TABLE "public"."locations" TO "service_role";

GRANT ALL ON TABLE "public"."map" TO "anon";
GRANT ALL ON TABLE "public"."map" TO "authenticated";
GRANT ALL ON TABLE "public"."map" TO "service_role";

GRANT ALL ON TABLE "public"."marker" TO "anon";
GRANT ALL ON TABLE "public"."marker" TO "authenticated";
GRANT ALL ON TABLE "public"."marker" TO "service_role";

GRANT ALL ON TABLE "public"."markers_view" TO "anon";
GRANT ALL ON TABLE "public"."markers_view" TO "authenticated";
GRANT ALL ON TABLE "public"."markers_view" TO "service_role";

GRANT ALL ON TABLE "public"."shared_map" TO "anon";
GRANT ALL ON TABLE "public"."shared_map" TO "authenticated";
GRANT ALL ON TABLE "public"."shared_map" TO "service_role";

GRANT ALL ON TABLE "public"."shared_map_view" TO "anon";
GRANT ALL ON TABLE "public"."shared_map_view" TO "authenticated";
GRANT ALL ON TABLE "public"."shared_map_view" TO "service_role";

ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "service_role";

ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "service_role";

ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "service_role";

RESET ALL;
