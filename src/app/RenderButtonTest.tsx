'use client'

import { useCallback, useEffect, useState } from 'react'
import { GET } from './api/movies/route'
import { Session } from 'next-auth'
import { signInAction, signOutAction } from './_utils/actions'
import RenderSaveUser from './SaveUser'

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
  const [movies, setMovies] = useState()

  const sessionExists = session?.expires

  const readMovies = async () => {
    const itemListRes = await fetch('/api/movies')
    const data = await itemListRes.json()
    setMovies(data.data)
  }
  const createMovies = async () => {
    fetch('/api/movies', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id: 'uniqueId',
        name: 'initial name',
        payload: 'initial payload',
      } as NextUser),
    })
  }
  const updateMovies = async () => {
    fetch('/api/movies', {
      method: 'PUT',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id: 'uniqueId',
        name: 'third name',
        payload: 'third payload',
      } as NextUser),
    })
  }
  const deleteMovie = async () => {
    fetch('/api/movies', {
      method: 'DELETE',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id: 'uniqueId' }),
    })
  }

  return (
    <>
      <article className="flex flex-col justify-center text-center">
        <form
          className=""
          action={!sessionExists ? signInAction : signOutAction}
        >
          <button
            type="submit"
            className="focus-visible:ring-ring bg-background hover:bg-accent hover:text-accent-foreground inline-flex  h-9 items-center justify-center whitespace-nowrap rounded bg-indigo-500 px-6 py-2 text-xs text-white shadow-sm transition-colors hover:bg-indigo-600 focus:outline-none focus-visible:outline-none focus-visible:ring-1 disabled:pointer-events-none disabled:opacity-50"
          >
            {`${!sessionExists ? 'Sign in' : 'Sign out'}`}
          </button>
        </form>
        {!sessionExists && (
          <p className="text-xs leading-none">Or continue in offline mode</p>
        )}
        {sessionExists && (
          <section className="flex w-full flex-col">
            <p>All your info:</p>
            <pre className="max-w-60 overflow-auto break-words break-all bg-slate-200 text-xs  leading-none">
              {JSON.stringify(session, null, 3)}
            </pre>
          </section>
        )}
        {false && sessionExists && <RenderSaveUser session={session} />}
      </article>
      <button onClick={createMovies}>CREATE</button>
      <button onClick={readMovies}>READ</button>
      <button onClick={updateMovies}>UPDATE</button>
      <button onClick={deleteMovie}>DELETE</button>
    </>
  )
}
