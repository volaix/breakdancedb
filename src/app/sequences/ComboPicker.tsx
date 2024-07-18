'use client'

import { useCallback, useEffect, useState } from 'react'
import { ComboDictionary, ComboId, RoundId } from '../_utils/zustandTypes'
import { useZustandStore } from '../_utils/zustandLocalStorage'
import { isComboId } from '../_utils/lsValidation'
import { sequenceListSchema } from '../_utils/zodSchemas'
import { z } from 'zod'

export default function ComboPicker({
  hideUsedCombos,
  value,
  refreshBattle,
  roundId,
  type,
  position,
}: {
  value: ComboId | null
  hideUsedCombos?: boolean
  refreshBattle: () => void
  roundId: RoundId
  type: keyof z.infer<typeof sequenceListSchema>
  position?: number
}) {
  const [combos, setCombos] = useState<ComboDictionary | null>(null)
  //   const [usedComboIds, setUsedComboIds] = useState<Set<ComboId>>()
  const getCombos = useZustandStore((state) => state.getLsCombos)
  const setComboInRound = useZustandStore((state) => state.setComboInRound)

  //--------hooks---------

  //on mount set combos
  useEffect(() => {
    setCombos(getCombos() || null)
  }, [getCombos])

  return (
    <section>
      {/* ------select-------- */}
      <select
        className="w-full rounded-md border py-1 dark:border-indigo-500 dark:bg-transparent dark:placeholder-gray-400 dark:placeholder-opacity-50"
        value={value || ''}
        onChange={(e) => {
          console.log('val: ', e.target.value)
          if (isComboId(e.target.value)) {
            console.log('we are updating local storage')
            setComboInRound(e.target.value, roundId, type, position ?? 0)
            refreshBattle()
          }
        }}
      >
        {/* -------------select options----------------- */}
        <option value={''}>Choose Combo</option>
        {combos &&
          Object.entries(combos).map(([lsComboId, comboDetails], i) => {
            //Advanced options
            // if (hideUsedCombos && usedComboIds?.has(lsComboId as ComboId)) {
            //   return null
            //render options
            // } else {
            return (
              <option className="dark:text-white" value={lsComboId} key={i}>
                {comboDetails?.displayName || `Untitled Combo ${i + 1}`}
              </option>
            )
            // }
          })}
      </select>
    </section>
  )
}
