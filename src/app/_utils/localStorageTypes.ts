import { Brand } from './typehelpers'

//------------------ROOT STRUCTURE--------------
/**
 *
 * Structure of Local Storage
 */
export interface LocalStorageStructure {
  [lsFlows]: Flow[]
  [lsUserMoves]: string[]
  [lsUserLearning]: Move[]
}

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
 * Used to display movement groups in /learnmoves/data/learn
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
export type LocalStorageValues = LocalStorageStructure[LocalStorageKeys]

export type PositionId = Brand<string, 'PositionId'>
export type MovementId = Brand<string, 'MovementId'>
export type TransitionId = Brand<string, 'TransitionId'>
export type MoveId = Brand<string, 'MoveId'>

// ----------- Local Storage Keys -----------------
export const lsFlows = 'flows'
export const lsUserMoves = 'userMoves'
export const lsUserLearning = 'userLearning'
export type LocalStorageKeys = keyof LocalStorageStructure
