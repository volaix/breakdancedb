import {
  BasicMoveSchema,
  FlowDictionary,
  GlobalStateProperties,
  MoveSchema,
  PositionSchema,
} from './lsSchemas'
import {
  BasicFlowSchema,
  comboDictionarySchema,
  comboIdSchema,
  comboMoveSchema,
  comboValSchema,
  flowIdSchema,
  listOrderSchema,
  MoveExecutionSchema,
  moveIdSchema,
  MovementGroupSchema,
  movementIdSchema,
  positionIdSchema,
  roundIdSchema,
  RoundSchema,
  transitionIdSchema,
  TransitionSchema,
  TypeLoopOptions,
} from './lsSchemas'
import { Brand } from './typehelpers'
import { z } from 'zod'

//---------------Local Storage Values One Liners --------------------
export type Transitions = Transition[]
/* Any value of Any Local Storage Keys */
export type LocalStorageValues = GlobalStateProperties[LocalStorageKeys]

export type PositionId = z.infer<typeof positionIdSchema>
export type MovementId = z.infer<typeof movementIdSchema>
export type PositionTransitionId = z.infer<typeof transitionIdSchema>
export type MoveTransitionId = z.infer<typeof transitionIdSchema>
export type MoveId = z.infer<typeof moveIdSchema>
export type ComboId = z.infer<typeof comboIdSchema>
export type RoundId = z.infer<typeof roundIdSchema>
export type FlowId = z.infer<typeof flowIdSchema>

// ----------- Local Storage Keys -----------------
export const lsFlows = 'flows'
export const lsUserMoves = 'userMoves'
export const lsUserLearning = 'userLearning'
export const lsDanceList = 'danceList'
export const lsCombos = 'combos'
export const lsConcepts = 'concepts'
export const lsTransitions = 'moveTransitions'
export const lsBattle = 'battle'

//---------categories------- deprecated
export const lsToprock = 'toprock'
export const lsFootwork = 'footwork'
export const lsPower = 'power'
export const lsFreezes = 'freezes'
export const lsDrops = 'drops'

export type LocalStorageKeys = keyof GlobalStateProperties

//------------Local Storage Values ------------------
export type BasicFlow = z.infer<typeof BasicFlowSchema>
/**
 * Main Move object in LocalStorage DB
 */
export type Move = z.infer<typeof MoveSchema>
export type TypeLoopOptions = z.infer<typeof TypeLoopOptions>
/**
 * Used to display movement groups in /learnmoves/data/study
 */
export type MovementGroup = z.infer<typeof MovementGroupSchema>
/**
 * Used to show move execution. Possibly depreciating.
 */
export type MoveExecution = z.infer<typeof MoveExecutionSchema>
/**
 * Position object used in localstorage data structure. Usually found in an arrays.
 */
export type Position = z.infer<typeof PositionSchema>
export type Transition = z.infer<typeof TransitionSchema>
/**
 * Types of Properties on the Zustand Local Storage Global
 */
export type MoveCategories = keyof GlobalStateProperties[typeof lsUserMoves]
export type ComboMove = z.infer<typeof comboMoveSchema>
export type ComboVal = z.infer<typeof comboValSchema>
export type ComboDictionary = z.infer<typeof comboDictionarySchema>
export type ListOrder = z.infer<typeof listOrderSchema>
export type Round = z.infer<typeof RoundSchema>
export type FlowDictionary = z.infer<typeof FlowDictionary>
export type BasicMove = z.infer<typeof BasicMoveSchema>
export type GlobalStateProperties = z.infer<typeof GlobalStateProperties>

//----------------ZUSTAND----------------
/**
 * Types for the Zustand Middlewares, used with StateCreator generic
  For some reason when used makes TS errors. Possibly a package issue rather than dev error.
 */
type ZustandMiddlewareMutators = [
  ['zustand/persist', ZustandGlobalStore],
  ['zustand/immer', never],
]
/**
 * Type that has all properties and methods of globalstate
 */

export type ZustandGlobalStore = GlobalStateProperties & {
  //============root level===============
  //-----Setters (Root Level Keys)-----
  setLsTransitions: (
    transitions: GlobalStateProperties[typeof lsTransitions],
  ) => void
  setLsConcepts: (concepts: GlobalStateProperties[typeof lsConcepts]) => void
  setLsCombos: (
    combo: NonNullable<ComboDictionary[keyof ComboDictionary]>,
    comboId: ComboId,
  ) => void
  setLsFlows: (flows: GlobalStateProperties[typeof lsFlows]) => void
  setLsFlow: (flow: FlowDictionary[keyof FlowDictionary], key: FlowId) => void
  setLsUserMoves: (moves: GlobalStateProperties[typeof lsUserMoves]) => void
  setLsUserLearning: (learning: Move[]) => void
  setDanceList: (list: string[]) => void
  setLsBattle: (battle: GlobalStateProperties[typeof lsBattle]) => void
  //-----Getters (Root level keys )------
  getLsTransitions: () => GlobalStateProperties[typeof lsTransitions]
  getLsConcepts: () => GlobalStateProperties[typeof lsConcepts]
  getLsBattle: () => GlobalStateProperties[typeof lsBattle]
  getLsFlows: () => GlobalStateProperties[typeof lsFlows]
  getLsCombos: () => GlobalStateProperties[typeof lsCombos]
  getLsUserMoves: () => GlobalStateProperties[typeof lsUserMoves]
  getLsUserLearning: () => Move[]
  getDanceList: () => string[]
  // getState: () => GlobalStateProperties

  //============nested================
  //-------battle----------
  addRound: () => void
  //--------flows---------
  deleteLsFlow: (key: FlowId) => void
  //-------combos----------
  deleteLsCombo: (key: ComboId) => void
  getLsComboById: (id: ComboId) => ComboDictionary[keyof ComboDictionary] | null
  addComboMove: (
    comboId: ComboId,
    position: number,
    comboMove: z.infer<typeof comboMoveSchema>,
  ) => void
  deleteComboMove: (comboId: ComboId, position: number) => void
  upDownMoveComboPosition: (
    currentIndex: number,
    direction: 'up' | 'down',
  ) => void
  updateDisplayName: (comboId: ComboId, displayName: string) => void
  updateExecution: (comboId: ComboId, executionVal: number) => void
  //-------User Move Keys --------
  setLsUserMovesByKey: (
    key: keyof GlobalStateProperties[typeof lsUserMoves],
    values: string[],
  ) => void
  getLsUserMovesByKey: (
    key: keyof GlobalStateProperties[typeof lsUserMoves],
  ) => GlobalStateProperties[typeof lsUserMoves][KeyOfMoves]
  getLsUserMoveCategories: () => Array<KeyOfMoves>
  deleteUserMovesByKey: (
    key: keyof GlobalStateProperties[typeof lsUserMoves],
  ) => void
  //=================================
  //------Reinitialization----------
  replaceGlobalState: (state: {
    state: GlobalStateProperties
    version: number
  }) => void
  resetGlobalState: () => void
}

//------------alias-------------
export type KeyOfMoves = keyof GlobalStateProperties[typeof lsUserMoves]
