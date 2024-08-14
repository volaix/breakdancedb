'use client'

import { useQuery } from '@tanstack/react-query'
import { useEffect, useState } from 'react'
import { Notification } from './_components/Notification'
import { signInAction, signOutAction } from './_utils/actions'
import {
  DOWNLOAD_USER,
  UPLOAD_USER,
  downloadUserData,
  updateUserDataClient,
} from './_utils/clientActions'
import { useZustandStore } from './_utils/zustandLocalStorage'
import Link from 'next/link'

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
  const {
    refetch: fetchUploadUser,
    isError: isUploadError,
    error: uploadError,
    isSuccess,
  } = useQuery({
    queryKey: [UPLOAD_USER],
    queryFn: updateUserDataClient,
    enabled: false,
  })

  const {
    refetch: fetchDownloadUser,
    isError: isDownloadError,
    error: downloadError,
    isSuccess: isDownloadSuccess,
  } = useQuery({
    queryKey: [DOWNLOAD_USER],
    queryFn: downloadUserData,
    enabled: false,
  })

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

  //error handling
  useEffect(() => {
    if (isUploadError) {
      setNotification({ visible: true, message: uploadError?.message })
    }
  }, [isUploadError, isSuccess, uploadError?.message])

  //------------------HANDLERS---------------------
  const downloadUser = async () => {
    try {
      setNotification({ visible: true, message: 'Attempting to download' })
      const { userDb } = await downloadUserData()
      replaceGlobalState(userDb)
      setNotification({ visible: true, message: 'Download successful' })
    } catch (error) {
      console.error(error)
    }
  }
  const uploadUser = async () => {
    setNotification({ visible: true, message: 'Attempting to upload' })
    await fetchUploadUser()
    const { editedAt } = await downloadUserData()
    setLastEdited(editedAt)
    setNotification({ visible: true, message: 'Upload successful' })
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
            className="focus-visible:ring-ring bg-background hover:bg-accent hover:text-accent-foreground inline-flex h-9 items-center justify-center whitespace-nowrap rounded bg-indigo-500 px-6 py-2 text-xs text-white  shadow-sm transition-colors hover:bg-indigo-600 focus:outline-none focus-visible:outline-none focus-visible:ring-1 disabled:pointer-events-none disabled:opacity-50"
          >
            {`${!userLoggedIn ? 'Sign in' : 'Sign out'}`}
          </button>
        </form>
        {!userLoggedIn && (
          <p className="mt-2 text-xs leading-none">
            {`Or continue in `}
            <Link href="/yourmoves">offline mode</Link>
          </p>
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
            className="focus-visible:ring-ring bg-background hover:bg-accent hover:text-accent-foreground inline-flex h-9 items-center justify-center whitespace-nowrap rounded bg-indigo-500 px-6 py-2 text-xs text-white  shadow-sm transition-colors hover:bg-indigo-600 focus:outline-none focus-visible:outline-none focus-visible:ring-1 disabled:pointer-events-none disabled:opacity-50"
            onClick={uploadUser}
          >
            Upload to Cloud
          </button>
          <button
            className="focus-visible:ring-ring bg-background hover:bg-accent hover:text-accent-foreground inline-flex h-9 items-center justify-center whitespace-nowrap rounded bg-indigo-500 px-6 py-2 text-xs text-white  shadow-sm transition-colors hover:bg-indigo-600 focus:outline-none focus-visible:outline-none focus-visible:ring-1 disabled:pointer-events-none disabled:opacity-50"
            onClick={downloadUser}
          >
            Download from Cloud
          </button>
          <button
            className="focus-visible:ring-ring bg-background hover:bg-accent hover:text-accent-foreground inline-flex h-9 items-center justify-center whitespace-nowrap rounded bg-red-500 px-6 py-2 text-xs text-white  shadow-sm transition-colors hover:bg-indigo-600 focus:outline-none focus-visible:outline-none focus-visible:ring-1 disabled:pointer-events-none disabled:opacity-50"
            onClick={deleteUserData}
          >
            Delete from Cloud
          </button>
        </section>
      )}
    </>
  )
}
