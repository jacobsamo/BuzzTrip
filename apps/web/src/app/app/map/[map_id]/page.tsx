import { MapStoreProvider } from "@/components/providers/map-state-provider";
import { db } from "@/server/db";
import {
  collections,
  locations,
  map_users,
  maps,
  markers,
} from "@/server/db/schema";
import { auth } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import Map from "@/components/layouts/map/map-view";
import { defaultState } from "@/lib/stores/default-state";

export async function generateMetadata({
  params,
}: {
  params: { map_id: string };
}) {
  const map = await db.query.maps.findFirst({
    where: eq(maps.map_id, params.map_id),
  });

  // return constructMetadata({
  //   title: map?.title,
  //   description: map?.description || undefined,
  //   // image: map?.image ?? "",
  //   url: `https://buzztrip.co/app/map/${map?.uid}`,
  // });
  return {
    title: map?.title,
  };
}

export default async function MapPage({
  params,
}: {
  params: { map_id: string };
}) {
  const { userId } = auth();

  if (!userId || !params.map_id) {
    return notFound();
  }

  const [foundCollections, foundMarkers, sharedMap, map] = await Promise.all([
    db.select().from(collections).where(eq(collections.map_id, params.map_id)),
    db
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
      .where(eq(markers.map_id, params.map_id)),
    db.select().from(map_users).where(eq(map_users.map_id, params.map_id)),
    db.select().from(maps).where(eq(maps.map_id, params.map_id)),
  ]);

  if (
    sharedMap &&
    sharedMap.length > 0 &&
    !sharedMap.find((sm) => sm.user_id == userId)
  ) {
    return notFound();
  }

  return (
    <MapStoreProvider
      initState={{
        ...defaultState,
        collections: foundCollections,
        markers: foundMarkers.map((marker) => ({
          ...marker,
          lat: marker.lat as number,
          lng: marker.lng as number,
          bounds: marker.bounds ?? null,
        })),
        map: map[0] ?? null,
        mapUsers: sharedMap,
      }}
    >
      <Map />
    </MapStoreProvider>
  );
}
