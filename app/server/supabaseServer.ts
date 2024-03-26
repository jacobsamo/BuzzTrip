import { createServerClient } from '@supabase/auth-helpers-remix';
import { Database } from 'database.types';

 
function getSupabaseServerClient(
  request: Request, 
  response?: Response
) {
  const res = response ?? new Response();
  return createServerClient<Database>(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_ANON_KEY!,
    {
      request,
      response: res,
    }
  );
}
 
export default getSupabaseServerClient;