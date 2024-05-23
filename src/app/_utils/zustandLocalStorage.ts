import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'
import {
  GlobalStateProperties,
  isGlobalStateV0,
  lsBlowups,
  lsDanceList,
  lsDrops,
  lsFloorwork,
  lsFlows,
  lsFootwork,
  lsFreezes,
  lsMisc,
  lsPower,
  lsSuicides,
  lsToprock,
  lsUserLearning,
  lsUserMoves,
  ZustandGlobalStore,
} from './localStorageTypes'

/**
 * Default Properties on the Zustand Local Storage Global
 */
export const initialState: GlobalStateProperties = {
  [lsFlows]: [],
  [lsUserMoves]: {
    [lsToprock]: [],
    [lsFootwork]: [],
    [lsPower]: [],
    [lsFreezes]: [],
    [lsFloorwork]: [],
    [lsSuicides]: [],
    [lsDrops]: [],
    [lsBlowups]: [],
    [lsMisc]: [],
  },
  [lsUserLearning]: [],
  [lsDanceList]: ['head', 'shoulders', 'knees'],
}

/**
 * Name of the key in browsers localStorage
 */
export const zustandLocalStorage = 'zustand-local-storage'

/**
 * Zustand Global Store State
 */
export const useZustandStore = create<ZustandGlobalStore>()( //ZustandGlobalStore type requires each "&" type to be initialised seperately in obj below
  persist( //persists in localstorage
    immer( //immer middleware for safe mutation
      (set, get) => ({
        //--------------------state----------------------
        ...initialState,

        //============root level===============
        //-----Setters (Root Level Keys)-----
        setLsFlows: (flows) => set({ [lsFlows]: flows }), 
        setLsUserMoves: (moves) => set({ [lsUserMoves]: moves }),
        setLsUserLearning: (learning) => set({ [lsUserLearning]: learning }), 
        setDanceList: (list) => set({ [lsDanceList]: list }),

        //-----Getters (Root level keys )------
        getLsFlows: () => get()[lsFlows],
        getLsUserMoves: () => get()[lsUserMoves], 
        getLsUserLearning: () => get()[lsUserLearning], 
        getDanceList: () => get()[lsDanceList],

        //============nested================
        //-------User Move Keys --------
        setLsUserMovesByKey: ( key: keyof GlobalStateProperties[typeof lsUserMoves],
          values: string[],
        ) => {
          return set((state) => {
            state[lsUserMoves][key] = [...values]
          })
        },
        getLsUserMovesByKey: (
          key: keyof GlobalStateProperties[typeof lsUserMoves],
        ) => {
          return get()[lsUserMoves][key]
        },

        //=================================
        //------Reinitialization----------
        replaceGlobalState: (zustandState) => set(zustandState.state),
        resetGlobalState: () => set(initialState),
      }),
    ),
    //-------------persist options---------------
    {
      name: zustandLocalStorage,
      version: 2,
      migrate: (persistedState, version) => {
        console.log('persistedState: ', persistedState)

        //migrating from 0 to current
        if (
          isGlobalStateV0(persistedState, version) &&
          migrationIsSafe(0, version)
        ) {
          let base = {
            ...persistedState,
            [lsUserMoves]: {
              //version0 = string[]. version2 = {[category]: string}
              ...initialState[lsUserMoves],
            },
          }
          //if there's existing footwork, reuse it
          if (persistedState[lsUserMoves].length > 0) {
            base[lsUserMoves][lsFootwork] = persistedState[lsUserMoves]
          }
          return base
        }
        return initialState
      },
    },
  ),
) //----------------------end of zustand store-------------------
//=====================================================================

//-----------------------helpers-----------------------
const migrationIsSafe = (oldVersion: number, currentVersion: number) => {
  if (oldVersion === 0 && currentVersion === 2) {
    return true
  }
  return false
}

//----------------------------------------------------
