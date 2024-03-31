import MapView from "@/routes/map.$mapId/layout/map_view";
import { GlobalProvider } from "@/routes/map.$mapId/providers/global_provider";
import { Collection, Marker } from "@/lib/types";
import { json, MetaFunction, redirect, type LoaderFunctionArgs } from "@remix-run/cloudflare";
import { useLoaderData } from "@remix-run/react";
import { createServerClient } from "@supabase/auth-helpers-remix";
import { Database, Json, Tables } from "database.types";
import { INTENTS } from "./intents";
import { badRequest } from "@/lib/bad-request";
import { z } from "zod";
import { getUser } from "@/lib/getUser";
import { markerSchema, collectionSchema } from "@/lib/schemas";
import { createCollection } from "@/lib/crud/collections";
import { createMarker } from "@/lib/crud/markers";
import { convertFormDataToObject } from "@/lib/utils";

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
      return redirect('/home')
    }
  
    const { data: collections } = await supabaseClient.from('collection').select('*').eq('map_id', params.mapId).returns<Collection[]>()
    const { data: markers } = await supabaseClient.from('marker').select('*').eq('map_id', params.mapId).returns<Marker[]>()
    const {data: map} = await supabaseClient.from("map").select().eq("uid", params.mapId).single();

    return json(
      { collections, markers, env, map },
      {
        headers: response.headers,
      }
    )
  }

export const action = async ({ request, params }: LoaderFunctionArgs) => {
  try {
    const formData = await request.formData();
    const values = Object.fromEntries(formData.entries());
    
    const intent = values!.intent;
    
    const user = await getUser(request);
    
    if (!intent) throw badRequest("Missing intent");
    
    if (!user) throw badRequest("Unauthorized");
    formData.delete("intent");
    
    switch (intent) {
      case INTENTS.createCollection: {
        const collection = collectionSchema.parse(values);
        await createCollection(collection, request);
        break;
      }  
      case INTENTS.createMarker: { 
        const parsed = convertFormDataToObject(formData);

        const data = {...parsed, created_by: user.id};

        const marker = markerSchema.parse(data);
        
        await createMarker(marker, request);
        break;
      }    
      default: {
        throw badRequest(`Unknown intent: ${intent}`);
      }    
    } 
    
    return json({ ok: true });
  } catch (error) {
    console.error("Error on /map/$map_id", error);
  
    if (error instanceof z.ZodError) {
      throw new Error(error.issues.map((issue) => issue.message).join("\n"));
    }
  
    throw new Error(`Unexpected issue occurred. Please try again. error: ${error}`);
  }
}


export default function Map() {
    const {collections, markers, env, map} = useLoaderData<typeof loader>();

  return (
        <GlobalProvider>
            <MapView collections={collections} markers={markers} env={env} map={map!}/>
        </GlobalProvider> 
    );
}
