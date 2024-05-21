import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import {
  Flow,
  lsDanceList,
  lsFlows,
  lsUserLearning,
  lsUserMoves,
  Move,
} from './localStorageTypes'

export const zustandLocalStorage = 'zustand-local-storage'

/**
 * Types of Properties on the Zustand Local Storage Global
 */
type LocalStorageProperties = {
  [lsFlows]: Flow[]
  [lsUserMoves]: string[]
  [lsUserLearning]: Move[]
  [lsDanceList]: string[]
}

/**
 * Default Properties on the Zustand Local Storage Global
 */
const initialState: LocalStorageProperties = {
  [lsFlows]: [],
  [lsUserMoves]: [],
  [lsUserLearning]: [],
  [lsDanceList]: ['head', 'shoulders', 'knees'],
}

/**
 * Types of Methods on the Zustand Local Storage Global
 */
interface ZustandLocalStorage extends LocalStorageProperties {
  //setters
  setLsFlows: (flows: Flow[]) => void
  setLsUserMoves: (moves: string[]) => void
  setLsUserLearning: (learning: Move[]) => void
  setDanceList: (list: string[]) => void
  //getters
  getLsFlows: () => Flow[]
  getLsUserMoves: () => string[]
  getLsUserLearning: () => Move[]
  getDanceList: () => string[]
  //globals
  replaceGlobalState: (state: {
    state: LocalStorageProperties
    version: number
  }) => void
  resetGlobalState: () => void
}

/**
 * Zustand Global Store State
 */
export const useZustandStore = create<ZustandLocalStorage>()(
  persist(
    (set, get) => ({
      //properties
      ...initialState,
      //setters
      setLsFlows: (flows) => set({ [lsFlows]: flows }),
      setLsUserMoves: (moves) => set({ [lsUserMoves]: moves }),
      setLsUserLearning: (learning) => set({ [lsUserLearning]: learning }),
      setDanceList: (list) => set({ [lsDanceList]: list }),
      //getters
      getLsFlows: () => get()[lsFlows],
      getLsUserMoves: () => get()[lsUserMoves],
      getLsUserLearning: () => get()[lsUserLearning],
      getDanceList: () => get()[lsDanceList],
      //globals
      replaceGlobalState: (zustandState) => set(zustandState.state),
      resetGlobalState: () => set(initialState),
    }),
    {
      name: zustandLocalStorage,
    },
  ),
)
