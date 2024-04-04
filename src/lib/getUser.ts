import { supabaseServer } from "./supabase";

export const getUser = async () => {
  const {
    data: { user },
  } = await supabaseServer.auth.getUser();
  return user;
};
