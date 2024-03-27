
import { createMap } from "@/lib/crud/maps";
import { ActionFunctionArgs, redirect } from "@remix-run/cloudflare";
import { z } from "zod";


export const action = async ({
    request,
  }: ActionFunctionArgs) => {
    try {
      const formData = await request.formData();
      const {title, description} = Object.fromEntries(formData);
  
      await createMap({title: title.toString(), description: description.toString()}, request);
      
      return redirect("/");

    } catch (error) {
      console.error("Error on /recipes/[id]/edit", error);
  
      if (error instanceof z.ZodError) {
        throw new Error(error.issues.map((issue) => issue.message).join("\n"));
      }
  
      throw new Error("Unexpected issue occurred. Please try again.");
    }

  
  };