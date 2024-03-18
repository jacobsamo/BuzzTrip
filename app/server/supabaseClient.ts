import { useMemo } from 'react';
import { createBrowserClient } from '@supabase/auth-helpers-remix';
import type { Database } from '../../database.types';
 
export function getSupabaseBrowserClient() {
  return createBrowserClient<Database>(
    process.env.SUPABASE_URL!, 
    process.env.SUPABASE_ANON_KEY!
  );
}
 
function useSupabase() {
  return useMemo(getSupabaseBrowserClient, []);
}
 
export default useSupabase;