import getSupabaseServerClient from "@/server/supabaseServer";
import {
  json,
  redirect,
  type LoaderFunctionArgs,
  type MetaFunction,
} from "@remix-run/cloudflare";
import Hero from "./hero";
import Nav from "./nav";

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
