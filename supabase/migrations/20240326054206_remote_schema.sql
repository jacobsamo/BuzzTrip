create or replace view "public"."shared_map_view" as  SELECT sp.map_id,
    sp.user_id,
    sp.permission,
    map.uid,
    map.image,
    map.title,
    map.description,
    map.created_by,
    map.created_at
   FROM (shared_map sp
     LEFT JOIN map ON ((sp.map_id = map.uid)));



