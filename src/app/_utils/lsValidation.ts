import { LocalStorageValues, lsUserMoves } from './localStorageTypes'
import { validate } from 'uuid'
import { Flow, MoveId, Move } from './localStorageTypes'
import { initialState, GlobalStateProperties } from './zustandLocalStorage'

/**
 * Checks if localStorageValue is a Flow[]
 */
export const isFlowArr = (lsValue: LocalStorageValues): lsValue is Flow[] => {
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
    const hasMoveId = isMoveId((val as Move).moveId)
    const hasDisplayName = typeof (val as Move).displayName === 'string'
    return hasMoveId && hasDisplayName
  }
  return false
}

/**
 * Checks if the passed localstoragevalue is a Move[]
 */
export const isMoveArr = (lsValue: LocalStorageValues): lsValue is Move[] => {
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
export const isUserMoves = (val: unknown): val is string[] =>
  Array.isArray(val) ? val.every((m) => typeof m === 'string') : false /**

 * Checks if the passed value is Flow
 */
export const isFlow = (val: unknown): val is Flow => {
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
 * Checks if param is a key of [lsUserMoves]
 */
export const isValidUserMoveKey = (key: string): key is keyof GlobalStateProperties[typeof lsUserMoves] => {
  if (initialState[lsUserMoves][key as keyof GlobalStateProperties[typeof lsUserMoves]]) {
    return true
  }
  return false
}
