import useSupabase from "@/server/supabaseClient";
import getSupabaseServerClient from "@/server/supabaseServer";

export const useUser = () => {
    const supabase = useSupabase();
    const user = supabase.auth.getUser();
    return user;
}

export const getUser = async (request: Request) => {
    const supabase = getSupabaseServerClient(request);
    const { data: {
        user
    }, error } = await supabase.auth.getUser();
    return user;
}