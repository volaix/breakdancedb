'use client'
import { useState, useEffect } from 'react'
import { Move, MoveExecution, Position, Transition, getLocalStorageGlobal, lsUserLearning, useLocalStorage } from '@/app/lib'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'




/**
 * Calculates % learned of move positions
 */
const calcPercentageOfPositions = (positions: Position[]): string => {
  const percentOfEachPiece = 100 / (positions.length * 3)
  let totalPercent = 0
  for (let pos = 0; pos < positions.length; pos++) {
    if (positions[pos].slow) {
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
    if (transition[pos].slow) {
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
const calcPercentageOfMoveSpeeds = (moveExecution: MoveExecution | null): string => {
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
    const selectedMove = allMoves.find(obj => obj.moveId === moveId)
    setMove(selectedMove || null)
  }, [accessToLocalStorage, moveId])

  const numberOfPositions = move?.positions?.length
  const numberOfTransitions = move?.transitions?.length
  return (
    <section className="text-gray-600 body-font">
      <div className="container px-5 py-24 mx-auto max-w-se">
        <div className="flex flex-col text-center w-full mb-8">
          <h1 className="dark:text-white sm:text-4xl text-3xl font-medium title-font mb-2 text-gray-900">
            {move?.displayName}
          </h1>
          <p className="lg:w-2/3 mx-auto leading-relaxed text-base">
            Youve mastered this move 20%
          </p>
          <div className="lg:w-2/3 text-xs mx-auto leading-relaxed text-base">
            <li>{`${numberOfPositions} positions: ${calcPercentageOfPositions(move?.positions || [])} done`}</li>
            <li>{`${numberOfTransitions} transitions: ${calcPercentageOfTransition(move?.transitions || [])} done`}</li>
            <li>{`3 Move Speeds: ${calcPercentageOfMoveSpeeds(move?.moveExecution || null)} done`}</li>
          </div>
        </div>
        <div className="items-center flex flex-col">
          {move && <Link className="py-2"
            href={{ pathname: "/learnmoves/move/learn", query: { moveId: move.moveId, speed: 'slow' } }}>
            <button className="w-full flex ml-auto text-white bg-indigo-500 border-0 py-2 px-6 focus:outline-none hover:bg-indigo-600 rounded">
              Learn Move</button>
          </Link>}
          {move && <Link
            href={{ pathname: "/learnmoves/move/editpositions", query: { moveId: move.moveId } }}>
            <button className="py-2 flex ml-auto text-white bg-indigo-500 border-0 py-2 px-6 focus:outline-none hover:bg-indigo-600 rounded">Edit Positions</button>
          </Link>}
        </div>
      </div>
    </section >
  )
}

const RenderPage = () => {
  return (
    <div>
      <RenderTable />
    </div>
  )
}

export default RenderPage
