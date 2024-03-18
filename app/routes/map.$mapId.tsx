import { json, type LoaderFunctionArgs } from "@remix-run/cloudflare";
import { useLoaderData } from "@remix-run/react";
import { createServerClient } from "@supabase/auth-helpers-remix";
import { Database } from "database.types";

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
    const response = new Response()
    const supabaseClient = createServerClient<Database>(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_ANON_KEY!,
      { request, response }
    )
  
    const { data: collections } = await supabaseClient.from('collections').select('*').eq('mapId', params.mapId).returns<Database["public"]["Tables"]["collection"]>()
    const { data: markers } = await supabaseClient.from('markers').select('*').eq('mapId', params.mapId)
  
    return json(
      { collections, markers },
      {
        headers: response.headers,
      }
    )
  }

export default function Map() {
    const {collections, markers} = useLoaderData<typeof loader>();

  return (
    <>
    
    </>
  );
}
