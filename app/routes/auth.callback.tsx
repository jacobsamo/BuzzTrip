import { redirect } from '@remix-run/cloudflare'
import { createServerClient } from '@supabase/auth-helpers-remix'

import type { Database } from 'database.types'
import type { LoaderFunctionArgs } from '@remix-run/cloudflare'

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const response = new Response()
  const url = new URL(request.url)
  const code = url.searchParams.get('code')

  if (code) {
    const supabaseClient = createServerClient<Database>(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_ANON_KEY!,
      { request, response }
    )
    await supabaseClient.auth.exchangeCodeForSession(code)
  }

  return redirect('/', {
    headers: response.headers,
  })
}