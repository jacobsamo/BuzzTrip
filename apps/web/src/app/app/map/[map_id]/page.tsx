import { Map_page } from "@/components/layouts/map-view";
import { MapStoreProvider } from "@/components/providers/map-state-provider";
import { convexNextjsOptions, getConvexServerSession } from "@/lib/auth";
import { constructMetadata } from "@/lib/utils/metadata";
import { api } from "@buzztrip/backend/api";
import { Id } from "@buzztrip/backend/dataModel";
import { fetchQuery, preloadQuery } from "convex/nextjs";
import { notFound } from "next/navigation";

type Params = Promise<{ map_id: string }>;

export async function generateMetadata({ params }: { params: Params }) {
  const { map_id } = await params;
  const options = await convexNextjsOptions();
  const map = await fetchQuery(
    api.maps.index.getMap,
    {
      mapId: map_id as Id<"maps">,
    },
    options
  );

  if (!map) return notFound();

  return constructMetadata({
    title: map.title,
    description: map.description ?? "Plan the trip you've always dreamed of",
  });
}

export default async function MapPage({ params }: { params: Params }) {
  const { map_id } = await params;
  const options = await convexNextjsOptions();
  const session = await getConvexServerSession();

  if (!session || session.message !== "Logged In" || !map_id) {
    return notFound();
  }

  const map = await fetchQuery(
    api.maps.index.getMap,
    {
      mapId: map_id as Id<"maps">,
    },
    options
  );
  const fetchedMapUsers = await fetchQuery(
    api.maps.mapUsers.getMapUsers,
    {
      mapId: map_id as Id<"maps">,
    },
    options
  );

  if (
    (fetchedMapUsers &&
      fetchedMapUsers.length > 0 &&
      !fetchedMapUsers.find((mu) => mu.user_id == session.user._id)) ||
    !map
  ) {
    return notFound();
  }

  // preload on server to avoid any lag on the client
  const [markers, collections, collectionLinks, labels, mapUsers] =
    await Promise.all([
      preloadQuery(
        api.maps.markers.getMarkersView,
        {
          map_id: map._id,
        },
        options
      ),
      preloadQuery(
        api.maps.collections.getCollectionsForMap,
        {
          mapId: map._id,
        },
        options
      ),
      preloadQuery(
        api.maps.collections.getCollectionLinksForMap,
        {
          mapId: map._id,
        },
        options
      ),
      preloadQuery(
        api.maps.labels.getMapLabels,
        {
          mapId: map._id,
        },
        options
      ),
      preloadQuery(
        api.maps.mapUsers.getMapUsers,
        {
          mapId: map._id,
        },
        options
      ),
    ]);

  return (
    <MapStoreProvider
      initialState={{
        map: {
          ...map,
          visibility: map.visibility || "private",
        },
      }}
      preloadedQueries={{
        markers,
        collections,
        collectionLinks,
        labels,
        mapUsers,
      }}
    >
      <Map_page />
    </MapStoreProvider>
  );
}
