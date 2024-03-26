import MapCard from "@/components/map_card";
import MapModal from "@/components/modals/create_edit_map_modal";
import { SharedMap } from "@/lib/types";
import getSupabaseServerClient from "@/server/supabaseServer";
import {
  json,
  redirect,
  type LoaderFunctionArgs,
  type MetaFunction,
} from "@remix-run/cloudflare";
import { useLoaderData } from "@remix-run/react";

export const meta: MetaFunction = () => {
  return [
    { title: "BuzzTrip" },
    {
      name: "description",
      content: "Plan the trip you've always dreamed of",
    },
  ];
};

export const loader = async ({ request }: LoaderFunctionArgs) => {
  try {
    const client = getSupabaseServerClient(request);

    const {
      data: { user },
    } = await client.auth.getUser();

    console.log('uSER: ', user?.email);

    if (!user) {
      return redirect("/auth");
    }

    const maps = await client.from("shared_map_view").select().eq("user_id", user?.id);

    return json({maps: maps.data as SharedMap[] | null});
  } catch (e) {
    return json({maps: null});
  }
};

export default function Index() {
  const { maps } = useLoaderData<typeof loader>();


  return(
    
    <main className="p-2">
    <span className="mx-auto flex w-full flex-row items-center justify-between">
      <h2 className="text-2xl font-bold">Your Maps</h2>
      <MapModal />
    </span>

    {maps && (
      <div className="flex flex-wrap gap-2">
        {maps.map((map) => (
          <MapCard key={map.uid} map={map} />
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
