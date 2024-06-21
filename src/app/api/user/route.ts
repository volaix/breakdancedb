'use server'
import { NextUser } from '@/app/RenderButtonTest'
import dbClientPromise from '@/db/mongodb'
import { NextRequest, NextResponse } from 'next/server'

const getUserCollection = async () => {
  return await dbClientPromise.db('BreakdanceDB').collection('users')
}

export async function GET() {
  try {
    const movies = (await getUserCollection())
      .find({})
      // .sort({ metacritic: -1 })
      .limit(2)
      .toArray()

    console.log('got:', movies)

    return NextResponse.json({ data: movies }, { status: 200 })
    // return Response.json({ data: movies })
  } catch (e) {
    console.error(e)
  }
}

export async function PUT(req: NextRequest, res: NextResponse) {
  const data: NextUser = await req.json()
  console.log('server received data:', data)

  const query = { id: data.id } //key
  const update = { $set: { ...data } }
  const options = { upsert: true }

  await (await getUserCollection()).updateOne(query, update, options)

  return NextResponse.json({ data: data }, { status: 200 })
}

export async function DELETE(req: NextRequest, res: NextResponse) {
  const data: NextUser = await req.json()
  await (await getUserCollection()).deleteOne({ id: data.id })

  return NextResponse.json({ data: data }, { status: 200 })
}
