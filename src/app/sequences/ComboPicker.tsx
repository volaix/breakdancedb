'use client'

import { useState } from 'react'
import { ComboDictionary, ComboId } from '../_utils/lsTypes'

export default function ComboPicker({
  hideUsedCombos,
}: {
  hideUsedCombos?: boolean
}) {
  const [combos, setCombos] = useState<ComboDictionary | null>(null)
  const [usedComboIds, setUsedComboIds] = useState<Set<ComboId>>()

  return (
    <section>
      {/* ------select-------- */}
      <select
        className="w-full rounded-md border py-1 dark:border-indigo-500 dark:bg-transparent dark:placeholder-gray-400 dark:placeholder-opacity-50"
        // value={comboId}
        onChange={() => {
          console.log('hello world')
        }}
      >
        {/* -------------select options----------------- */}
        <option value={''}>Choose Combo</option>
        {combos &&
          Object.entries(combos).map(([lsComboId, comboDetails], i) => {
            //safety
            if (hideUsedCombos && usedComboIds?.has(lsComboId as ComboId)) {
              return null
              //render options
            } else {
              return (
                <option className="dark:text-white" value={lsComboId} key={i}>
                  {comboDetails?.displayName || `Untitled Combo ${i + 1}`}
                </option>
              )
            }
          })}
      </select>
    </section>
  )
}
