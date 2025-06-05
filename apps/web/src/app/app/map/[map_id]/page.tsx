import { Map_page } from "@/components/layouts/map-view";
import { MapStoreProvider } from "@/components/providers/map-state-provider";
import { constructMetadata } from "@/lib/utils/metadata";
import { getSession } from "@/server/getSession";
import { api } from "@buzztrip/backend/api";
import { Id } from "@buzztrip/backend/dataModel";
import { type NextjsOptions, fetchQuery } from "convex/nextjs";
import { env } from "env";
import { notFound } from "next/navigation";

const options: NextjsOptions = {
  url: env.NEXT_PUBLIC_CONVEX_URL,
};

type Params = Promise<{ map_id: string }>;

export async function generateMetadata({ params }: { params: Params }) {
  const { map_id } = await params;

  const map = await fetchQuery(
    api.maps.index.getMap,
    {
      mapId: map_id as Id<"maps">,
    },
    options
  );

  // console.log("generateMetadata", {
  //   map_id,
  //   map,
  // });

  return constructMetadata({
    title: map?.title,
    description: map?.description ?? "Plan the trip you've always dreamed of",
  });
}

export default async function MapPage({ params }: { params: Params }) {
  const { map_id } = await params;
  const { data } = await getSession();
  console.log("page", {
    map_id,
  });

  if (!data || !data.session || !map_id) {
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
      !mapUsers.find((mu) => mu.user_id == data.session.userId)) ||
    !map
  ) {
    return notFound();
  }

  return (
    <MapStoreProvider
      initialState={{
        map: map,
      }}
    >
      <Map_page />
    </MapStoreProvider>
  );
}
