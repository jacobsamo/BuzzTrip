
import { createMarker } from "@/lib/crud/markers";
import { ActionFunctionArgs, redirect } from "@remix-run/cloudflare";


export const action = async ({
    request,
  }: ActionFunctionArgs) => {
    const formData = await request.formData();
    const {title, description} = Object.fromEntries(formData);

    await createMarker({title: title.toString(), description: description.toString()}, request);
    
    return redirect("/");
  };