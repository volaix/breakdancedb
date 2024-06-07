'use client'
import { useEffect, useState } from 'react'
import { useZustandStore } from '../_utils/zustandLocalStorage'
import { BRAND } from 'zod'

import React from 'react'
import { MoveTransition, extractMoveTransitions } from '../_utils/lib'

// Assuming the `moves` array is an array of objects with name, inCount, and outCount attributes
interface CalcMove {
  category: string
  name: string
  inCount: number
  outCount: number
}
const extractCalcMove = (transitions: MoveTransition[]): CalcMove[] => {
  const localCalcMoveMap = new Map<string, CalcMove>()

  transitions.forEach(({ moveFrom: moveOut, moveTo: moveIn }) => {
    const outKey = `${moveOut.category}-${moveOut.displayName}`
    const inKey = `${moveIn.category}-${moveIn.displayName}`

    if (localCalcMoveMap.has(inKey)) {
      localCalcMoveMap.get(inKey)!.inCount += 1
    } else {
      localCalcMoveMap.set(inKey, {
        category: moveIn.category,
        name: moveIn.displayName,
        inCount: 1,
        outCount: 1,
      })
    }

    if (localCalcMoveMap.has(outKey)) {
      localCalcMoveMap.get(outKey)!.outCount += 1
    } else {
      localCalcMoveMap.set(outKey, {
        category: moveOut.category,
        name: moveOut.displayName,
        inCount: 1,
        outCount: 1,
      })
    }
  })
  return Array.from(localCalcMoveMap.values())
}
const Page = () => {
  // -----------------state-------------
  const [lsMoves, setLsMoves] =
    useState<Partial<Record<string & BRAND<'category'>, string[]>>>()
  const [calcMove, setCalcMove] = useState<CalcMove[]>()
  const getLsFlows = useZustandStore((state) => state.getLsFlows)
  const getLsUserMoves = useZustandStore((state) => state.getLsUserMoves)
  // ---------------hooks------------
  useEffect(() => {
    setCalcMove(extractCalcMove(extractMoveTransitions(getLsFlows())))
    setLsMoves(getLsUserMoves())
  }, [getLsFlows, getLsUserMoves])
  // -----------------render--------------
  return (
    <main className="mt-20 w-full dark:bg-gray-900">
      {/* ------------title------------- */}
      <hgroup className="mb-5 flex w-full flex-col text-center dark:text-gray-400">
        <h1 className="title-font mb-2 text-3xl font-medium sm:text-4xl dark:text-white">
          Stats
        </h1>
        <p className="mx-auto px-2 text-base leading-relaxed lg:w-2/3">
          {`View how connected your moves are. Gets transitions from flows.`}
        </p>
      </hgroup>
      {/* ---------------list------------ */}
      <article className="mx-2">
        {lsMoves &&
          Object.entries(lsMoves).map(([category, moves], lsMoveIndex) => {
            return (
              <article key={lsMoveIndex} className="mb-4">
                <h2 className="title-font text-2xl font-medium text-gray-900 dark:text-white">
                  {category}
                </h2>
                <ul>
                  <table>
                    <thead>
                      <tr>
                        <th>Move Name</th>
                        <th>Moves In</th>
                        <th>Moves Out</th>
                        {/* <th>From Transitions</th> */}
                        {/* <th>From Sets</th> */}
                      </tr>
                    </thead>
                    <tbody>
                      {moves &&
                        moves.map((move, moveIndex) => {
                          const data = calcMove?.find(
                            (calcMove) =>
                              calcMove.name === move &&
                              calcMove.category === category,
                          )
                          return (
                            <tr key={moveIndex} className="text-center">
                              {move ? (
                                <>
                                  <td>{move}</td>
                                  <td>{data ? data.inCount : 0}</td>
                                  <td>{data ? data.outCount : 0}</td>
                                </>
                              ) : (
                                <p>no moves to display</p>
                              )}
                            </tr>
                          )
                        })}
                    </tbody>
                  </table>
                </ul>
              </article>
            )
          })}
      </article>
    </main>
  )
}
export default Page
