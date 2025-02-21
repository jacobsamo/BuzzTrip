import { eq, getTableColumns, like, or } from "drizzle-orm";
import { Database } from "..";
import {
  collection_links,
  collections,
  map_users,
  maps,
  markers,
  places,
  users,
} from "../schemas";
import { CombinedMarker, UserMap } from "../types";

// map data items
export const getMarkersView = async (
  db: Database,
  map_id: string,
  markerId?: string
) => {
  let getMarkers = db
    .select({
      ...getTableColumns(markers),
      ...getTableColumns(places),
      lat: places.lat,
      lng: places.lng,
      place_id: places.place_id,
    })
    .from(markers)
    .leftJoin(places, eq(places.place_id, markers.place_id))
    .where(eq(markers.map_id, map_id))
    .$dynamic(); // makes this a dynamic query

  if (markerId) {
    getMarkers = getMarkers.where(eq(markers.marker_id, markerId));
  }

  return getMarkers as Promise<CombinedMarker[]>;
};

export const getCollectionsForMap = async (db: Database, map_id: string) => {
  return db.select().from(collections).where(eq(collections.map_id, map_id));
};

export const getCollectionLinksForMap = async (
  db: Database,
  map_id: string
) => {
  return db
    .select()
    .from(collection_links)
    .where(eq(collection_links.map_id, map_id));
};

export const getMapUsers = async (db: Database, map_id: string) => {
  return db.select().from(map_users).where(eq(map_users.map_id, map_id));
};

export const getMap = async (db: Database, map_id: string) => {
  return db.select().from(maps).where(eq(maps.map_id, map_id));
};

export const getAllMapData = async (db: Database, map_id: string) => {
  return Promise.all([
    getCollectionsForMap(db, map_id),
    getCollectionLinksForMap(db, map_id),
    getMarkersView(db, map_id),
    getMapUsers(db, map_id),
    getMap(db, map_id),
  ]);
};

export const getUserMaps = async (db: Database, userId: string) => {
  return db
    .select({
      ...getTableColumns(maps),
      ...getTableColumns(map_users),
      map_id: maps.map_id,
    })
    .from(map_users)
    .leftJoin(maps, eq(map_users.map_id, maps.map_id))
    .where(eq(maps.owner_id, userId!)) as Promise<UserMap[]>;
};

export const searchUsers = async (db: Database, query: string) => {
  return db
    .select()
    .from(users)
    .where(
      or(
        like(users.username, `%${query}%`),
        like(users.email, `%${query}%`),
        like(users.first_name, `%${query}%`),
        like(users.last_name, `%${query}%`)
      )
    );
};
