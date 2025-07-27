import { Map_page } from "@/components/layouts/map-view";
import { MapStoreProvider } from "@/components/providers/map-state-provider";
import { convexNextjsOptions, getConvexServerSession } from "@/lib/auth";
import { api } from "@buzztrip/backend/api";
import { Id } from "@buzztrip/backend/dataModel";
import { fetchQuery, preloadQuery } from "convex/nextjs";
import { Metadata } from "next";
import { notFound } from "next/navigation";

type Params = Promise<{ mapId: string }>;

const getMap = async (mapId: string) => {
  const options = await convexNextjsOptions();
  return fetchQuery(
    api.maps.index.getMap,
    {
      mapId: mapId as Id<"maps">,
    },
    options
  );
};

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { mapId } = await params;
  const map = await getMap(mapId);

  if (!map) return notFound();

  return {
    title: map.title,
    ...(map.description && {
      description: map.description,
    }),
    ...(map.image && {
      image: map.image,
    }),
  };
}

export default async function MapPage({ params }: { params: Params }) {
  const { mapId } = await params;
  const options = await convexNextjsOptions();
  const session = await getConvexServerSession();

  if (!session || session.message !== "Logged In" || !mapId) {
    return notFound();
  }

  // TODO figure out how caches work in nextjs and fetch this from cache
  const [map, fetchedMapUsers] = await Promise.all([
    getMap(mapId),
    fetchQuery(
      api.maps.mapUsers.getMapUsers,
      {
        mapId: mapId as Id<"maps">,
      },
      options
    ),
  ]);

  if (
    (fetchedMapUsers &&
      fetchedMapUsers.length > 0 &&
      !fetchedMapUsers.find((mu) => mu.user_id == session.user._id)) ||
    !map
  ) {
    return notFound();
  }

  // preload on server to avoid any lag on the client
  const [markers, collections, paths, collectionLinks, labels, mapUsers] =
    await Promise.all([
      preloadQuery(
        api.maps.markers.getMarkersView,
        {
          mapId: map._id,
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
        api.maps.paths.getPathsForMap,
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
        paths,
      }}
    >
      <Map_page />
    </MapStoreProvider>
  );
}
