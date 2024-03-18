import { createServerClient } from '@supabase/auth-helpers-remix';
import { Database } from 'database.types';

 
function getSupabaseServerClient(
  request: Request, 
) {
  const response = new Response();
  return createServerClient<Database>(
    process.env.PUBLIC_SUPABASE_URL!,
    process.env.PUBLIC_SUPABASE_ANON_KEY!,
    {
      request,
      response,
    }
  );
}
 
export default getSupabaseServerClient;