'use server'

import RenderButtonTest from './RenderButtonTest'
import RenderHero from './RenderHero'
import RenderTree from './RenderTree'
import { auth } from '../../auth'

const RenderHome = async ({ isConnected }: { isConnected?: boolean }) => {
  const session = await auth()

  return (
    <div className="flex flex-col items-center">
      <RenderHero />
      <RenderButtonTest userLoggedIn={!!session?.expires} />
      <RenderTree />
    </div>
  )
}

export default async function RenderHomePage() {
  return <RenderHome />
}
