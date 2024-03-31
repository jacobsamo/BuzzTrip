import getSupabaseServerClient from "@/server/supabaseServer";
import { AppLoadContext } from "@remix-run/cloudflare";


export const getUser = async (request: Request, context: AppLoadContext) => {
    const supabase = getSupabaseServerClient(request, context);
    const { data: {
        user
    }, error } = await supabase.auth.getUser();
    return user;
}