import { redirect } from "@remix-run/cloudflare";

import getSupabaseServerClient from "@/server/supabaseServer";
import type { LoaderFunctionArgs } from "@remix-run/cloudflare";

export const loader = async ({ request, context }: LoaderFunctionArgs) => {
  const response = new Response();
  const url = new URL(request.url);
  const code = url.searchParams.get("code");

  if (code) {
    const supabaseClient = getSupabaseServerClient(request, context, response);
    await supabaseClient.auth.exchangeCodeForSession(code);
  }

  return redirect("/home", {
    headers: response.headers,
  });
};
