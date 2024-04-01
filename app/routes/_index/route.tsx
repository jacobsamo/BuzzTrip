import MapCard from "@/routes/home/map_card";
import MapModal from "@/routes/home/modals/create_edit_map_modal";
import { SharedMap } from "@/lib/types";
import getSupabaseServerClient from "@/server/supabaseServer";
import {
  json,
  redirect,
  type LoaderFunctionArgs,
  type MetaFunction,
} from "@remix-run/cloudflare";
import { useLoaderData } from "@remix-run/react";
import Nav from "./nav";
import Hero from "./hero";

export const meta: MetaFunction = () => {
  return [
    { title: "BuzzTrip" },
    {
      name: "description",
      content: "Plan the trip you've always dreamed of",
    },
  ];
};

export const loader = async ({ request, context }: LoaderFunctionArgs) => {
  const client = getSupabaseServerClient(request, context);

  const {
    data: { user },
  } = await client.auth.getUser();

  if (user) {
    return redirect("/home");
  }

  return json({});
};

export default function Index() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
      </main>
    </>
  );
}
