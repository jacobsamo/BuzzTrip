// import Map from "@/components/layouts/map/map-view";
import { Map_page } from "@/components/layouts/map-view";
import MapView from "@/components/mapping/mapbox/map";
import { MapStoreProvider } from "@/components/providers/map-state-provider";
import { db } from "@/server/db";
import { getAllMapData, getMarkersView } from "@buzztrip/db/queries";
import {
  collection_links,
  collections,
  map_users,
  maps,
} from "@buzztrip/db/schema";
import { auth } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import { type Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: { map_id: string };
}) {
  const map = await db.query.maps.findFirst({
    where: eq(maps.map_id, params.map_id),
  });

  return {
    title: map?.title,
    description: map?.description,
  } as Metadata;
}

export default async function MapPage({
  params,
}: {
  params: { map_id: string };
}) {
  const { userId } = await auth();

  if (!userId || !params.map_id) {
    return notFound();
  }

  const [foundCollections, collectionLinks, foundMarkers, sharedMap, map] =
    await getAllMapData(db, params.map_id);

  if (
    sharedMap &&
    sharedMap.length > 0 &&
    !sharedMap.find((sm) => sm.user_id == userId)
  ) {
    return notFound();
  }

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
        collectionLinks: collectionLinks,
        map: map[0] ?? null,
        mapUsers: sharedMap,
      }}
    >
      <Map_page />
    </MapStoreProvider>
  );
}
