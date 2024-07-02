'use client'
import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'
import { RenderUploadCloudSVG } from './Svgs'
import { Notification } from './Notification'
import { updateUserDataClient } from '../_utils/clientActions'
import { useQuery } from '@tanstack/react-query'

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
  const [notification, setNotification] = useState<null | {
    visible?: boolean
    message?: string
  }>(null)

  const {
    isLoading: loadingCloud,
    refetch,
    isError,
    error,
  } = useQuery({
    queryKey: ['UPLOAD_USER'],
    queryFn: updateUserDataClient,
    enabled: false,
  })
  const hasUser = user.name !== null && user.profilePicture !== null

  // ----Refs-------
  const settingsMenu = useRef<HTMLDivElement>(null)

  // ----hooks------
  useEffect(() => {
    if (isError) {
      setNotification({ visible: true, message: `ERROR: ${error.message}` })
    }
  }, [error, isError])
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
                  {/* <li className="my-2 uppercase border-b border-gray-400">
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
      {/* upload button */}
      {hasUser && (
        <section className="fixed right-14 top-5 z-0">
          {loadingCloud && (
            <svg
              className="-ml-1 mr-3 h-5 w-5 animate-spin text-indigo-500"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                stroke-width="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
          )}
          {!loadingCloud && (
            <RenderUploadCloudSVG
              onClick={async () => {
                setNotification({
                  visible: true,
                  message: 'Uploading to cloud...',
                })

                // setLoadingCloud(true)
                // await updateUserDataClient()
                await refetch()
                // setLoadingCloud(false)
                setNotification({
                  visible: true,
                  message: 'Successfully uploaded',
                })
              }}
              className="size-4 fill-slate-400 hover:fill-indigo-500"
            />
          )}
        </section>
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
    </>
  )
}
