
import { getUser } from "@/lib/getUser";
import getSupabaseServerClient from "@/server/supabaseServer";
import { ActionFunctionArgs, redirect } from "@remix-run/cloudflare";


export const action = async ({
    request,
  }: ActionFunctionArgs) => {
    const formData = await request.formData();
    const {title, description} = Object.fromEntries(formData);
    
    const supabase = getSupabaseServerClient(request);
    const user = await getUser(request);

    if (!user) {
        return redirect("/auth");
    }

    const newMap = {
        title: title,
        description: description,
        createdBy: user.id
    }

    console.log('New map: ', newMap);
    //TODO: alter schema to make uid to be generate from table
    const { data, error } = await supabase.from('map').insert({title: title, description: description, createdBy: user.id});

    return redirect("/");
  };