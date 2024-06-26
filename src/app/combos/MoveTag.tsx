'use client'

import { useContext, useEffect, useRef, useState } from 'react'
import { RenderTrashButtonSvg } from '../_components/Svgs'
import { isComboId } from '../_utils/lsValidation'
import { useZustandStore } from '../_utils/zustandLocalStorage'
import AutoComplete from './AutoComplete'
import { ComboIdContext } from './util'

export default function MoveTag({ moves }: { moves: string[] }) {
  const [hasInput, setHasInput] = useState<boolean>(false)
  const ref = useRef<HTMLElement>(null)
  const deleteComboMove = useZustandStore((state) => state.deleteComboMove)

  const { moveIndex, comboId, updateCombos } = useContext(ComboIdContext) ?? {}

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setHasInput(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <article ref={ref} className="my-0.5 flex">
      <section className="flex items-center gap-1 text-ellipsis rounded-sm bg-blue-50 px-2 py-0.5 text-xs font-semibold text-blue-600 dark:bg-blue-600/20 dark:hover:bg-blue-900/70">
        <div className="text-[6px] text-gray-400 dark:text-gray-500">
          {1 + (moveIndex ?? 0)}
        </div>
        <div className="">{moves.join(' -> ')}</div>
        {moveIndex !== undefined && (
          <div className="cursor-pointer rounded-full px-1 py-1 hover:dark:bg-blue-400/20">
            <RenderTrashButtonSvg
              onClick={() => {
                isComboId(comboId) && deleteComboMove(comboId, moveIndex)
                updateCombos && updateCombos()
              }}
            />
          </div>
        )}
      </section>
      {!hasInput && (
        <div
          //invisible clicker
          onClick={() => setHasInput(true)}
          className="flex-grow cursor-text pr-1"
        />
      )}
      {hasInput && <AutoComplete closeInput={() => setHasInput(false)} />}
    </article>
  )
}
