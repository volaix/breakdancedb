import { Dispatch, SetStateAction, useEffect, useState } from "react"
import { v4 as makeId, v4, validate } from "uuid"

/**
 * Brands a type by intersecting it with a type with a brand property based on
 * the provided brand string.
 * First Type passed is "your special string"
 */
export type Brand<T, Brand extends string> = T & {
  readonly [B in Brand as `__${B}_brand`]: never
}
/**
 * 
 * This function is responsible for handling parsing errors. If an error occurs during parsing, it will return undefined. Otherwise, it will return the parsed JSON value along with its corresponding data type.
 * @param
 * @returns parsed JSON
 */
export const safeJsonParse = <T, F>(toJsonParse: string, fallback: F) => {
  try {
    const jsonValue: T = JSON.parse(
      toJsonParse)
    return jsonValue
  } catch {
    return fallback as F
  }
}

/**
 *
 * Makes a singular Move
 * @returns Move
 */
export const makeMove = ({
  moveName,
  positions,
  transitions,
}: {
  moveName: string
  positions: Positions
  transitions: Transitions
}): Move => {
  const move = {
    displayName: moveName,
    moveExecution: makeDefaultMoveExec(),
    positions,
    transitions,
    moveId: makeMoveId(),
  }
  return move
}
export const makeDefaultMoveExec = (): MoveExecution => {
  return {
    memorised: true,
    slow: true,
    normal: true,
    fast: false,
  }
}

export type Flow = {
  entryMove: string
  keyMove: string
  exitMove: string
}

export const makeMoveId = (): MoveId => {
  return v4() as MoveId
}
export const makePositionId = (): PositionId => {
  return v4() as PositionId
}
export const makeTransitionId = (): TransitionId => {
  return v4() as TransitionId
}
export type MoveId = Brand<string, "MoveId">
export interface MoveExecution {
  memorised: boolean
  slow: boolean
  normal: boolean
  fast: boolean
}
export type PositionId = Brand<string, "PositionId">

export type Position = {
  positionId: PositionId
  displayName: string
  imgUrl: string | null
  slow: boolean
  normal: boolean
  fast: boolean
}

export type Positions = Position[]

export type TransitionId = Brand<string, "TransitionId">
export interface Transition {
  transitionId: TransitionId
  displayName: string
  from: PositionId
  to: PositionId
  slow: boolean
  normal: boolean
  fast: boolean
  possible: boolean
}

export type Transitions = Transition[]

export interface Move {
  moveId: MoveId
  displayName: string
  displayImg?: string
  moveExecution?: MoveExecution
  positions?: Positions
  transitions?: Transitions
}

/**
 *
 * Refactor all localstorage.getitem
 */
export const getUserLearning = (): Move[] => {
  if (localStorage.getItem(lsUserLearning) === null) {
    return []
  }
  return JSON.parse(localStorage.getItem(lsUserLearning) || "") || []
}



// ----------- Local Storage Keys -----------------

export const lsFlows = "flows"
export const lsUserMoves = "userMoves"
export const lsUserLearning = "userLearning"
export type LocalStorageKeys = keyof LocalStorageStructure

// ------------------------------------------------

/**
 *
 * Helper Hook that checks if can access local storage
 */
export const useLocalStorage = (
  setAccessToLocalStorage: Dispatch<SetStateAction<boolean>>,
) => {
  useEffect(() => {
    setAccessToLocalStorage(typeof window !== "undefined")
  }, [setAccessToLocalStorage])
}

/**
 *
 * Structure of Local Storage
 */
interface LocalStorageStructure {
  [lsFlows]: Flow[]
  [lsUserMoves]: string[]
  [lsUserLearning]: Move[]
}

/**
 * Any value of Any Local Storage Keys
 */
export type LocalStorageValues = LocalStorageStructure[LocalStorageKeys]

/**
 * Type of Flow as key and Flow object array as value
 */
type FlowRecord = Record<typeof lsFlows, Flow[]>

/**
 * Checks if the passed value is Flow
 */
const isFlow = (val: unknown): val is Flow => {
  //check if it's an object
  if (typeof val === "object" && !Array.isArray(val) && val !== null) {
    const hasEntrymove = typeof (val as Flow).entryMove === "string"
    const hasKeyMove = typeof (val as Flow).keyMove === "string"
    const hasExitMove = typeof (val as Flow).exitMove === "string"
    return hasEntrymove && hasKeyMove && hasExitMove
  }
  return false
}

/**
 * Checks if localStorageValue is a Flow[]
 */
const isFlowArr = (lsValue: LocalStorageValues): lsValue is Flow[] => {
  if (Array.isArray(lsValue)) {
    if (lsValue.length === 0) {
      return true
    } else if (isFlow(lsValue[0])) {
      return true
    }
  } else {
    return false
  }
  return false
}

/**
 * Checks if the passed value is a typeof moveid
 */
const isMoveId = (val: unknown): val is MoveId =>
  typeof val === "string" && validate(val)

/**
 * Checks if the passed value is Move
 */
const isMove = (val: unknown): val is Move => {
  //check if object
  if (typeof val === "object" && !Array.isArray(val) && val !== null) {
    const hasMoveId = isMoveId((val as Move).moveId)
    const hasDisplayName = typeof (val as Move).displayName === "string"
    return hasMoveId && hasDisplayName
  }
  return false
}

/**
 * Checks if the passed localstoragevalue is a Move[]
 */
const isMoveArr = (lsValue: LocalStorageValues): lsValue is Move[] => {
  if (Array.isArray(lsValue)) {
    if (lsValue.length === 0) {
      return true
    } else if (isMove(lsValue[0])) {
      return true
    }
  } else {
    return false
  }
  return false
}

/**
 *  makes sure val is an array of strings
 * @param
 * @returns boolean
 */
const isUserMoves = (val: unknown): val is string[] =>
  Array.isArray(val) ? val.every((m) => typeof m === "string") : false

/**
 *
 * Upload to local storage.
 * This should be the only usage of localstorage.setItem
 * Delete all others.
 * @returns void
 */
export const updateLocalStorageGlobal = {
  [lsFlows]: (val: Flow[], accessToLocalStorage: boolean) => {
    if (!accessToLocalStorage) return
    isFlowArr(val) && localStorage.setItem(lsFlows, JSON.stringify(val))
  },
  [lsUserMoves]: (val: string[], accessToLocalStorage: boolean) => {
    if (!accessToLocalStorage) return
    isUserMoves(val) && localStorage.setItem(lsUserMoves, JSON.stringify(val))
  },
  [lsUserLearning]: (val: Move[], accessToLocalStorage: boolean) => {
    if (!accessToLocalStorage) return
    isMoveArr(val) && localStorage.setItem(lsUserLearning, JSON.stringify(val))
  },
}

export const makeDefaultPosition = ({
  displayName,
}: {
  displayName: string
}): Position => {
  return {
    displayName,
    positionId: makePositionId(),
    imgUrl: null,
    slow: true,
    normal: false,
    fast: false,
  }
}
export const makeDefaultTransition = ({
  displayName,
  from,
  to,
}: {
  displayName: string
  from: PositionId
  to: PositionId
}): Transition => {
  return {
    displayName,
    transitionId: makeTransitionId(),
    from,
    to,
    slow: false,
    normal: false,
    fast: false,
    possible: true,
  }
}

/**
 *
 * Make move transitions
 * @returns Transitions
 */
export const makeTransitions = ({
  displayNames,
  positions,
}: {
  displayNames: string[]
  positions: Positions
}): Transitions => {
  const getPositionId = (posArray: Positions, currIndex: number) => {
    const isLastThing = currIndex + 1 === posArray.length
    if (isLastThing) {
      return posArray[0].positionId
    } else {
      return posArray[currIndex].positionId
    }
  }
  const transitions = positions.map((position, index, posArray) => {
    return makeDefaultTransition({
      displayName: displayNames[index],
      from: position.positionId,
      to: getPositionId(posArray, index),
    })
  })
  return transitions
}
export const makePositions = (displayNames: string[]): Positions => {
  const positions = displayNames.map((displayName) =>
    makeDefaultPosition({ displayName }),
  )
  return positions
}
export const makeDefaultTransitionNames = (
  numberOfTransitions: number,
): string[] => {
  return Array.from("transition name default".repeat(numberOfTransitions))
}
