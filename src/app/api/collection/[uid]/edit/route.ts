import { editCollection } from '@/lib/crud/collections'
import { editMarker } from '@/lib/crud/markers'
import { getUser } from '@/lib/getUser'
import { collectionSchema, markerEditSchema } from '@/types/schemas'
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

export const runtime = 'edge'

export async function PUT(req: NextRequest, { params }: { params: { uid: string } }) {
  try {
    const user = await getUser()

  if (!user) {
    return NextResponse.json("Unauthorized", { status: 401 });
  }

  if (!params.uid) {
    return NextResponse.json("Missing uid", { status: 400 });
  }

  const json = await req.json();
  const collection = collectionSchema.partial().parse(json);

  const editedCollection = await editCollection(params.uid, collection)


  return NextResponse.json({ message: 'Updated collection successfully', data: editedCollection })
  } catch (error) {
    console.error(`Error on /api/collection/${params.uid}/edit`, error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(JSON.stringify(error.issues), { status: 422 });
    }

    return NextResponse.json(null, { status: 500 });
  }
}