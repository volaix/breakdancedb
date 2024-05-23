import { create, StateCreator, StoreApi } from 'zustand'
import { persist, PersistOptions } from 'zustand/middleware'
import {
  Flow,
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
  lsTransitions,
  lsUserLearning,
  lsUserMoves,
  Move,
} from './localStorageTypes'
import { immer } from 'zustand/middleware/immer'
import { produce } from 'immer'

/**
 * Types for the Zustand Middlewares, used with StateCreator generic
  For some reason when used makes TS errors. Possibly a package issue rather than dev error.
 */
type ZustandMiddlewareMutators = [
  ['zustand/persist', ZustandGlobalStore],
  ['zustand/immer', never],
]

/**
 * Name of the key in browsers localStorage
 */
export const zustandLocalStorage = 'zustand-local-storage'

/**
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
    [lsTransitions]: string[]
    [lsBlowups]: string[]
    [lsMisc]: string[]
  }
  [lsUserLearning]: Move[]
  [lsDanceList]: string[]
}

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
    [lsTransitions]: [],
    [lsBlowups]: [],
    [lsMisc]: [],
  },
  [lsUserLearning]: [],
  [lsDanceList]: ['head', 'shoulders', 'knees'],
}

/**
 * Type that has all properties and methods of globalstate
 */
type ZustandGlobalStore = GlobalStateProperties & {
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

type GlobalStatePropertiesV0 = {
  [lsFlows]: Flow[]
  [lsUserMoves]: string[]
  [lsUserLearning]: Move[]
  [lsDanceList]: string[]
}

/**
 * Zustand Global Store State
 */
export const useZustandStore = create<ZustandGlobalStore>()(
  //requires each "&" type to be initialised seperately in obj below
  persist(
    //persists in localstorage
    immer(
      //immer middleware for safe mutation
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
        setLsUserMovesByKey: (
          key: keyof GlobalStateProperties[typeof lsUserMoves],
          values: string[],
        ) => {
          return set((state) => {
            console.log('state[lsUserMoves]: ', state[lsUserMoves])
            console.log('state: key', state[lsUserMoves][key])
            console.log('[...values]: ', [...values])
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
)

const migrationIsSafe = (oldVersion: number, currentVersion: number) => {
  if (oldVersion === 0 && currentVersion === 2) {
    return true
  }
  return false
}

const isGlobalStateV0 = (
  state: unknown,
  version: number,
): state is GlobalStatePropertiesV0 => {
  //wow this is a lazy validation. it'd be nice if zod was used in future to parse
  if (version === 0) {
    return true
  } else return false
}
