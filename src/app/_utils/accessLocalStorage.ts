import { safeJsonParse } from './lib'
import { lsValueFlow, lsValueMove, lsValueLearn } from './typehelpers'
import { lsFlows, lsUserMoves, lsUserLearning } from './localStorageTypes'
import { isFlowArr, isUserMoves, isMoveArr } from './lsValidation'
import { Flow } from './localStorageTypes'

import { Move } from './localStorageTypes'


//-----------------------------------DB----------------------------
/**
 *
 * Upload to local storage.
 * This should be the only usage of localstorage.setItem
 * Delete all others.
 * @returns void
 */
export const updateLocalStorageGlobal = {
  //------------------updates "flows" key in localstorage------------
  [lsFlows]: (val: Flow[], accessToLocalStorage: boolean) => {
    //quit early if localstorage unaccessible
    if (!accessToLocalStorage) {
      return
    }

    if (isFlowArr(val)) {
      //validation
      localStorage.setItem(lsFlows, JSON.stringify(val))
    } else {
      console.log('failed validation')
    }
  },
  //------------------updates "userMoves" key in localstorage------------
  [lsUserMoves]: (val: string[], accessToLocalStorage: boolean) => {
    //quit early if localstorage unaccessible
    if (!accessToLocalStorage) {
      return
    }

    if (isUserMoves(val)) {
      //validation
      localStorage.setItem(lsUserMoves, JSON.stringify(val))
    } else {
      console.log('failed validation')
    }
  },
  //------------------updates "userLearning" key in localstorage------------
  //most used in /learnmoves
  [lsUserLearning]: (val: Move[], accessToLocalStorage: boolean) => {
    console.log('updating')
    //quit early if localstorage unaccessible
    if (!accessToLocalStorage) {
      return
    }

    console.log('validating')
    //validation
    if (isMoveArr(val)) {
      console.log('passed validation and setting in local storage')
      localStorage.setItem(lsUserLearning, JSON.stringify(val))
      console.log('successfully data in localstorage')
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
      ),

  [lsUserLearning]: (accessToLocalStorage: boolean, defaultReturn = []): lsValueLearn => {
    //validation and error handling
    if (isErrorInGetLocalStorage({ accessToLocalStorage })) return defaultReturn

    //safely gets from localStorage
    return safeJsonParse<lsValueLearn, typeof defaultReturn>(
      localStorage.getItem(lsUserLearning),
      []
    )
  },
}
