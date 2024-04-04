import { badRequest } from "@/lib/bad-request";
import {
  createCollection,
  editCollection,
  deleteCollection,
} from "@/lib/crud/collections";
import { createMarker, editMarker, deleteMarker } from "@/lib/crud/markers";
import { getUser } from "@/lib/getUser";
import {
  collectionSchema,
  markerEditSchema,
  markerSchema,
} from "@/lib/schemas";
import { convertFormDataToObject } from "@/lib/utils";
import { GlobalProvider } from "@/routes/map.$mapId/providers/global_provider";
import {
  json,
  MetaFunction,
  redirect,
  type LoaderFunctionArgs,
} from "@remix-run/cloudflare";
import { useLoaderData } from "@remix-run/react";
import { createServerClient } from "@supabase/auth-helpers-remix";
import { Database } from "database.types";
import { lazy, Suspense } from "react";
import { z } from "zod";
import { INTENTS } from "./intents";
import { Collection, Marker } from "@/lib/types";

const MapView = lazy(() => import("./layout/map_view"));

export const meta: MetaFunction = () => {
  return [
    { title: "Maps" },
    {
      name: "description",
      content: "Plan the trip you've always dreamed of",
    },
  ];
};

export const loader = async ({
  request,
  params,
  context,
}: LoaderFunctionArgs) => {
  const env: any = context.cloudflare.env;

  const response = new Response();
  const supabaseClient = createServerClient<Database>(
    env.SUPABASE_URL!,
    env.SUPABASE_ANON_KEY!,
    { request, response }
  );
  const mapEnvs = {
    GOOGLE_MAPS_API_KEY: env.GOOGLE_MAPS_API_KEY! as string,
    GOOGLE_MAPS_MAPID: env.GOOGLE_MAPS_MAPID! as string,
  };

  if (!params.mapId) {
    return redirect("/home");
  }

  const { data: collections } = await supabaseClient
    .from("collection")
    .select("*")
    .eq("map_id", params.mapId)
    .returns<Collection[]>();
  const { data: markers } = await supabaseClient
    .from("marker")
    .select("*")
    .eq("map_id", params.mapId)
    .returns<Marker[]>();
  const { data: map } = await supabaseClient
    .from("map")
    .select()
    .eq("uid", params.mapId)
    .single();

  return json(
    { collections, markers, mapEnvs, map },
    {
      headers: response.headers,
    }
  );
};

export const action = async ({ request, context }: LoaderFunctionArgs) => {
  try {
    const formData = await request.formData();
    const values = Object.fromEntries(formData.entries());

    const intent = values!.intent;

    const user = await getUser(request, context);

    if (!intent) throw badRequest("Missing intent");

    if (!user) throw badRequest("Unauthorized");
    formData.delete("intent");

    switch (intent) {
      case INTENTS.createCollection: {
        const collection = collectionSchema.parse(values);
        await createCollection(collection, request, context);
        break;
      }
      case INTENTS.updateCollection: {
        const collection = collectionSchema
          .extend({
            uid: z.string(),
            map_id: z.string(),
          })
          .parse(values);

        await editCollection(collection.uid, collection, request, context);
        break;
      }
      case INTENTS.deleteCollection: {
        const { uid } = values;
        if (!uid) throw badRequest("Missing uid");

        await deleteCollection(uid.toString(), request, context);

        break;
      }

      case INTENTS.createMarker: {
        const parsed = convertFormDataToObject(formData);

        const data = { ...parsed, created_by: user.id };

        const marker = markerSchema.parse(data);

        await createMarker(marker, request, context);
        break;
      }
      case INTENTS.updateMarker: {
        const parsed = convertFormDataToObject(formData);
        console.log("Edit: ", parsed);

        const data = { ...parsed, created_by: user.id };

        const marker = markerEditSchema
          .extend({
            uid: z.string(),
            map_id: z.string(),
          })
          .parse(data);

        await editMarker(marker.uid, marker, request, context);

        break;
      }
      case INTENTS.deleteMarker: {
        const { uid } = values;
        if (!uid) throw badRequest("Missing uid");

        await deleteMarker(uid.toString(), request, context);

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

    throw new Error(
      `Unexpected issue occurred. Please try again. error: ${error}`
    );
  }
};

export default function Map() {
  const { collections, markers, mapEnvs, map } = useLoaderData<typeof loader>();

  return (
    <GlobalProvider>
      <Suspense fallback={<div>Loading...</div>}>
        <MapView
          collections={collections}
          markers={markers}
          env={mapEnvs}
          map={map!}
        />
      </Suspense>
    </GlobalProvider>
  );
}
