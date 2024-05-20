import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

import {
  Flow,
  LocalStorageStructure,
  lsFlows,
  lsUserLearning,
  lsUserMoves,
  Move,
} from './localStorageTypes'

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
}

export const useZustandStore = create<ZustandLocalStorage>()(
  persist(
    (set, get) => ({
      [lsFlows]: [],
      [lsUserMoves]: [],
      [lsUserLearning]: [],
      //setters
      setLsFlows: (flows) => set({ [lsFlows]: flows }),
      setLsUserMoves: (moves) => set({ [lsUserMoves]: moves }),
      setLsUserLearning: (learning) => set({ [lsUserLearning]: learning }),
    }),
    {
      name: 'zustand-local-storage',
    },
  ),
)
