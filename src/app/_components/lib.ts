import { Dispatch, SetStateAction, useEffect, useState } from 'react'
import { v4, validate } from 'uuid'

//-------------------------TYPE HELPERS-----------------------
/**
 * Brands a type by intersecting it with a type with a brand property based on
 * the provided brand string.
 * First Type passed is "your special string"
  eg used like: type PositionId = Brand<string, 'PositionId'>
 */
export type Brand<T, Brand extends string> = T & {
  readonly [B in Brand as `__${B}_brand`]: never
}

/**
 * Helper type function: Make optional fields required
 */
export type RequiredFields<T, K extends keyof T> = T & Required<Pick<T, K>>

/**
 * Helper: Makes only some things required
 */
type PartialBy<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>


/**
 * Helper that gets value of key in globalstorage
e.g. type lsUserMovesValue = lsValueByKey<typeof lsUserMoves>
 */
type lsValueByKey<T extends keyof LocalStorageStructure> = LocalStorageStructure[T]
type lsValueMove = lsValueByKey<typeof lsUserMoves>
type lsValueLearn = lsValueByKey<typeof lsUserLearning>
type lsValueFlow = lsValueByKey<typeof lsFlows>

//-------------------------------------------------------------
/**
 *
 * This function is responsible for handling parsing errors. If an error occurs during parsing, it will return undefined. Otherwise, it will return the parsed JSON value along with its corresponding data type.
 * @param toJsonParse requires a JSON string
 * @returns parsed JSON
 */
export const safeJsonParse = <T, F>(toJsonParse: string | null, fallback: F) => {
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
 * Hold type. Used to display holds and is found in globaldb (localstorage)
 */
export type Hold = {
  fromPosition: PositionId
  toPosition: PositionId
  transition: TransitionId
  displayName: string
  slowRating: number
  holdId: string
}

/**
 * Flow Type. Undeveloped and ratings will be added to it in future.
For now is just a record of RNG moves strung together.
 */
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
export type MoveId = Brand<string, 'MoveId'>

export interface MoveExecution {
  memorised: boolean
  slow: boolean
  normal: boolean
  fast: boolean
}
export type PositionId = Brand<string, 'PositionId'>

/**
 * Position object used in localstorage data structure. Usually found in an arrays.
 */
export type Position = {
  positionId: PositionId
  displayName: string
  imgUrl: string | null
  slowRating: number
  normal: boolean
  fast: boolean
}

export type TransitionId = Brand<string, 'TransitionId'>

/**
 * Transition object used in localstorage data structure
 */
export interface Transition {
  transitionId: TransitionId
  displayName: string
  from: PositionId
  to: PositionId
  slowRating: number
  normal: boolean
  fast: boolean
  possible: boolean
}

export type Transitions = Transition[]

/**
 * Main Move object in LocalStorage DB
 */
export interface Move {
  moveId: MoveId
  displayName: string
  displayImg?: string
  moveExecution?: MoveExecution
  positions?: Position[]
  transitions?: Transitions
  holds?: Hold[]
}

export type MovementKeys = 'positions' | 'transitions' | 'holds'

// ----------- Local Storage Keys -----------------

export const lsFlows = 'flows'
export const lsUserMoves = 'userMoves'
export const lsUserLearning = 'userLearning'
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
    setAccessToLocalStorage(typeof window !== 'undefined')
  }, [setAccessToLocalStorage])
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
  if (typeof val === 'object' && !Array.isArray(val) && val !== null) {
    const hasEntrymove = typeof (val as Flow).entryMove === 'string'
    const hasKeyMove = typeof (val as Flow).keyMove === 'string'
    const hasExitMove = typeof (val as Flow).exitMove === 'string'
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
  typeof val === 'string' && validate(val)

/**
 * Checks if the passed value is Move
 */
const isMove = (val: unknown): val is Move => {
  //check if object
  if (typeof val === 'object' && !Array.isArray(val) && val !== null) {
    let posMatchTrans = true
    //check if positions match transitions length. should be equal number of pos to trans
    if ((val as Move).positions) {
      posMatchTrans =
        (val as Move).positions?.length === (val as Move).transitions?.length
    }
    const hasMoveId = isMoveId((val as Move).moveId)
    const hasDisplayName = typeof (val as Move).displayName === 'string'
    return hasMoveId && hasDisplayName && posMatchTrans
  }
  return false
}

/**
 * Checks if the passed localstoragevalue is a Move[]
 */
const isMoveArr = (lsValue: LocalStorageValues): lsValue is Move[] => {
  if (Array.isArray(lsValue)) {
    //if is empty array, still considered moveArr
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
  Array.isArray(val) ? val.every((m) => typeof m === 'string') : false

/**
 *
 * Structure of Local Storage
 */
interface LocalStorageStructure {
  [lsFlows]: Flow[]
  [lsUserMoves]: string[]
  [lsUserLearning]: Move[]
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
    slowRating: 0,
    normal: false,
    fast: false,
  }
}
/**
 * Makes default Transition
 * @param
 * @returns
 */
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
    slowRating: 0,
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
  positions: Position[]
}): Transitions => {
  /**
   * gets position id using position[] and current index
   * @param {Position[]} posArray
   * @param {number} currIndex
   * @return positionid (a special string)
   */
  const getPositionId = (posArray: Position[], currIndex: number) => {
    const isLastThing = currIndex + 1 === posArray.length
    if (isLastThing) {
      return posArray[0].positionId
    } else {
      return posArray[currIndex].positionId
    }
  }
  //final
  return positions.map((position, index, posArray) => {
    return makeDefaultTransition({
      displayName: displayNames[index],
      from: position.positionId,
      to: getPositionId(posArray, index),
    })
  })
}

/**
 * makes default Positions using array of strings
 * @param displayNames
 * @returns position[]
 */
export const makePositions = (displayNames: string[]): Position[] =>
  displayNames.map((displayName) => makeDefaultPosition({ displayName }))

/**
 *  makes default names for transitions
 * @param numberOfTransitions
 * @returns string array
 */
export const makeDefaultTransitionNames = (
  numberOfTransitions: number,
): string[] =>
  Array.from(Array(numberOfTransitions)).map(
    (_, i) => `From Pos${i + 1} to Pos${i + 2}`,
  )

//-----------------------------------DB----------------------------
/**
 *
 * Upload to local storage.
 * This should be the only usage of localstorage.setItem
 * Delete all others.
 * @returns void
 */
export const updateLocalStorageGlobal = {
  [lsFlows]: (val: Flow[], accessToLocalStorage: boolean) => {
    //quit early if localstorage unaccessible
    if (!accessToLocalStorage)
      if (isFlowArr(val))
        //validation
        localStorage.setItem(lsFlows, JSON.stringify(val))
      else {
        console.log('failed validation')
      }
  },
  [lsUserMoves]: (val: string[], accessToLocalStorage: boolean) => {
    //quit early if localstorage unaccessible
    if (!accessToLocalStorage)
      if (isUserMoves(val)) {
        //validation
        localStorage.setItem(lsUserMoves, JSON.stringify(val))
      } else {
        console.log('failed validation')
      }
  },
  //--------------------LEARN MOVES PAGE------------
  [lsUserLearning]: (val: Move[], accessToLocalStorage: boolean) => {
    console.log('updating')
    //quit early if localstorage unaccessible
    if (!accessToLocalStorage) return

    console.log('validating')
    //validation
    if (isMoveArr(val)) {
      localStorage.setItem(lsUserLearning, JSON.stringify(val))
    } else {
      console.log('isMoveArr failed validation', val)
    }
  },
}

const isErrorInGetLocalStorage = ({ accessToLocalStorage }: { accessToLocalStorage: boolean }): boolean => {
  if (!accessToLocalStorage) {
    console.log('no access to local storage')
    return true
  }
  return false
}

/**
 * Object that has methods that Get from localstorage.
 * For consistency, should be the only usage of localStorage.getItem
In future this will probably be moved to BE when online functionality needs to happen.
 * @returns
 */
export const getLocalStorageGlobal = {
  [lsFlows]: (accessToLocalStorage: boolean, defaultReturn = []): lsValueFlow => {
    //error handling
    if (isErrorInGetLocalStorage({ accessToLocalStorage })) return defaultReturn
    //gets from localstorage
    return safeJsonParse<lsValueFlow, typeof defaultReturn>(localStorage.getItem(lsFlows), defaultReturn)
  },
  [lsUserMoves]: (accessToLocalStorage: boolean, defaultReturn = []): lsValueMove =>
    //validation and error handling
    isErrorInGetLocalStorage({ accessToLocalStorage }) ?
      defaultReturn
      //gets from localstorage
      : safeJsonParse<lsValueMove, typeof defaultReturn>(
        localStorage.getItem(lsUserMoves),
        defaultReturn
      )
  ,
  [lsUserLearning]: (accessToLocalStorage: boolean, defaultReturn = []): lsValueLearn => {
    //validation and error handling
    if (isErrorInGetLocalStorage({ accessToLocalStorage })) return defaultReturn

    //safely gets from localStorage
    return safeJsonParse<lsValueLearn, typeof defaultReturn>(
      localStorage.getItem(lsUserLearning),
      [],
    )
  },
}

//-----------------------------------------------------------------
