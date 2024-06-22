'use server'
import { SessionProvider, useSession } from 'next-auth/react'
import Link from 'next/link'

import { ClientHeader } from './ClientHeader'
import { getUserData } from '../api/user/route'

export default async function Header() {
  const user = await getUserData()
  return (
    <>
      <header className="fixed left-0 top-0 z-10 flex w-full justify-center border-b border-slate-300 bg-gradient-to-b from-slate-200 pb-2 pt-4 backdrop-blur-2xl dark:border-neutral-800 dark:bg-slate-800/30 dark:from-inherit lg:dark:bg-slate-800/30">
        <Link className="font-mono font-bold" href={{ pathname: '/' }}>
          breakdanceDB
        </Link>
        <ClientHeader
          user={{
            name: user?.name ?? null,
            profilePicture: user?.image ?? null,
          }}
        />
      </header>
    </>
  )
}
