import { editMarker } from '@/lib/crud/markers'
import { getUser } from '@/lib/getUser'
import { markerEditSchema } from '@/types/schemas'
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

export const runtime = 'edge'

export async function PUT(req: NextRequest, { params }: { params: { uid: string } }) {
  try {
  //   const user = await getUser()

  // if (!user) {
  //   return NextResponse.json("Unauthorized", { status: 401 });
  // }

  // if (!params.uid) {
  //   return NextResponse.json("Missing uid", { status: 400 });
  // }

  // const json = await req.json();
  // const marker = mapEdit.parse(json);

  // const editedMarker = await editMarker(params.uid, marker)


  return NextResponse.json({ message: 'Coming soon...'}, { status: 501 })
  } catch (error) {
    console.error(`Error on /api/marker/${params.uid}/edit`, error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(JSON.stringify(error.issues), { status: 422 });
    }

    return NextResponse.json(null, { status: 500 });
  }
}