
alter table collection
alter column description drop not null,
alter column icon drop not null,
alter column color drop not null;


alter table marker
alter column description drop not null,
alter column map_id drop not null;

alter table marker
add column address text,
add column place_id text,
add column icon text,
add column color varchar(7),
add column photos json,
add column reviews json,
add column rating double precision,
add column avg_price SMALLINT,
add column types text[],
add column website text,
add column phone text,
add column opening_times text[];

