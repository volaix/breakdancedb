'use server'
import { NextUser } from '@/app/RenderButtonTest'
import dbClientPromise from '@/db/mongodb'
import { auth } from 'auth'
import { NextRequest, NextResponse } from 'next/server'

const getUserCollection = async () => {
  return await dbClientPromise.db('BreakdanceDB').collection('userData')
}

export async function GET() {
  const session = await auth()
  try {
    const user = await (
      await getUserCollection()
    ).findOne({ user: session?.user }, { projection: { _id: 0, userDb: 1 } })

    return NextResponse.json({ userDb: user?.userDb }, { status: 200 })
  } catch (e) {
    console.error(e)
  }
}

export async function PUT(req: NextRequest, res: NextResponse) {
  const session = await auth()
  const data: NextUser = await req.json()

  const query = { user: session?.user } //key
  const update = {
    $set: {
      user: session?.user,
      userDb: { ...data },
    },
  }
  const options = { upsert: true }

  await (await getUserCollection()).updateOne(query, update, options)
  return NextResponse.json({ message: 'successfully sent' }, { status: 200 })
}

export async function DELETE(req: NextRequest, res: NextResponse) {
  const session = await auth()
  await (await getUserCollection()).deleteOne({ user: session?.user })
  return NextResponse.json({ message: 'successfully deleted' }, { status: 200 })
}
