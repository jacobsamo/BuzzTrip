import MapView from "@/components/layouts/map_view";
import { json, type LoaderFunctionArgs } from "@remix-run/cloudflare";
import { useLoaderData } from "@remix-run/react";
import { createServerClient } from "@supabase/auth-helpers-remix";
import { Database, Tables } from "database.types";

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
    const response = new Response()
    const supabaseClient = createServerClient<Database>(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_ANON_KEY!,
      { request, response }
    )
  
    const { data: collections } = await supabaseClient.from('collection').select('*').eq('map_id', params.mapId).returns<Tables<"collection">>()
    const { data: markers } = await supabaseClient.from('marker').select('*').eq('map_id', params.mapId).returns<Tables<"marker">>()
  
    return json(
      { collections, markers },
      {
        headers: response.headers,
      }
    )
  }

export default function Map() {
    const {collections, markers} = useLoaderData<typeof loader>();

  return <MapView collections={collections} markers={markers} />
}
