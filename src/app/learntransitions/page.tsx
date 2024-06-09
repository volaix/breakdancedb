'use client'
// @format
import { useRef } from 'react'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { Notification } from '../_components/Notification'
import { useZustandStore } from '../_utils/zustandLocalStorage'

const coolRanking = new Map<number, string>([
  [1, 'not cool at all'],
  [2, 'not cool'],
  [3, 'cool'],
  [4, 'very cool'],
  [5, 'excitedly cool'],
])

function TriStateCheckbox({ text }: { text: string }) {
  const [state, setState] = useState<{ checked?: true; indeterminate?: true }>(
    {},
  )
  const checkboxRef = useRef<HTMLInputElement>(null)

  const handleClick = () => {
    setState((prevState) => {
      //return indeterminate if checked
      if (prevState.checked) {
        return { indeterminate: true }
        //return empty if indeterminate
      } else if (prevState.indeterminate) {
        return {}
        //return checked if nothing
      } else if (!prevState.checked && !prevState.indeterminate)
        return { checked: true }
      //no change as fallback
      else return prevState
    })
  }

  useEffect(() => {
    if (checkboxRef.current) {
      checkboxRef.current.indeterminate = !!state.indeterminate
    }
  }, [state])

  return (
    <div className="">
      <label className="mb-1">
        <input
          className="mr-2"
          type="checkbox"
          ref={checkboxRef}
          checked={!!state.checked}
          onClick={handleClick}
        />
        <span className={`${state.indeterminate && 'line-through'}`}>
          {text}
        </span>
      </label>
    </div>
  )
}

//----------------------------mainrender--------------------------
/*
 * Renders 3 moves with 3 buttons at the bottom.
 */
export default function RenderFlows() {
  //-----------------------------state-----------------------------
  //learning refers to "what will be displayed" and is RNG set
  const [selected, setSelected] = useState('london')
  const [visible, setVisible] = useState(false)
  const [notificationMessage, setNotificationMessage] = useState<string>('')
  const [textAreaValue, setTextAreaValue] = useState<string>('')
  const [ratingVal, setRatingVal] = useState<number>(1)
  const [moves, setMoves] = useState<Array<[string, string[]]>>()
  const getLsUserMoves = useZustandStore((state) => state.getLsUserMoves)
  // --------------hooks--------
  //Show Notifcation for 2 seconds
  useEffect(() => {
    const fadeOutTimer = setTimeout(() => setVisible(false), 2000)
    return () => clearTimeout(fadeOutTimer)
  }, [visible])

  //Hide
  useEffect(() => {
    setMoves(Object.entries(getLsUserMoves()))
  }, [getLsUserMoves])
  //-------------------------handlers--------------------------------

  //-----------------------render--------------------
  return (
    <main className="mt-20 flex w-full max-w-xs flex-col items-center justify-between text-sm dark:text-gray-600 ">
      {/* -------------------TITLE SECTION--------------- */}
      <section className="mb-5 flex w-full flex-col text-center dark:text-gray-400">
        {/* ---------------------------TITLE------------------------ */}
        <hgroup>
          <h1 className="title-font mb-2 text-3xl font-medium sm:text-4xl dark:text-white">
            Transitions
          </h1>
          <p className="mx-auto px-2 text-sm leading-relaxed lg:w-2/3">
            {`Learn every move into every other move`}
          </p>
        </hgroup>
      </section>
      {/* ----------END OF TITLE SECTION------------- */}
      <p className="text-default-500 text-small">Selected: {selected}</p>
      <p>into</p>
      <p>none selected</p>
      <section className="flex w-full">
        {/* //----------------------BASE MOVE----------------------- */}
        <article className="w-1/2 rounded-lg bg-slate-100 p-2 pb-10 dark:bg-gray-800 dark:bg-opacity-40">
          <h2 className="text-lg">Move A</h2>
          <div className="space-y-2">
            <div
              className="scrollbar scrollbar-thin scrollbar-thumb-rounded scrollbar-thumb-dark 
            h-64 overflow-y-scroll rounded p-4"
            >
              {moves &&
                moves.map(([category, moves], moveIndex) => (
                  <article key={moveIndex}>
                    <h3 className="mt-1 text-base font-bold">{category}</h3>
                    <section className="flex flex-col">
                      {moves.map((move, moveIndex) => (
                        <label key={moveIndex} className="mb-1">
                          <input
                            type="radio"
                            name="baseMove"
                            className="mr-2 text-blue-500"
                            value={move}
                            onChange={(e) => setSelected(e.target.value)}
                          />
                          {move}
                        </label>
                      ))}
                    </section>
                  </article>
                ))}
            </div>
          </div>
        </article>
        {/* -------------------MOVE B---------------- */}
        <article className="ml-1 w-1/2 rounded-lg bg-slate-100 p-2 pb-10 dark:bg-gray-800 dark:bg-opacity-40">
          <h2 className="text-lg">
            Move B<span className="text-4xs">{' 1/54'}</span>
          </h2>
          <div className="space-y-2">
            <div
              className="scrollbar scrollbar-thin scrollbar-thumb-rounded scrollbar-thumb-dark 
    h-64 overflow-y-scroll rounded p-4"
            >
              {moves &&
                moves.map(([category, moves], moveIndex) => (
                  <article key={moveIndex}>
                    <h3 className="mt-1 text-base font-bold">{category}</h3>
                    <section className="flex flex-col">
                      {moves.map((move, moveIndex) => (
                        <TriStateCheckbox key={moveIndex} text={move} />
                      ))}
                    </section>
                  </article>
                ))}
            </div>
          </div>
        </article>
        {/* ---------------END OF MODIFIER------------ */}
      </section>
      {/* //--------------------------END OF BASE MOVE------------------------------- */}

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
