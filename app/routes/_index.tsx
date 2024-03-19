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

    console.log(user);

    // if (!user) {
    //   return redirect("/auth");
    // }

    return json({});
  } catch (e) {
    return json({});
  }
};

export default function Index() {



  return(<>
  <h1 className="text-3xl font-bold underline">Hello world!
  </h1>
    <button onClick={() => console.log("click")}>CLick</button>
  </> );
}
