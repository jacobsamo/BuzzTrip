import getSupabaseServerClient from "@/server/supabaseServer";
import {
  json,
  redirect,
  type LoaderFunctionArgs,
  type MetaFunction,
} from "@remix-run/cloudflare";

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

    return json({});
  } catch (e) {
    return json({});
  }
};

export default function Index() {

  return(
    
      <main className="p-2">
        <span className="w-full justify-between">
        <h1>Your maps</h1>
          <h2>Create map</h2>
        </span>
      </main>
    
    );
}
