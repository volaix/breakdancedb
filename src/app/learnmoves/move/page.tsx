'use client'
import { useState, useEffect } from 'react'
import {
  Move,
  MoveExecution,
  Position,
  Transition,
  getLocalStorageGlobal,
  lsUserLearning,
  useLocalStorage,
} from '@/app/lib'
import { Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import  LoadingFallback  from '@/app/LoadingFallback'

/**
 * Calculates % learned of move positions
 */
const calcPercentageOfPositions = (positions: Position[]): string => {
  const percentOfEachPiece = 100 / (positions.length * 3)
  let totalPercent = 0
  for (let pos = 0; pos < positions.length; pos++) {
    if (positions[pos].slowRating) {
      totalPercent += percentOfEachPiece
    } else if (positions[pos].normal) {
      totalPercent += percentOfEachPiece
    } else if (positions[pos].fast) {
      totalPercent += percentOfEachPiece
    }
  }
  return Math.round(totalPercent) + '%'
}

/**
 * Calculates % learned of move transitions
 */
const calcPercentageOfTransition = (transition: Transition[]): string => {
  let totalPossibilities = 0
  //Some moves are not possible. Therefore don't count them as a possibility when calculating %
  for (let a = 0; a < transition.length; a++) {
    if (transition[a].possible) {
      totalPossibilities++
    }
  }

  const percentOfEachPiece = 100 / totalPossibilities

  let totalPercent = 0
  for (let pos = 0; pos < transition.length; pos++) {
    if (transition[pos].slowRating) {
      totalPercent += percentOfEachPiece
    } else if (transition[pos].normal) {
      totalPercent += percentOfEachPiece
    } else if (transition[pos].fast) {
      totalPercent += percentOfEachPiece
    }
  }
  return Math.round(totalPercent) + '%'
}

/**
 * Calculates % learned the 3 move speeds
 */
const calcPercentageOfMoveSpeeds = (
  moveExecution: MoveExecution | null,
): string => {
  if (!moveExecution) {
    return '%'
  }
  const percentOfEachPiece = 100 / 3
  let totalPercent = 0
  if (moveExecution.fast) {
    totalPercent += percentOfEachPiece
  }
  if (moveExecution.normal) {
    totalPercent += percentOfEachPiece
  }
  if (moveExecution.slow) {
    totalPercent += percentOfEachPiece
  }
  return Math.round(totalPercent) + '%'
}

const RenderTable = () => {
  const [accessToLocalStorage, setAccessToLocalStorage] = useState(false)
  const [move, setMove] = useState<Move | null>(null)
  const searchParams = useSearchParams()
  const moveId: string | null = searchParams?.get('moveId') || null

  useLocalStorage(setAccessToLocalStorage)

  //get learning moves
  useEffect(() => {
    const allMoves = getLocalStorageGlobal[lsUserLearning](accessToLocalStorage)
    const selectedMove = allMoves.find((obj) => obj.moveId === moveId)
    setMove(selectedMove || null)
  }, [accessToLocalStorage, moveId])

  const numberOfPositions = move?.positions?.length
  const numberOfTransitions = move?.transitions?.length
  return (
    <section className="body-font text-gray-600">
      <div className="container mx-auto max-w-se px-5 py-24">
        <div className="mb-8 flex w-full flex-col text-center">
          <h1 className="title-font mb-2 text-3xl font-medium text-gray-900 sm:text-4xl dark:text-white">
            {move?.displayName}
          </h1>
          <p className="mx-auto text-base leading-relaxed lg:w-2/3">
            Youve mastered this move 20%
          </p>
          <div className="mx-auto text-base text-xs leading-relaxed lg:w-2/3">
            <li>{`${numberOfPositions} positions: ${calcPercentageOfPositions(move?.positions || [])} done`}</li>
            <li>{`${numberOfTransitions} transitions: ${calcPercentageOfTransition(move?.transitions || [])} done`}</li>
            <li>{`3 Move Speeds: ${calcPercentageOfMoveSpeeds(move?.moveExecution || null)} done`}</li>
          </div>
        </div>
        <div className="flex flex-col items-center">
          {move && (
            <Link
              className="py-2"
              href={{
                pathname: '/learnmoves/move/learn',
                query: { moveId: move.moveId, speed: 'slow' },
              }}
            >
              <button className="ml-auto flex w-full rounded border-0 bg-indigo-500 px-6 py-2 text-white hover:bg-indigo-600 focus:outline-none">
                Learn Move
              </button>
            </Link>
          )}
          {move && (
            <Link
              href={{
                pathname: '/learnmoves/move/editpositions',
                query: { moveId: move.moveId },
              }}
            >
              <button className="ml-auto flex rounded border-0 bg-indigo-500 px-6 py-2 py-2 text-white hover:bg-indigo-600 focus:outline-none">
                Edit Positions
              </button>
            </Link>
          )}
        </div>
      </div>
    </section>
  )
}

const RenderPage = () => {
  return (
    <div>
      <Suspense fallback={<LoadingFallback />}>
        <RenderTable />
      </Suspense>
    </div>
  )
}

export default RenderPage
