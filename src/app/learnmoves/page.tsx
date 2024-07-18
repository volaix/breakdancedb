'use client'
import { useState, useEffect } from 'react'
import { Move } from '../_utils/zustandTypes'
import Link from 'next/link'
import { useZustandStore } from '../_utils/zustandLocalStorage'

/**
 * is Mapped to render moves that the user is currently learning
 * @param param0 move: Move
 * @returns jsx
 */
const RenderMoveBox = ({ move }: { move: Move }) => {
  return (
    <Link
      href={{ pathname: '/learnmoves/data', query: { moveId: move.moveId } }}
    >
      <div className="p-2 ">
        <div className="relative flex h-full flex-col overflow-hidden rounded-lg bg-gray-100 bg-opacity-75 px-3 pb-6 pt-5 text-center dark:bg-gray-800 dark:bg-opacity-40">
          <h2 className="title-font mb-1 text-[7px] font-medium tracking-widest text-gray-400 dark:text-gray-500">
            Learning
          </h2>
          <h1 className="title-font mb-1 text-[9px] font-medium text-gray-900 dark:text-white">
            <div className="overflow-hidden	text-ellipsis whitespace-nowrap">
              {move.displayName}
            </div>
          </h1>
        </div>
      </div>
    </Link>
  )
}

/**
 * Renders the /learnmoves page. Header, array of things learned, two buttons.
 * @returns jsx
 */
export default function RenderLearnMoves() {
  //---------------------state----------------
  const [learning, setLearning] = useState<Move[]>([])
  const getLsUserLearning = useZustandStore((state) => state.getLsUserLearning)

  //-----------------------useeffect-----------------------------------

  //get learning moves
  useEffect(() => {
    setLearning(getLsUserLearning())
  }, [getLsUserLearning])

  //---------------------render------------------------------------------------

  return (
    <main className="mt-20 px-5" style={{ width: '375px' }}>
      <>
        <h1 className="title-font mb-4 text-2xl font-medium text-gray-900 sm:text-3xl dark:text-white">
          Moves Learning
        </h1>
      </>

      <div className="flex w-full flex-wrap">
        {learning.length > 0 &&
          learning.map((move) => {
            return <RenderMoveBox key={move.moveId} move={move} />
          })}
      </div>
      <div>
        <a
          href="/learnmoves/newmove"
          className="mt-5 inline-flex items-center text-sm text-indigo-400"
        >
          add new move
          <svg
            className="ml-2 h-4 w-4"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="2"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M5 12h14"></path>
            <path d="M12 5l7 7-7 7"></path>
          </svg>
        </a>
      </div>
    </main>
  )
}
