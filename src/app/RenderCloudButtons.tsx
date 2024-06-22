'use client'

import { useEffect, useState } from 'react'
import { signInAction, signOutAction } from './_utils/actions'
import { Notification } from './_components/Notification'
import {
  useZustandStore,
  zustandLocalStorage,
} from './_utils/zustandLocalStorage'

export type NextUser = {
  payload: string
}

export default function RenderCloudButtons({
  userLoggedIn,
  userDate,
}: {
  userLoggedIn: boolean
  userDate: string
}) {
  //---------------------STATE----------------------
  const [notification, setNotification] = useState<null | {
    visible?: boolean
    message?: string
  }>(null)
  const [lastEdited, setLastEdited] = useState<string | null>(null)
  const replaceGlobalState = useZustandStore(
    (state) => state.replaceGlobalState,
  )

  //-------------------HOOKS--------------------
  //On mount updates lastEdited
  useEffect(() => {
    if (userDate) {
      setLastEdited(userDate)
    }
  }, [userDate])

  //Show Notifcation for 2 seconds
  useEffect(() => {
    const fadeOutTimer = setTimeout(
      () => setNotification({ visible: false }),
      2000,
    )
    return () => clearTimeout(fadeOutTimer)
  }, [notification?.visible])

  //------------------HANDLERS---------------------
  const downloadUserData = async () => {
    try {
      const itemListRes = await fetch('/api/user')
      const { userDb } = await itemListRes.json()
      setNotification({ visible: true, message: 'Download successful' })
      replaceGlobalState(userDb)
    } catch (error) {
      console.error(error)
    }
  }
  const uploadUserData = async () => {
    if (!localStorage[zustandLocalStorage])
      return console.error(
        'cannot find breakdancedb data in your local storage.',
      )

    await fetch('/api/user', {
      method: 'PUT',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: localStorage[zustandLocalStorage],
    })

    setNotification({ visible: true, message: 'Upload successful' })

    const user = await fetch('/api/user')
    const { editedAt } = await user.json()
    setLastEdited(editedAt)
  }
  const deleteUserData = async () => {
    fetch('/api/user', {
      method: 'DELETE',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    })
    setNotification({ visible: true, message: 'Delete successful' })
    await signOutAction()
  }

  return (
    <>
      <article className="m-5 flex flex-col justify-center text-center">
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
      </article>
      {lastEdited && (
        <section className="mb-2 text-center text-2xs">
          <div>Cloud Data Last Uploaded on:</div>
          <div>{`${new Date(lastEdited)}}`}</div>
        </section>
      )}
      {/* //TODO BUG DOESNT RUN */}
      {userLoggedIn && !lastEdited && <div>cloud data not found.</div>}

      <Notification
        visible={!!notification?.visible}
        message={notification?.message || ''}
      />
      {userLoggedIn && (
        <section className="flex flex-col space-y-2 text-center">
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
            className="focus-visible:ring-ring bg-background hover:bg-accent hover:text-accent-foreground inline-flex  h-9 items-center justify-center whitespace-nowrap rounded bg-red-500 px-6 py-2 text-xs text-white shadow-sm transition-colors hover:bg-indigo-600 focus:outline-none focus-visible:outline-none focus-visible:ring-1 disabled:pointer-events-none disabled:opacity-50"
            onClick={deleteUserData}
          >
            Delete from Cloud
          </button>
        </section>
      )}
    </>
  )
}
