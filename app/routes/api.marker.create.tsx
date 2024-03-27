
import { createMarker } from "@/lib/crud/markers";
import { getUser } from "@/lib/getUser";
import { markerSchema } from "@/lib/schemas";
import { ActionFunctionArgs } from "@remix-run/cloudflare";
import { z } from "zod";


export const action = async ({
    request,
  }: ActionFunctionArgs) => {
    try {
      const req = await request.json();
      const user = await getUser(request);

      if (!user) {
          return new Error("UNAUTHORIZED: user not found.")
      }

      const data = {...req, created_by: user.id}

      const marker = markerSchema.parse(data);

    
      await createMarker(marker, request);
    
      return data;
    } catch (error) {
      console.error("Error on /recipes/[id]/edit", error);
  
      if (error instanceof z.ZodError) {
        throw new Error(error.issues.map((issue) => issue.message).join("\n"));
      }
  
      throw new Error("Unexpected issue occurred. Please try again.");
    }
  };