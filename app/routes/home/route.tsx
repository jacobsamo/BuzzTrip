import { createMap, deleteMap, editMap } from "@/lib/crud/maps";
import { SharedMap } from "@/lib/types";
import MapModal from "@/routes/home/modals/create_edit_map_modal";
import MapCard from "@/routes/home/map_card";
import getSupabaseServerClient from "@/server/supabaseServer";
import {
  ActionFunctionArgs,
  json,
  redirect,
  type LoaderFunctionArgs,
  type MetaFunction,
} from "@remix-run/cloudflare";
import { useLoaderData } from "@remix-run/react";
import { z } from "zod";
import { INTENTS } from "./intents";
import { getUser } from "@/lib/getUser";
import { badRequest } from "@/lib/bad-request";
import { User } from "@supabase/auth-helpers-remix";

export const meta: MetaFunction = () => {
  return [
    { title: "Home | BuzzTrip" },
    {
      name: "description",
      content: "Plan the trip you've always dreamed of",
    },
  ];
};

export const loader = async ({ request, context }: LoaderFunctionArgs) => {
  try {
    const supabase = getSupabaseServerClient(request, context);

    const {
      data: { user },
    } = await client.auth.getUser();

    if (!user) {
      return redirect("/auth");
    }

    const { data: maps } = await supabase
      .from("shared_map_view")
      .select()
      .eq("user_id", user?.id);

    const url = new URL(request.url);
    const q = url.searchParams.get("q");
    let foundUsers: User[] | undefined = undefined;
    if (q) {
      const {
        data: { users },
      } = await supabase.auth.admin.listUsers();

      foundUsers = users.filter((user) => user.email?.includes(q)).splice(0, 4);
      console.log("found users: ", foundUsers);
      console.log("users: ", users);
    }

    return json({ maps: maps as SharedMap[] | null, users: foundUsers, q });
  } catch (e) {
    return json({ maps: null, users: undefined, q: "" });
  }
};

export const action = async ({ request, context }: ActionFunctionArgs) => {
  try {
    const formData = await request.formData();

    const intent = formData.get("intent");
    const user = await getUser(request, context);

    if (!intent) throw badRequest("Missing intent");

    if (!user) throw badRequest("Unauthorized");

    switch (intent) {
      case INTENTS.createMap: {
        const { title, description } = Object.fromEntries(formData);

        await createMap(
          { title: title.toString(), description: description.toString() },
          request,
          context
        );
        break;
      }
      case INTENTS.editMap: {
        break;
      }
      case INTENTS.deleteMap: {
        const { map_id } = Object.entries(formData.entries());

        await deleteMap(map_id, request, context);

        break;
      }
      case INTENTS.shareMap: {
        break;
      }
      case INTENTS.editPermissions: {
        break;
      }
      default: {
        throw badRequest(`Unknown intent: ${intent}`);
      }
    }

    return { ok: true };
  } catch (error) {
    console.error("Error on /recipes/[id]/edit", error);

    if (error instanceof z.ZodError) {
      throw new Error(error.issues.map((issue) => issue.message).join("\n"));
    }

    throw new Error("Unexpected issue occurred. Please try again.");
  }
};

export default function Index() {
  const { maps } = useLoaderData<typeof loader>();

  return (
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
