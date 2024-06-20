'use server'
import { NextUser } from '@/app/RenderButtonTest'
import dbClientPromise from '@/db/mongodb'
import { NextApiRequest, NextApiResponse } from 'next'

import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest, res: NextResponse) {
  //todo have zod parse this data
  const data: NextUser = await req.json()
  console.log('got:', data)
  await dbClientPromise
    .db('sample_mflix')
    .collection('AAA_next_users')
    .insertOne({ id: data.id, name: data.name, payload: data.payload })

  return NextResponse.json({ data: data }, { status: 200 })
}

export async function GET() {
// _: Request
  // const searchParams = request.nextUrl.searchParams
  // const query = searchParams.get('query')
  // query is "hello" for /api/search?query=hello
  try {
    const movies = await dbClientPromise
      .db('sample_mflix')
      .collection('AAA_next_users')
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
  console.log('trying to update with', data)
  const userCollection = await dbClientPromise
    .db('sample_mflix')
    .collection('AAA_next_users')

  const query = { id: data.id } //key
  const update = { $set: { ...data } }
  const options = { upsert: true }

  userCollection.updateOne(query, update, options)

  return NextResponse.json({ data: data }, { status: 200 })
}

export async function DELETE(req: NextRequest, res: NextResponse) {
  const data: NextUser = await req.json()
  const userCollection = await dbClientPromise
    .db('sample_mflix')
    .collection('AAA_next_users')

  userCollection.deleteOne({ id: data.id })

  return NextResponse.json({ data: data }, { status: 200 })
}
