import { markers, locations, maps, map_users } from "../schema";
import { eq } from "drizzle-orm";
import { CombinedMarker, UserMap } from "../types";
import { getTableColumns } from "drizzle-orm";
import { Database } from "..";

export const getMarkersView = async (db: Database, map_id: string) => {
  return db
    .select({
      marker_id: markers.marker_id,
      collection_id: markers.collection_id,
      title: markers.title,
      note: markers.note,
      created_by: markers.created_by,
      created_at: markers.created_at,
      icon: markers.icon,
      color: markers.color,
      location_id: locations.location_id,
      map_id: markers.map_id,
      description: locations.description,
      lat: locations.lat,
      lng: locations.lng,
      bounds: locations.bounds,
      address: locations.address,
      gm_place_id: locations.gm_place_id,
      photos: locations.photos,
      reviews: locations.reviews,
      rating: locations.rating,
      avg_price: locations.avg_price,
      types: locations.types,
      website: locations.website,
      phone: locations.phone,
      opening_times: locations.opening_times,
      updated_at: locations.updated_at,
    })
    .from(markers)
    .leftJoin(locations, eq(locations.location_id, markers.location_id))
    .where(eq(markers.map_id, map_id)) as Promise<CombinedMarker[]>;
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
