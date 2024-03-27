
import { createCollection } from "@/lib/crud/collections";
import { collectionSchema } from "@/lib/schemas";
import { ActionFunctionArgs, redirect } from "@remix-run/cloudflare";
import { z } from "zod";


export const action = async ({
    request,
  }: ActionFunctionArgs) => {
    try {
      const formData = await request.formData();
      const values = Object.fromEntries(formData);

      const collection = collectionSchema.parse(values);
    
      await createCollection(collection, request);
    
      return redirect(`/map/"${collection.map_id}`);

    } catch (error) {
      console.error("Error on /recipes/[id]/edit", error);
  
      if (error instanceof z.ZodError) {
        throw new Error(error.issues.map((issue) => issue.message).join("\n"));
      }
  
      throw new Error("Unexpected issue occurred. Please try again.");
    }
  };