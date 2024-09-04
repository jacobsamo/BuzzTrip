import {
    integer,
    real,
    sqliteTable,
    text
} from "drizzle-orm/sqlite-core";


export const users = sqliteTable('users', {
    user_id: text('user_id').primaryKey().notNull(), 
    first_name: text('first_name').notNull(),
    last_name: text('last_name').notNull(),
    email: text('email').notNull().unique()
});

export const maps = sqliteTable('maps', {
    map_id: text('map_id').primaryKey().notNull(), 
    name: text('name').notNull(),
    description: text('description'),
    owner_id: text('owner_id').notNull().references(() => users.user_id)
})

export const markers = sqliteTable('markers', {
    marker_id: text('marker_id').primaryKey().notNull(), 
    name: text('name').notNull(),
    lat: real('lat').notNull(),
    lng: real('lng').notNull(),
    map_id: text('map_id').references(() => maps.map_id)
})

export const collections = sqliteTable('collections', {
    collection: text('collection').primaryKey().notNull(), 
    name: text('name').notNull(),
    description: text('description'),
    map_id: text('map_id').references(() => maps.map_id)
});

export const collection_markers = sqliteTable('collection_markers', {
    collection_id: text('collection_id').references(() => collections.collection),
    marker_id: text('marker_id').references(() => markers.marker_id),
    map_id: text('map_id').references(() => maps.map_id)
});

export const map_users = sqliteTable('map_users', {
    map_id: text('map_id').references(() => maps.map_id),
    user_id: text('user_id').references(() => users.user_id),
    permission: text('permission', {enum: ['owner', 'editor', 'viewer', 'commentor']}).default('editor').notNull(),
});

export const route = sqliteTable('route', {

    route_id: text('route_id').primaryKey().notNull(), 
    name: text('name').notNull(),
    description: text('description'),
    user_id: text('user_id').references(() => users.user_id)
});

export const route_stops = sqliteTable('route_stops', {
    route_stop_id: text('route_stop_id').primaryKey().notNull(),
    route_id: text('route_id').references(() => route.route_id),
    marker_id: text('marker_id').references(() => markers.marker_id),
    stop_order: integer('stop_order').notNull()
});
