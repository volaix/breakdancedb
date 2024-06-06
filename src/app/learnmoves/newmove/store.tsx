'use client'
import { makeDefaultPosition } from '@/app/_utils/lsGenerators'
import { Position } from '@/app/_utils/lsTypes'
import { create } from 'zustand'
import rocks from '@/db/rocks.json'

/**
 *  Makes some default Position[] using only a number for how many to make
 * @param numberOfPositions
 * @returns Position[]
 */
const makeDefaultPositionsFromNumber = (
  numberOfPositions: number,
): Position[] => {
  const baseArray = Array.from(Array(numberOfPositions))
  const defaultPositions = baseArray.map((a, index) => {
    return makeDefaultPosition({
      displayName: `Position-${index + 1}-${rocks[Math.floor(Math.random() * rocks.length)]}`,
    })
  })
  return [...defaultPositions]
}

/**
 * Shared State for the newmove page.
 */
export const useMoveStore = create<moveStore>()((set) => ({
  moveName: '',
  positions: [],
  updateMove: (newText) => set(() => ({ moveName: newText })),
  updatePositions: (numberOfPositionsToMake: number) =>
    set(() => ({
      positions: makeDefaultPositionsFromNumber(numberOfPositionsToMake),
    })),
}))

/**
 * The Store for newmove
 */
export interface moveStore {
  moveName: string
  updateMove: (by: string) => void
  positions: Position[]
  updatePositions: (numberOfPositionsToMake: number) => void
}
