import MapView from "@/components/layouts/map_view";
import { GlobalProvider } from "@/components/providers/global_provider";
import { Collection, Marker } from "@/lib/types";
import { json, MetaFunction, redirect, type LoaderFunctionArgs } from "@remix-run/cloudflare";
import { useLoaderData } from "@remix-run/react";
import { createServerClient } from "@supabase/auth-helpers-remix";
import { Database, Tables } from "database.types";

export const meta: MetaFunction = () => {
  return [
    { title: "Maps" },
    {
      name: "description",
      content: "Plan the trip you've always dreamed of",
    },
  ];
};

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
    const response = new Response()
    const supabaseClient = createServerClient<Database>(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_ANON_KEY!,
      { request, response }
    )
    const env = {
      GOOGLE_MAPS_API_KEY: process.env.GOOGLE_MAPS_API_KEY!,
      GOOGLE_MAPS_MAPID: process.env.GOOGLE_MAPS_MAPID!,
    }

    if (!params.mapId) {
      return redirect('/')
    }
  
    const { data: collections } = await supabaseClient.from('collection').select('*').eq('map_id', params.mapId).returns<Collection[]>()
    const { data: markers } = await supabaseClient.from('marker').select('*').eq('map_id', params.mapId).returns<Marker[]>()
    console.log('Collections, markers: ', {
      collections,
      markers
    });
    return json(
      { collections, markers, env },
      {
        headers: response.headers,
      }
    )
  }

export default function Map() {
    const {collections, markers, env} = useLoaderData<typeof loader>();

  return <GlobalProvider>

      <MapView collections={collections} markers={markers} env={env} />
  </GlobalProvider> 
}
