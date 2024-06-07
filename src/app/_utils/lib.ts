import rocks from '@/db/rocks.json'
import { Dispatch, SetStateAction, useEffect, useState } from 'react'
import {
  BasicMove,
  ComboId,
  GlobalStateProperties,
  Round,
  lsFlows,
} from './lsTypes'

//---------------JS HELPERS-------------------
/**
 *
 * This function is responsible for handling parsing errors. If an error occurs during parsing, it will return undefined. Otherwise, it will return the parsed JSON value along with its corresponding data type.
 * @param toJsonParse requires a JSON string
 * @returns parsed JSON
 */
export const safeJsonParse = <T, F>(
  toJsonParse: string | null,
  fallback: F,
) => {
  //handling if toJsonParse is null
  if (!toJsonParse) return fallback as F
  try {
    const jsonValue: T = JSON.parse(toJsonParse)
    return jsonValue
  } catch {
    return fallback as F
  }
}

/**
 * Makes a random rock name
 */
export const randomNameGen = (): string =>
  `${rocks[Math.floor(Math.random() * rocks.length)]}`

// -------------REACT CUSTOM HOOKS--------------------------
/**
 *
 * Helper Hook that checks if can access local storage
 */
export const useLocalStorage = (
  setAccessToLocalStorage: Dispatch<SetStateAction<boolean>>,
) => {
  useEffect(() => {
    setAccessToLocalStorage(typeof window !== 'undefined')
  }, [setAccessToLocalStorage])
}

//----------UTILITY---------
export const extractComboIds = (rounds: Round[]): ComboId[] =>
  rounds
    //gets [ ComboId[], ComboId[], ... ]
    .map(
      (round) =>
        round.comboList
          ?.filter((item) => item.type === 'combo' && item.id !== undefined)
          .map((item) => item.id as ComboId) || [],
    )
    //Flats to ComboId[]
    .flat(1)

export type MoveTransition = {
  moveFrom: BasicMove
  moveTo: BasicMove
}

export const extractMoveTransitions = (
  flows: GlobalStateProperties[typeof lsFlows],
): MoveTransition[] => {
  if (flows === null) return []
  return Object.values(flows).flatMap((flowVal): MoveTransition[] => {
    if (!flowVal) return []
    const { entryMove, keyMove, exitMove } = flowVal
    const midMove: BasicMove = {
      category: keyMove.category,
      displayName: keyMove.displayName,
    }
    return [
      {
        moveFrom: {
          category: entryMove.category,
          displayName: entryMove.displayName,
        },
        moveTo: midMove,
      },
      {
        moveFrom: midMove,
        moveTo: {
          category: exitMove.category,
          displayName: exitMove.displayName,
        },
      },
    ]
  })
}
//---------ROUTING----------

export const comboIdKey = 'comboId'
