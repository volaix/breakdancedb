'use client'
import { createContext } from 'react'

export const ComboIdContext = createContext<{
  updateCombos: () => void
  moveIndex: number
  comboId: string
} | null>(null)
