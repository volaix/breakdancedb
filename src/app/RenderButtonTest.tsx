'use client'

import { Session } from 'next-auth'
import RenderSaveUser from './SaveUser'
import { signInAction, signOutAction } from './_utils/actions'

export type NextUser = {
  id: string
  name: string
  payload: string
}

export default function RenderButtonTest({
  session,
}: {
  session: Session | null
}) {
  const userLoggedIn = session?.expires

  const downloadUserData = async () => {
    // session?.user?.id
    const itemListRes = await fetch('/api/user')
    const data = await itemListRes.json()
    console.log('data to set in zustand', data.data)
  }
  const uploadUserData = async () => {
    fetch('/api/user', {
      method: 'PUT',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id: session?.user?.id,
        name: session?.user?.name, // to be deleted from schema. i dont want to know.
        payload: 'third payload',
      } as NextUser),
    })
  }
  const deleteUserData = async () => {
    fetch('/api/user', {
      method: 'DELETE',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id: session?.user?.id }),
    })
    await signOutAction()
  }

  return (
    <>
      <article className="flex flex-col justify-center text-center">
        <form
          className=""
          action={!userLoggedIn ? signInAction : signOutAction}
        >
          <button
            type="submit"
            className="focus-visible:ring-ring bg-background hover:bg-accent hover:text-accent-foreground inline-flex  h-9 items-center justify-center whitespace-nowrap rounded bg-indigo-500 px-6 py-2 text-xs text-white shadow-sm transition-colors hover:bg-indigo-600 focus:outline-none focus-visible:outline-none focus-visible:ring-1 disabled:pointer-events-none disabled:opacity-50"
          >
            {`${!userLoggedIn ? 'Sign in' : 'Sign out'}`}
          </button>
        </form>
        {!userLoggedIn && (
          <p className="text-xs leading-none">Or continue in offline mode</p>
        )}
        {userLoggedIn && (
          <section className="flex w-full flex-col">
            <p>All your info:</p>
            <pre className="max-w-60 overflow-auto break-words break-all bg-slate-200 text-xs  leading-none">
              {JSON.stringify(session, null, 3)}
            </pre>
          </section>
        )}
        {false && userLoggedIn && <RenderSaveUser session={session} />}
      </article>
      {userLoggedIn && (
        <>
          <button
            className="focus-visible:ring-ring bg-background hover:bg-accent hover:text-accent-foreground inline-flex  h-9 items-center justify-center whitespace-nowrap rounded bg-indigo-500 px-6 py-2 text-xs text-white shadow-sm transition-colors hover:bg-indigo-600 focus:outline-none focus-visible:outline-none focus-visible:ring-1 disabled:pointer-events-none disabled:opacity-50"
            onClick={uploadUserData}
          >
            Upload to Cloud
          </button>
          <button
            className="focus-visible:ring-ring bg-background hover:bg-accent hover:text-accent-foreground inline-flex  h-9 items-center justify-center whitespace-nowrap rounded bg-indigo-500 px-6 py-2 text-xs text-white shadow-sm transition-colors hover:bg-indigo-600 focus:outline-none focus-visible:outline-none focus-visible:ring-1 disabled:pointer-events-none disabled:opacity-50"
            onClick={downloadUserData}
          >
            Download from Cloud
          </button>
          <button
            className="focus-visible:ring-ring bg-background hover:bg-accent hover:text-accent-foreground inline-flex  h-9 items-center justify-center whitespace-nowrap rounded bg-indigo-500 px-6 py-2 text-xs text-white shadow-sm transition-colors hover:bg-indigo-600 focus:outline-none focus-visible:outline-none focus-visible:ring-1 disabled:pointer-events-none disabled:opacity-50"
            onClick={deleteUserData}
          >
            Delete from Cloud
          </button>
        </>
      )}
    </>
  )
}
