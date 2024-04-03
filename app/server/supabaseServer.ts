import { createServerClient } from "@supabase/auth-helpers-remix";
import { Database } from "database.types";
import { AppLoadContext } from "@remix-run/cloudflare";

function getSupabaseServerClient(
  request: Request,
  context: AppLoadContext,
  response?: Response
) {
  const env: any = context.cloudflare.env;
  const res = response ?? new Response();
  return createServerClient<Database>(
    env.SUPABASE_URL!,
    env.SUPABASE_ANON_KEY!,
    {
      request,
      response: res,
    }
  );
}

export function getSupabaseServerAdminClient(
  request: Request,
  context: AppLoadContext,
  response?: Response
) {
  const env: any = context.cloudflare.env;
  const res = response ?? new Response();
  return createServerClient<Database>(
    env.SUPABASE_URL!,
    env.PRIVATE_SUPABASE_SERVICE_ROLE!,
    {
      request,
      response: res,
    }
  );
}

export default getSupabaseServerClient;
