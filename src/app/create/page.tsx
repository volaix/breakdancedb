'use client'
// @format
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { Notification } from '../_components/Notification'
import RenderThunder from '../_components/RenderChilli'
import { useZustandStore } from '../_utils/zustandLocalStorage'
import ExistingMoves from './ViewExistingMoves'
import Selection from './Selection'

//----------------------------mainrender--------------------------
/*
 * Renders 3 moves with 3 buttons at the bottom.
 */
export default function RenderFlows() {
  //-----------------------------state-----------------------------
  //learning refers to "what will be displayed" and is RNG set
  const [visible, setVisible] = useState(false)
  const [notificationMessage, setNotificationMessage] = useState<string>('')
  const [textAreaValue, setTextAreaValue] = useState<string>('')
  const [ratingVal, setRatingVal] = useState<number>(1)

  // --------------hooks--------
  //Show Notifcation for 2 seconds
  useEffect(() => {
    const fadeOutTimer = setTimeout(() => setVisible(false), 2000)
    return () => clearTimeout(fadeOutTimer)
  }, [visible])
  //-------------------------handlers--------------------------------

  //-----------------------render--------------------
  return (
    <main className="mt-24 flex w-full max-w-xs flex-col items-center justify-between text-sm dark:text-gray-600 ">
      {/* -------------------TITLE SECTION--------------- */}
      <section className="mb-10 flex w-full flex-col text-center dark:text-gray-400">
        {/* ---------------------------TITLE------------------------ */}
        <hgroup>
          <h1 className="title-font mb-2 text-3xl font-medium sm:text-4xl dark:text-white">
            CREATE MOVE
          </h1>
          <p className="mx-auto px-2 text-sm leading-relaxed lg:w-2/3">
            {`Base move + Modifier = New Move`}
          </p>
        </hgroup>
      </section>
      {/* ----------END OF TITLE SECTION------------- */}
      {/* //----------------------BASE MOVE----------------------- */}
      <article className="w-full rounded-lg bg-slate-100 p-2 pb-10">
        <h2 className="text-lg">BASE MOVE</h2>
        <Selection />
      </article>
      {/* //--------------------------END OF BASE MOVE------------------------------- */}
      {/* -------------------MODIFIER---------------- */}
      <article className="mt-5 w-full rounded-lg bg-slate-100 p-2 pb-10">
        <h2 className="text-lg">MODIFIER</h2>
        <Selection modifier />
      </article>
      {/* ---------------END OF MODIFIER------------ */}
      {/* //--------------------------I LIKE THIS METER------------------------------- */}
      <section className="pb-10 text-center">
        <h2 className="pb-2">Cool ranking</h2>
        <div className="flex flex-row-reverse">
          {Array.from(Array(5)).map((a, i) => {
            return (
              <RenderThunder
                id={5 - i + ''}
                checked={i === 5 - ratingVal}
                onChange={(e) => {
                  setRatingVal(Number(e.target.id))
                }}
                key={i}
                size="size-10"
              />
            )
          })}
        </div>
        <p className="text-[7px]">not cool at all</p>
      </section>
      {/* ---------------------------------Notes----------------------------------- */}
      <h2>Notes</h2>
      <div className="w-full px-4">
        <textarea
          className="w-full resize-none rounded border border-gray-300 bg-gray-100 bg-opacity-50 px-3 py-1 text-xs text-gray-700 outline-none transition-colors duration-200 ease-in-out focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-200 dark:border-gray-700 dark:bg-gray-800 dark:bg-opacity-40 dark:text-gray-100 dark:focus:bg-gray-900 dark:focus:ring-indigo-900"
          rows={3}
          cols={30}
          value={textAreaValue}
          onChange={(e) => setTextAreaValue(e.target.value)}
        />
      </div>
      {/* ----------------------------------RESULT BUTTONS------------------------------------ */}
      <Notification visible={visible} message={notificationMessage} />
      {
        <div className="flex justify-evenly px-2 py-5 text-xs">
          <section>
            <Link
              className="rounded border border-indigo-500 px-3 py-2 text-center text-indigo-500"
              href="/yourmoves"
            >
              Go to Learn Move
            </Link>
            <Link
              href="/yourmoves"
              className="rounded border border-indigo-500 px-3 py-2 text-center text-indigo-500"
            >
              Go to Your Moves
            </Link>
          </section>
        </div>
      }
    </main>
  )
}
