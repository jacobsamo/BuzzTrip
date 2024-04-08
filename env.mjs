import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

const env = createEnv({
  server: {
    SUPABASE_URI: z.string(),
    SUPABASE_PASSWORD: z.string(),
    SUPABASE_SERVICE_ROLE: z.string(),
  },
  client: {
    NEXT_PUBLIC_GOOGLE_MAPS_API_KEY: z.string(),
    NEXT_PUBLIC_GOOGLE_MAPS_MAPID: z.string(),
    NEXT_PUBLIC_SUPABASE_URL: z.string(),
    NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string(),
  },
  runtimeEnv: {
    // client
    NEXT_PUBLIC_GOOGLE_MAPS_API_KEY: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
    NEXT_PUBLIC_GOOGLE_MAPS_MAPID: process.env.NEXT_PUBLIC_GOOGLE_MAPS_MAPID,
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,

    // server
    SUPABASE_URI: process.env.SUPABASE_URI,
    SUPABASE_PASSWORD: process.env.SUPABASE_PASSWORD,
    SUPABASE_SERVICE_ROLE: process.env.SUPABASE_SERVICE_ROLE,
  },
});

export default env;
