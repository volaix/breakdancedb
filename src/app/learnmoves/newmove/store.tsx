'use client';
import { create } from 'zustand';


export const useMoveStore = create<moveStore>()(set => ({
  moveName: 'helloworld',
  updateMove: newText => set(state => ({ moveName: newText })),
}))

export interface moveStore {
  moveName: string
  updateMove: (by: string) => void
}

