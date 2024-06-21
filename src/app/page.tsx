'use server'

import RenderButtonTest from './RenderButtonTest'
import RenderHero from './RenderHero'
import RenderTree from './RenderTree'
import { connectToMongodb } from './_utils/actions'
import { auth } from '../../auth'

const RenderHome = async ({ isConnected }: { isConnected?: boolean }) => {
  const session = await auth()

  return (
    <div className="flex flex-col items-center">
      <RenderHero />
      {/* {isConnected ? (
        <div>Connected to MongoDB</div>
      ) : (
        <div>Not Connected to MongoDB</div>
      )} */}
      <RenderButtonTest session={session} />
      <RenderTree />
    </div>
  )
}

export default async function RenderHomePage() {
  // const isConnected = await connectToMongodb().then(
  //   (res) => res.props.isConnected,
  // )
  return <RenderHome /*isConnected={isConnected}*/ />
}
