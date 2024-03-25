alter table "public"."map"
alter table "public"."collection"
    alter column description drop not null,
    alter column icon drop not null,
    alter column color drop not null
-- nullable fields: description, icon, color, 


alter table "public"."marker"
    alter column description drop not null
    alter column map_id not null
    create column address text,
    create column place_id text
    create column icon text
    create column color text

-- nullable description
-- add felids: icon, color, address, placeId, (could store all things from google maps or not)