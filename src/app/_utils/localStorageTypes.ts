import { Brand } from './typehelpers'

//----------------------------------------------
//------------Local Storage Values ------------------

/**
 * Flow Type. Undeveloped and ratings will be added to it in future.
For now is just a record of RNG moves strung together.
 */
export type Flow = {
  entryMove: string
  keyMove: string
  exitMove: string
}

/**
 * Main Move object in LocalStorage DB
 */
export interface Move {
  moveId: MoveId
  displayName: string
  displayImg?: string
  movements?: MovementGroup[]
  positions?: Position[] //13MAY24: decided to keep this as arr instead obj as in future displaying positions in order with the imgs might be relevant
  transitions?: Transitions
  moveExecution?: MoveExecution
  hasReverse?: boolean
  loopOption?: TypeLoopOptions
}

/**
 * Used in Move obj for what type of loop the move does
 */
export type TypeLoopOptions = {
  hasOppositeSide?: boolean
  none?: boolean
  sameDirectionLoop?: boolean
}

/**
 * Used to display movement groups in /learnmoves/data/study
 */
export type MovementGroup = {
  movementId: MovementId
  displayName: string
  positionId?: PositionId
  transitionId?: TransitionId
}

/**
 * Used to show move execution. Possibly depreciating.
 */
export interface MoveExecution {
  memorised: boolean
  slow: boolean
  normal: boolean
  fast: boolean
}
/**
 * Position object used in localstorage data structure. Usually found in an arrays.
 */
export type Position = {
  positionId: PositionId
  displayName: string
  imgUrl: string | null
  slowRating: number
  oppositeSideSlowRating?: number
  normal: boolean
  fast: boolean
}

/**
 * Transition object used in localstorage data structure
 */
export interface Transition {
  transitionId: TransitionId
  displayName: string
  oppositeSideSlowRating?: number
  from: PositionId
  to: PositionId
  slowRating: number
  normal: boolean
  fast: boolean
  possible: boolean
}

//---------------Local Storage Values One Liners --------------------
export type Transitions = Transition[]
/* Any value of Any Local Storage Keys */
export type LocalStorageValues = GlobalStateProperties[LocalStorageKeys]

export type PositionId = Brand<string, 'PositionId'>
export type MovementId = Brand<string, 'MovementId'>
export type TransitionId = Brand<string, 'TransitionId'>
export type MoveId = Brand<string, 'MoveId'>

// ----------- Local Storage Keys -----------------
export const lsFlows = 'flows'
export const lsUserMoves = 'userMoves'
export const lsUserLearning = 'userLearning'
export const lsDanceList = 'danceList'

export const lsToprock = 'toprock'
export const lsFootwork = 'footwork'
export const lsPower = 'power'
export const lsFreezes = 'freezes'
export const lsFloorwork = 'floorwork'
export const lsSuicides = 'suicides'
export const lsDrops = 'drops'
export const lsBlowups = 'blowups'
export const lsMisc = 'misc'

export type LocalStorageKeys = keyof GlobalStateProperties /**
 * Types of Properties on the Zustand Local Storage Global
 */

export type GlobalStateProperties = {
  [lsFlows]: Flow[]
  [lsUserMoves]: {
    [lsToprock]: string[]
    [lsFootwork]: string[]
    [lsPower]: string[]
    [lsFreezes]: string[]
    [lsFloorwork]: string[]
    [lsSuicides]: string[]
    [lsDrops]: string[]
    [lsBlowups]: string[]
    [lsMisc]: string[]
  }
  [lsUserLearning]: Move[]
  [lsDanceList]: string[]
}
/**
 * Types for the Zustand Middlewares, used with StateCreator generic
  For some reason when used makes TS errors. Possibly a package issue rather than dev error.
 */
type ZustandMiddlewareMutators = [
  ['zustand/persist', ZustandGlobalStore],
  ['zustand/immer', never],
]
export type GlobalStatePropertiesV0 = {
  [lsFlows]: Flow[]
  [lsUserMoves]: string[]
  [lsUserLearning]: Move[]
  [lsDanceList]: string[]
}
/**
 * Type that has all properties and methods of globalstate
 */

export type ZustandGlobalStore = GlobalStateProperties & {
  //============root level===============
  //-----Setters (Root Level Keys)-----
  setLsFlows: (flows: Flow[]) => void
  setLsUserMoves: (moves: GlobalStateProperties[typeof lsUserMoves]) => void
  setLsUserLearning: (learning: Move[]) => void
  setDanceList: (list: string[]) => void
  //-----Getters (Root level keys )------
  getLsFlows: () => Flow[]
  getLsUserMoves: () => GlobalStateProperties[typeof lsUserMoves]
  getLsUserLearning: () => Move[]
  getDanceList: () => string[]

  //============nested================
  //-------User Move Keys --------
  setLsUserMovesByKey: (
    key: keyof GlobalStateProperties[typeof lsUserMoves],
    values: string[],
  ) => void
  getLsUserMovesByKey: (
    key: keyof GlobalStateProperties[typeof lsUserMoves],
  ) => string[]
  //=================================
  //------Reinitialization----------
  replaceGlobalState: (state: {
    state: GlobalStateProperties
    version: number
  }) => void
  resetGlobalState: () => void
}
/**
 * validator if state is version 0 of globalstateproperties
 * @param state localstorage
 * @param version state version
 * @returns boolean
 */
export const isGlobalStateV0 = (
  state: unknown,
  version: number,
): state is GlobalStatePropertiesV0 => {
  //wow this is a lazy validation. it'd be nice if zod was used in future to parse
  if (version === 0) {
    return true
  } else return false
}
