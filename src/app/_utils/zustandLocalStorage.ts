import { create } from 'zustand'
import { persist } from 'zustand/middleware'

import {
  Flow,
  lsFlows,
  lsUserLearning,
  lsUserMoves,
  Move,
} from './localStorageTypes'

/*
  Migration Timeline:
  //P1: CURRENT - DUPLICATION OF DATA ZUSTAND LOCAL STORAGE
  P2: current - RETRIEVAL OF DATA FROM ZUSTAND LOCAL STORAGE
  //P3: FUTURE - DELETION OF WRITING TO NORMAL LOCAL STORAGE
  P4: FUTURE - DELETION OF READING NORMAL LOCAL STORAGE
*/

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
      name: 'zustand-local-storage',
    },
  ),
)
