"use server";
import { authClient } from "@/lib/auth-client";
import { headers } from "next/headers";

export const getSession = async () => {
  const session = await authClient.getSession({
    fetchOptions: {
      headers: await headers(),
    },
  });

  return session;
};
