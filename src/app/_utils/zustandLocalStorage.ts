import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'
import {
  GlobalStateProperties,
  lsBattle,
  lsBlowups,
  lsCombos,
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
import { isGlobalStateV0, isGlobalStateV2 } from './migrationStates'

const currentVersion: number = 3

/**
 * Default Properties on the Zustand Local Storage Global
 */
export const initialState: GlobalStateProperties = {
  [lsFlows]: null,
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
export const useZustandStore = create<ZustandGlobalStore>()(
  //ZustandGlobalStore type requires each "&" type to be initialised seperately in obj below
  persist(
    //persists in localstorage
    immer(
      //immer middleware for safe mutation
      (set, get) => ({
        //--------------------state----------------------
        ...initialState,

        //============root level===============
        //-----Setters (Root Level Keys)-----
        setLsCombos: (combo, comboId) =>
          set((state) => {
            if (state[lsCombos]) {
              state[lsCombos][comboId] = combo
            } else {
              state[lsCombos] = { [comboId]: combo }
            }
          }),
        setLsFlows: (flows) => set({ [lsFlows]: flows }),
        setLsFlow: (flow, key) =>
          set((state) => {
            if (state[lsFlows] === null) {
              state[lsFlows] = { [key]: flow }
            } else {
              state[lsFlows][key] = flow
            }
          }),
        setLsUserMoves: (moves) => set({ [lsUserMoves]: moves }),
        setLsUserLearning: (learning) => set({ [lsUserLearning]: learning }),
        setDanceList: (list) => set({ [lsDanceList]: list }),
        setLsBattle: (battle) => set({ [lsBattle]: battle }),

        //-----Getters (Root level keys )------
        getLsFlows: () => get()[lsFlows],
        getLsBattle: () => get()[lsBattle],
        getLsCombos: () => get()[lsCombos],
        getLsUserMoves: () => get()[lsUserMoves],
        getLsUserLearning: () => get()[lsUserLearning],
        getDanceList: () => get()[lsDanceList],

        //============nested================
        //---------flows------
        deleteLsFlow: (key) => {
          return set((state) => {
            if (state[lsFlows] === null) return
            delete state[lsFlows][key]
          })
        },
        //---------combos---------
        getLsComboById(id) {
          return get()[lsCombos]?.[id] || null
        },
        //-------User Move Keys --------
        setLsUserMovesByKey: (
          key: keyof GlobalStateProperties[typeof lsUserMoves],
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
        replaceGlobalState: (importedState) => {
          console.log('comparing imported version of', importedState.version)
          console.log('to current version', currentVersion)
          if (importedState.version === currentVersion) {
            return set(importedState.state)
          } else {
            alert('version does not match. state not replaced.')
          }
        },
        resetGlobalState: () => set(initialState),
      }),
    ),
    //-------------persist options---------------
    {
      name: zustandLocalStorage,
      version: currentVersion,
      migrate: (persistedState, version) => {
        console.log('about to try migrate this data: ', persistedState)

        //migrating from 0 to 2
        if (
          isGlobalStateV0(persistedState, version) &&
          migrationIsSafe(0, version)
        ) {
          console.log('data migrating from v0 to v3')
          let base = {
            ...persistedState,
            [lsUserMoves]: {
              ...initialState[lsUserMoves],
              ...initialState[lsFlows],
            },
          }
          //if there's existing footwork, reuse it
          if (persistedState[lsUserMoves].length > 0) {
            base[lsUserMoves][lsFootwork] = persistedState[lsUserMoves]
          }
          return base
        }
        //migrating from 2 to 3
        if (
          isGlobalStateV2(persistedState, version) &&
          migrationIsSafe(2, version)
        ) {
          console.log('data migrating from v2 to v3')
          return {
            ...persistedState,
            [lsUserMoves]: {
              ...initialState[lsFlows],
            },
          }
        }
        console.log('data wiped and replaced to initialstate')
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
  if (oldVersion === 0 && currentVersion === 3) {
    return true
  }
  if (oldVersion === 2 && currentVersion === 3) {
    return true
  }
  return false
}

//----------------------------------------------------
