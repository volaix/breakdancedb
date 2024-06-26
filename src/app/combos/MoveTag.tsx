'use client'

import AutoComplete from './AutoComplete'
import { useEffect, useRef, useState } from 'react'
import options from './data'

export default function MoveTag({
  moves,
  moveIndex,
}: {
  moves: string[]
  moveIndex: number
}) {
  const [input, setInput] = useState('')
  const [hasInput, setHasInput] = useState<boolean>(false)
  const ref = useRef<HTMLElement>(null)

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
    <article ref={ref} className="flex">
      <section className="flex items-center gap-1 text-ellipsis rounded-full bg-blue-50 px-2 py-1 text-xs font-semibold text-blue-600">
        <div className="text-[6px] text-gray-400 dark:text-gray-500">
          {moveIndex + 1}
        </div>
        <div>{moves.join(' -> ')}</div>
      </section>
      {!hasInput && (
        <div
          //invisible clicker
          onClick={() => setHasInput(true)}
          className="cursor-text px-5"
        />
      )}
      {hasInput && <AutoComplete />}
    </article>
  )
}
