'use client'
import {create} from 'zustand'

export const useMoveStore = create<moveStore>()(set => ({
  moveName: '',
  positions: [],
  updatePositions: newPosition => set(state => ({positions: newPosition})),
  updateMove: newText => set(state => ({moveName: newText})),
}))

export interface moveStore {
  moveName: string
  updateMove: (by: string) => void
  positions: string[]
}
