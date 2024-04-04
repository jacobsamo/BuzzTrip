import MapView from "@/components/routes/map_id/layout/map_view";
import { GlobalProvider } from "@/components/routes/map_id/providers/global_provider";
import { constructMetadata } from "@/lib/metadata";
import { createClient } from "@/lib/supabase/server";
import { Collection, Marker } from "@/types";
import React, { Suspense } from "react";

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

  return (
    <GlobalProvider>
      <Suspense fallback={<div>Loading...</div>}>
        <MapView
          collections={collections}
          markers={markers}
          map={map!}
        />
      </Suspense>
    </GlobalProvider>
  );
}
