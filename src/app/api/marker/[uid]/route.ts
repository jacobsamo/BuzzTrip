import { editMarker } from '@/lib/crud/markers'
import { getUser } from '@/lib/getUser'
import { createClient } from '@/lib/supabase/server'
import { markerEditSchema } from '@/types/schemas'
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

export const runtime = 'edge'

export async function GET(req: NextRequest, { params }: { params: { uid: string } }) {
  try {
    const user = await getUser()

  if (!user) {
    return NextResponse.json("Unauthorized", { status: 401 });
  }

  if (!params.uid) {
    return NextResponse.json("Missing uid", { status: 400 });
  }

  const supabase = await createClient();
  const {data: marker} = await supabase.from('marker').select().eq('uid', params.uid).single()


  return NextResponse.json({ message: 'Got marker', data: marker})
  } catch (error) {
    console.error(`Error on /api/marker/${params.uid}`, error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(JSON.stringify(error.issues), { status: 422 });
    }

    return NextResponse.json(null, { status: 500 });
  }
}