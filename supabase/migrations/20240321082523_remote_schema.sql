alter type "public"."permission_level" rename to "permission_level__old_version_to_be_dropped";

create type "public"."permission_level" as enum ('viewer', 'editer', 'admin', 'owner');

alter table "public"."shared_map" alter column permission type "public"."permission_level" using permission::text::"public"."permission_level";

drop type "public"."permission_level__old_version_to_be_dropped";


