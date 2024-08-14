'use client'
import { createContext } from 'react'
import { BRAND } from 'zod'

export const ComboIdContext = createContext<{
  updateCombos: () => void
  moveIndex: number
  comboId: string & BRAND<'ComboId'>
} | null>(null)
