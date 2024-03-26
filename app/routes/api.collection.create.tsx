
import { createCollection } from "@/lib/crud/collections";
import { ActionFunctionArgs, redirect } from "@remix-run/cloudflare";


export const action = async ({
    request,
  }: ActionFunctionArgs) => {
    const formData = await request.formData();
    const {title, description} = Object.fromEntries(formData);

    await createCollection({title: title.toString(), description: description.toString()}, request);
    
    return redirect("/");
  };