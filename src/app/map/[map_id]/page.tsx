import MapView from "@/components/routes/map_id/layout/map_view";
import { GlobalProvider } from "@/components/routes/map_id/providers/global_provider";
import { getUser } from "@/lib/getUser";
import { constructMetadata } from "@/lib/metadata";
import { createClient } from "@/lib/supabase/server";
import { Collection, Marker } from "@/types";
import { notFound, redirect } from "next/navigation";

export const runtime = "edge";

export async function generateMetadata({
  params,
}: {
  params: { map_id: string };
}) {
  const supabase = await createClient();
  const { data: map } = await supabase
    .from("map")
    .select()
    .eq("uid", params.map_id)
    .single();

  return constructMetadata({
    title: map?.title,
    description: map?.description || undefined,
    // image: map?.image ?? "",
    url: `https://buzztrip.co/map/${map?.uid}`,
  });
}

export default async function MapPage({
  params,
}: {
  params: { map_id: string };
}) {
  const supabase = createClient();
  const user = await getUser();

  const { data: collections } = await supabase
    .from("collection")
    .select("*")
    .eq("map_id", params.map_id)
    .returns<Collection[]>();

  const { data: markers } = await supabase
    .from("marker")
    .select("*")
    .eq("map_id", params.map_id)
    .returns<Marker[]>();

  const { data: map } = await supabase
    .from("map")
    .select()
    .eq("uid", params.map_id)
    .single();

  const { data: sharedMap } = await supabase
    .from("shared_map")
    .select()
    .eq("map_id", params.map_id);

  if (!user) {
    return redirect("/auth");
  }

  if (
    sharedMap &&
    sharedMap.length > 0 &&
    !sharedMap.find((sm) => sm.user_id == user.id)
  ) {
    return notFound();
  }

  return (
    <GlobalProvider>
      {/* <Suspense fallback={<MapViewSkeleton />}>
      </Suspense> */}

      <MapView collections={collections} markers={markers} map={map!} />
    </GlobalProvider>
  );
}
