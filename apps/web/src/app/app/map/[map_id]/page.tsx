import { MapStoreProvider } from "@/components/providers/map-state-provider";
import { db } from "@/server/db";
import { collections, map_users, maps, markers } from "@/server/db/schema";
import { auth } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";

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

  if (!userId) {
    return notFound();
  }

  const [foundCollections, foundMarkers, sharedMap, map] = await Promise.all([
    db.select().from(collections).where(eq(collections.map_id, params.map_id!)),
    db.select().from(markers).where(eq(markers.map_id, params.map_id!)),
    db.select().from(map_users).where(eq(map_users.map_id, params.map_id!)),
    db.query.maps.findFirst({
      where: eq(maps.map_id, params.map_id),
    }),
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
        collections: foundCollections,
        markers: foundMarkers,
        map: map ?? null,
        mapUsers: sharedMap,
        route: null,
        routeStops: null,
        activeLocation: null,
        collectionsOpen: false,
        collectionMarkers: null,
      }}
    >
      <div>
        <h1>{map?.title}</h1>
      </div>
    </MapStoreProvider>
  );
}
