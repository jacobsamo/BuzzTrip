import { Map_page } from "@/components/layouts/map-view";
import { MapStoreProvider } from "@/components/providers/map-state-provider";
import { constructMetadata } from "@/lib/utils/metadata";
import { api } from "@buzztrip/backend/api";
import { Id } from "@buzztrip/backend/dataModel";
import { type NextjsOptions, fetchQuery } from "convex/nextjs";
import { env } from "env";
import { notFound } from "next/navigation";
import { convexNextjsOptions, getConvexServerSession } from "@/lib/auth";


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

  return constructMetadata({
    title: map?.title,
    description: map?.description ?? "Plan the trip you've always dreamed of",
  });
}

export default async function MapPage({ params }: { params: Params }) {
  const { map_id } = await params;
  const options = await convexNextjsOptions();
  const session = await getConvexServerSession()

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
  const mapUsers = await fetchQuery(
    api.maps.mapUsers.getMapUsers,
    {
      mapId: map_id as Id<"maps">,
    },
    options
  );

  if (
    (mapUsers &&
      mapUsers.length > 0 &&
      !mapUsers.find((mu) => mu.user_id == session.user._id)) ||
    !map
  ) {
    return notFound();
  }

  return (
    <MapStoreProvider
      initialState={{
        map: {
          ...map,
          visibility: map.visibility || "private",
        },
      }}
    >
      <Map_page />
    </MapStoreProvider>
  );
}
