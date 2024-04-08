import MapCard from "@/components/routes/home/map_card";
import MapModal from "@/components/routes/home/modals/create_edit_map_modal";
import { constructMetadata } from "@/lib/metadata";
import { createClient } from "@/lib/supabase/server";
import { SharedMap } from "@/types";

export const runtime = 'edge'

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

export default async function MapPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  console.log("user: ", user)
  // if (!user) {
  //   return redirect("/auth");
  // }

  const { data: maps } = await supabase
    .from("shared_map_view")
    .select()
    .eq("user_id", user!.id);

  return (
    <main className="p-2">
      <span className="mx-auto flex w-full flex-row items-center justify-between">
        <h2 className="text-2xl font-bold">Your Maps</h2>
        <MapModal />
      </span>

      {maps && (
        <div className="flex flex-wrap gap-2">
          {maps.map((map) => (
            <MapCard key={map.uid} map={map as SharedMap} />
          ))}
        </div>
      )}

      {!maps && (
        <>
          <h2>Current you have no maps</h2>
          <MapModal />
        </>
      )}
    </main>
  );
}
