// import Map from "@/components/layouts/map/map-view";
import { Map_page } from "@/components/layouts/map-view";
import { MapStoreProvider } from "@/components/providers/map-state-provider";
import { constructMetadata } from "@/lib/utils/metadata";
import { db } from "@/server/db";
import { getAllMapData } from "@buzztrip/db/queries";
import { maps } from "@buzztrip/db/schema";
import { auth } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";

type Params = Promise<{ map_id: string }>;

export async function generateMetadata({ params }: { params: Params }) {
  const { map_id } = await params;

  const map = await db.query.maps.findFirst({
    where: eq(maps.map_id, map_id),
  });

  return constructMetadata({
    title: map?.title,
    description: map?.description ?? "Plan the trip you've always dreamed of",
  });
}

export default async function MapPage({ params }: { params: Params }) {
  const { map_id } = await params;
  const { userId } = await auth();

  if (!userId || !map_id) {
    return notFound();
  }

  const [foundCollections, collectionLinks, foundMarkers, sharedMap, [map]] =
    await getAllMapData(db, map_id);

  if (
    (sharedMap &&
      sharedMap.length > 0 &&
      !sharedMap.find((sm) => sm.user_id == userId)) ||
    !map
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
        map: map,
        mapUsers: sharedMap,
      }}
    >
      <Map_page />
    </MapStoreProvider>
  );
}
