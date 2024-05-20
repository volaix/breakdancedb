import { safeJsonParse } from './lib'
import { lsFlows, lsUserLearning, lsUserMoves } from './localStorageTypes'
import { lsValueFlow, lsValueLearn, lsValueMove } from './typehelpers'

//-----------------------------------DB----------------------------
const isErrorInGetLocalStorage = ({
  accessToLocalStorage,
}: {
  accessToLocalStorage: boolean
}): boolean => {
  console.log('testing access to local storage')
  if (!accessToLocalStorage) {
    console.log('no access to local storage')
    return true
  }
  console.log('has access to local storage')
  return false
}
/**
 * Object that has methods that Get from localstorage.
 * For consistency, should be the only usage of localStorage.getItem
In future this will probably be moved to BE when online functionality needs to happen.
 * @returns
 */

export const getLocalStorageGlobal = {
  [lsFlows]: (
    accessToLocalStorage: boolean,
    defaultReturn = [],
  ): lsValueFlow => {
    //error handling
    if (isErrorInGetLocalStorage({ accessToLocalStorage })) return defaultReturn
    //gets from localstorage
    return safeJsonParse<lsValueFlow, typeof defaultReturn>(
      localStorage.getItem(lsFlows),
      defaultReturn,
    )
  },
  [lsUserMoves]: (
    accessToLocalStorage: boolean,
    defaultReturn = [],
  ): lsValueMove =>
    //validation and error handling
    isErrorInGetLocalStorage({ accessToLocalStorage })
      ? defaultReturn
      : //gets from localstorage
        safeJsonParse<lsValueMove, typeof defaultReturn>(
          localStorage.getItem(lsUserMoves),
          defaultReturn,
        ),

  [lsUserLearning]: (
    accessToLocalStorage: boolean,
    defaultReturn = [],
  ): lsValueLearn => {
    //validation and error handling
    if (isErrorInGetLocalStorage({ accessToLocalStorage })) return defaultReturn

    //safely gets from localStorage
    return safeJsonParse<lsValueLearn, typeof defaultReturn>(
      localStorage.getItem(lsUserLearning),
      [],
    )
  },
}
