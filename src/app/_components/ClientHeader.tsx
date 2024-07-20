'use client'
import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'
import { RenderDownloadSvg, RenderSpinner, RenderUploadCloudSVG } from './Svgs'
import { Notification } from './Notification'
import {
  DOWNLOAD_USER,
  DOWNLOAD_USER_HEADER,
  ERRORCODES,
  UPLOAD_USER,
  downloadUserData,
  headerDownload,
  updateUserDataClient,
} from '../_utils/clientActions'
import { useQuery } from '@tanstack/react-query'
import { useZustandStore } from '../_utils/zustandLocalStorage'

/**
 * Renders the top header used on every page. Usually thrown in the template.tsx
 * Hamburger menu, top left, text mid, profile pic top right.
 * @returns
 */
export function ClientHeader({
  user,
}: {
  user: { name: string | null; profilePicture: string | null }
}) {
  //-----------------state------------------------------------
  const [isNavOpen, setIsNavOpen] = useState(false)
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)
  const [manualUploading, setManualUploading] = useState(false)
  const [manualDownload, setManualDownload] = useState(false)
  const [modal, setModal] = useState(false)
  const [notification, setNotification] = useState<null | {
    visible?: boolean
    message?: string
  }>(null)
  const replaceGlobalState = useZustandStore(
    (state) => state.replaceGlobalState,
  )

  const hasUser = user.name !== null && user.profilePicture !== null

  // ----Refs-------
  const settingsMenu = useRef<HTMLDivElement>(null)

  // ----hooks------
  const {
    isLoading: loadingCloud,
    refetch: uploadToCloud,
    isError,
    error,
  } = useQuery({
    queryKey: [UPLOAD_USER],
    queryFn: updateUserDataClient,
    enabled: false,
  })

  const isUploading = loadingCloud || manualUploading

  const {
    isLoading: isFetchingUser,
    isError: isFetchError,
    error: fetchError,
    refetch: refetchDownload,
    isSuccess,
  } = useQuery({
    queryKey: [DOWNLOAD_USER_HEADER],
    queryFn: headerDownload,
    enabled: hasUser,
  })

  //For downloading and replacing user data
  const {
    isLoading: isDownloadingUser,
    isError: isErrorDownloading,
    error: downloadingError,
    refetch: refetchDownloadUser,
  } = useQuery({
    queryKey: [DOWNLOAD_USER],
    queryFn: downloadUserData,
    enabled: false,
  })

  const isDownloading = isFetchingUser || manualDownload

  //first time download
  useEffect(() => {
    if (isFetchingUser) {
      setNotification({ visible: true, message: 'Downloading from cloud...' })
    } else if (isSuccess) {
      setNotification({
        visible: true,
        message: 'Successfully in sync with cloud',
      })
    }
  }, [isFetchingUser, isSuccess])

  //error handling for queries
  useEffect(() => {
    if (isFetchError) {
      //EDGE CASE: local data and server data are mismatched. show modal to remedy.
      if (fetchError.message === ERRORCODES[205]) {
        setModal(true)
      } else {
        setNotification({
          visible: true,
          message: `ERROR: ${fetchError.message}`,
        })
      }
    } else if (isError) {
      setNotification({ visible: true, message: `ERROR: ${error.message}` })
    }
  }, [error, fetchError?.message, isError, isFetchError])

  //Show Notifcation for 2 seconds
  useEffect(() => {
    const fadeOutTimer = setTimeout(
      () => setNotification({ visible: false }),
      2000,
    )
    return () => clearTimeout(fadeOutTimer)
  }, [notification?.visible])

  //Close settings when click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (isSettingsOpen && !settingsMenu.current?.contains(e.target as Node)) {
        setIsSettingsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isSettingsOpen])

  //-----------------render----------------------------------------
  return (
    <>
      {/* hamburger menu */}
      <nav className={`fixed left-2 top-3 z-10`}>
        <div
          className={`fixed flex w-4/5 max-w-xs items-center justify-between`}
        >
          <nav>
            <section className="flex">
              <article
                className="space-y-2"
                onClick={() => setIsNavOpen((prev) => !prev)}
              >
                <div className="grid justify-items-center gap-1.5">
                  <span className="h-0.5 w-5 rounded-full bg-slate-400 transition group-hover:translate-y-2.5 group-hover:rotate-45" />
                  <span className="h-0.5 w-5 rounded-full bg-slate-400 transition group-hover:scale-x-0" />
                  <span className="h-0.5 w-5 rounded-full bg-slate-400 group-hover:-translate-y-2.5 group-hover:-rotate-45" />
                </div>
              </article>

              <nav
                className={`${isNavOpen && 'absolute left-0 top-0 z-10 flex h-screen w-full flex-col items-center justify-evenly bg-white'} ${!isNavOpen && 'hidden'} `}
              >
                {/* ------delete button------- */}
                <article
                  className="absolute right-0 top-0 px-8 py-8"
                  onClick={() => setIsNavOpen(false)}
                >
                  <svg
                    className="h-8 w-8 text-gray-600"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </article>
                {/* ----------navigation------------ */}
                <ul className="flex	min-h-[250px] flex-col items-center justify-between text-black">
                  <li className="my-2 border-b border-gray-400 uppercase">
                    <Link
                      onClick={() => setIsNavOpen((prev) => !prev)}
                      href="/"
                    >
                      BreakdanceDB
                    </Link>
                  </li>
                  <li className="my-2 border-b border-gray-400 uppercase">
                    <Link onClick={() => setIsNavOpen(false)} href="/yourmoves">
                      📚 Your Moves 📚
                    </Link>
                  </li>
                  <li className="my-2 border-b border-gray-400 uppercase">
                    <Link
                      onClick={() => setIsNavOpen(false)}
                      href="/learntransitions"
                    >
                      ✅ Transitions ✅
                    </Link>
                  </li>
                  <li className="my-2 border-b border-gray-400 uppercase">
                    <Link
                      onClick={() => setIsNavOpen(false)}
                      href="/learnflows"
                    >
                      💪 RNG Set 💪
                    </Link>
                  </li>
                  <li className="my-2 border-b border-gray-400 uppercase">
                    <Link onClick={() => setIsNavOpen(false)} href="/combos">
                      🤖 Combos 🤖
                    </Link>
                  </li>
                  {/* <li className="my-2 border-b border-gray-400 uppercase">
                    <Link onClick={() => setIsNavOpen(false)} href="/sequences">
                      ✅ Sequences ✅
                    </Link>
                  </li> */}
                  {/* <li className="my-2 border-b border-gray-400 uppercase">
                    <a href="/battle">🥊 Battle 🥊</a>
                  </li> */}
                  {/* <li className="my-2 uppercase border-b border-gray-400">
                    <a href="/learnmoves">🌱 Train Moves 🌱</a>
                  </li>
                  <li className="my-2 uppercase border-b border-gray-400">
                    <a href="/create">🎨 Create Move 🎨</a>
                  </li> */}
                  {/* {inDevelopment || (
                    <li className="my-2 uppercase border-b border-gray-400">
                      <a href="/nodes">Nodeview</a>
                    </li>
                  )} */}
                </ul>
              </nav>
            </section>
          </nav>
        </div>
      </nav>

      {/* notification */}
      <Notification
        visible={!!notification?.visible}
        message={notification?.message || ''}
        className="fixed z-10"
      />
      {/* upload/download button */}
      {hasUser && (
        <>
          <section className="fixed right-14 top-5 z-0 cursor-pointer">
            {isUploading && (
              <RenderSpinner className="-ml-1 mr-3 h-5 w-5 animate-spin text-indigo-500" />
            )}
            {!isUploading && (
              <RenderUploadCloudSVG
                onClick={async () => {
                  setNotification({
                    visible: true,
                    message: 'Uploading to cloud...',
                  })

                  setManualUploading(true)
                  await uploadToCloud()
                  setManualUploading(false)
                  setNotification({
                    visible: true,
                    message: 'Successfully uploaded',
                  })
                }}
                className="size-4 fill-slate-400 hover:fill-indigo-500"
              />
            )}
          </section>
          <article className="fixed right-20 top-6 z-0 cursor-pointer  ">
            {isDownloading && (
              <RenderSpinner className="-ml-1 mr-3 h-5 w-5 animate-spin text-indigo-500" />
            )}
            {!isDownloading && (
              <RenderDownloadSvg
                className="size-2 fill-slate-400 hover:fill-indigo-500"
                onClick={async () => {
                  console.log('hello world')
                  setNotification({
                    visible: true,
                    message: 'Downloading from cloud...',
                  })
                  setManualDownload(true)
                  await refetchDownload()
                  setManualDownload(false)
                  setNotification({
                    visible: true,
                    message: 'Successfully downloaded',
                  })
                }}
              />
            )}
          </article>
        </>
      )}

      {/* profile menu */}
      <div ref={settingsMenu} className="fixed right-2 top-0 ">
        <button
          onClick={() => {
            setIsSettingsOpen((prev) => !prev)
            setIsNavOpen(false)
          }}
          className="flex-col items-center rounded-lg px-1 pt-2.5 text-center text-sm font-medium text-white hover:bg-slate-300 focus:outline-none "
          type="button"
        >
          <span className="inline-flex">
            <Image
              className="h-6 w-6 rounded-full"
              width="64"
              height="64"
              src={
                user.profilePicture || 'https://dummyimage.com/64x64/000/fff'
              }
              alt="Rounded avatar"
            />
            <svg
              className="absolute top-6 ms-3 h-2.5 w-2.5"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 10 6"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="m1 1 4 4 4-4"
              />
            </svg>
          </span>
          <p className="-mt-0.5 text-4xs leading-none	 text-slate-200">
            {hasUser ? 'Logged In' : 'Offline mode'}
          </p>
        </button>

        {/* <!-- Dropdown menu --> */}
        <div
          className={`${isSettingsOpen && 'fixed right-2 top-10 z-10  w-3/5 items-center justify-evenly rounded-md border border-slate-100 bg-white px-5'} 
          ${!isSettingsOpen && 'hidden'} `}
        >
          <section>
            {/* ------delete button------- */}
            <article
              className="p1 absolute right-1 top-1 mr-0.5 mt-1"
              onClick={() => setIsSettingsOpen(false)}
            >
              <svg
                className="h-4 w-4 text-gray-600"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </article>
            {/* ----------navigation------------ */}
            <article className="px-4 py-3 text-sm text-gray-900">
              {hasUser && (
                <Link onClick={() => setIsSettingsOpen(false)} href="/">
                  <div className="truncate">{user.name}</div>
                </Link>
              )}
              {!hasUser && (
                <Link
                  className="text-gray-600"
                  onClick={() => setIsSettingsOpen(false)}
                  href="/"
                >
                  Sign in/Sign Out
                </Link>
              )}
            </article>
            <ul className="my-2 pb-2 text-center text-sm text-gray-700 ">
              <li className="my-2 border-b border-gray-500 text-xs">
                <Link onClick={() => setIsSettingsOpen(false)} href="/dblist">
                  View Stats
                </Link>
              </li>
              <li className="my-2 border-b border-gray-500 text-xs">
                <Link
                  onClick={() => setIsSettingsOpen(false)}
                  href="/importexport"
                >
                  {' '}
                  Import / Export{' '}
                </Link>
              </li>
              <li className="my-2 border-b border-gray-500 text-xs">
                <Link onClick={() => setIsSettingsOpen(false)} href="/warmup">
                  Warmup Protocol‍
                </Link>
              </li>
              {
                <li className="my-2 border-b border-gray-500 text-xs">
                  <Link onClick={() => setIsSettingsOpen(false)} href="/">
                    {hasUser ? 'Sign out' : 'Sign out'}
                  </Link>
                </li>
              }
            </ul>
          </section>
        </div>
      </div>
      {/* -----------------MISMATCH CLOUD WITH LOCAL MODAL---------------- */}
      {modal && (
        <article className="fixed inset-0 bottom-0 left-0 right-0 top-0 z-20 flex h-screen w-screen items-center justify-center bg-gray-500 bg-opacity-75">
          <div className="rounded-lg p-6 shadow-xl dark:bg-slate-500">
            <h2 className="mb-4 text-xl font-bold">Data mismatch</h2>
            <p>Cloud data differs from local data.</p>
            <section className="flex gap-2">
              {/* ----------------REPLACE LOCAL---------------- */}
              <button
                onClick={async () => {
                  const data = await refetchDownloadUser()
                  if (data.isSuccess) {
                    setModal(false)
                    replaceGlobalState(data.data.userDb)
                    setNotification({
                      visible: true,
                      message: 'Successfully replaced. Please refresh',
                    })
                  }
                }}
                className="mt-4 rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
              >
                Replace Local
              </button>
              {/* ----------------UPLOAD LOCAL---------------- */}
              <button
                onClick={async () => {
                  await uploadToCloud()
                  setModal(false)
                  setNotification({
                    visible: true,
                    message: 'Successfully uploaded local data to cloud',
                  })
                }}
                className="mt-4 rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
              >
                Upload Local
              </button>
              <button
                onClick={() => {
                  setModal(false)
                }}
                className="mt-4 rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
              >
                Skip
              </button>
            </section>
          </div>
        </article>
      )}
    </>
  )
}
