CREATE TABLE IF NOT EXISTS "map" (
    uid uuid primary key default gen_random_uuid(),
    image text,
    title varchar(150) not null,
    description text,
    created_by uuid not null references auth.users(id),
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

CREATE TABLE IF NOT EXISTS "collection" (
    uid uuid primary key default gen_random_uuid(),
    title varchar(150) not null,
    description text not null,
    color varchar(7) not null,
    icon text not null,
    map_id uuid not null references public.map(uid) on delete cascade
);


CREATE TABLE IF NOT EXISTS "marker" (
    uid uuid primary key default gen_random_uuid(),
    title varchar(150) not null,
    description text not null,
    lat double precision not null,
    lng double precision not null,
    collection_id uuid not null references public.collection(uid) on delete cascade,
    created_by uuid not null references auth.users(id),
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);


create type permission_level as enum ('viewer', 'editor', 'admin');

CREATE TABLE IF NOT EXISTS "shared_map" (
    map_id uuid not null references public.map(uid) on delete cascade,
    user_id uuid not null references auth.users,
    permission permission_level not null
);