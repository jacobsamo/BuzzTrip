
import { createMap } from "@/lib/crud/maps";
import { ActionFunctionArgs, redirect } from "@remix-run/cloudflare";


export const action = async ({
    request,
  }: ActionFunctionArgs) => {
    const formData = await request.formData();
    const {title, description} = Object.fromEntries(formData);

    await createMap({title: title.toString(), description: description.toString()}, request);
    
    return redirect("/");
  };