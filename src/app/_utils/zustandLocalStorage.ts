import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import {
  Flow,
  lsFlows,
  lsUserLearning,
  lsUserMoves,
  Move,
} from './localStorageTypes'

export const zustandLocalStorage = 'zustand-local-storage'

interface ZustandLocalStorage {
  //-----------properties-----------
  [lsFlows]: Flow[]
  [lsUserMoves]: string[]
  [lsUserLearning]: Move[]
  //------------methods------------
  //setters
  setLsFlows: (flows: Flow[]) => void
  setLsUserMoves: (moves: string[]) => void
  setLsUserLearning: (learning: Move[]) => void
  //getters
  getLsFlows: () => Flow[]
  getLsUserMoves: () => string[]
  getLsUserLearning: () => Move[]
}

export const useZustandStore = create<ZustandLocalStorage>()(
  persist(
    (set, get) => ({
      //properties
      [lsFlows]: [],
      [lsUserMoves]: [],
      [lsUserLearning]: [],
      //setters
      setLsFlows: (flows) => set({ [lsFlows]: flows }),
      setLsUserMoves: (moves) => set({ [lsUserMoves]: moves }),
      setLsUserLearning: (learning) => set({ [lsUserLearning]: learning }),
      //getters
      getLsFlows: () => get()[lsFlows],
      getLsUserMoves: () => get()[lsUserMoves],
      getLsUserLearning: () => get()[lsUserLearning],
    }),
    {
      name: zustandLocalStorage,
    },
  ),
)
