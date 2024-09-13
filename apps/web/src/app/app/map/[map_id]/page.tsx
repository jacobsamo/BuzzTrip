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
import { getMarkersView } from "@/server/db/quieries";

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
    getMarkersView(params.map_id),
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

  console.log("Data: ", {
    foundCollections,
    foundMarkers,
    sharedMap,
    map: map[0],
  });

  return (
    <MapStoreProvider
      initialState={{
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
