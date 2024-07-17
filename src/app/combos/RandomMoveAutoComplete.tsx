import { useCallback, useContext, useEffect, useRef, useState } from 'react'
import { z } from 'zod'

import { RenderGreyTick, RenderRedXSVG } from '../_components/Svgs'
import { BasicMoveSchema } from '../_utils/zodSchemas'
import { ComboId } from '../_utils/zustandTypes'
import { useZustandStore } from '../_utils/zustandLocalStorage'
import { ComboIdContext } from './util'

type Suggestion = { moves: string[]; category: string }

export default function RandomMoveAutoComplete({
  closeInput,
}: {
  closeInput: () => void
}) {
  //-----------------------STATE---------------------------
  const { moveIndex, comboId, updateCombos } = useContext(ComboIdContext) ?? {}

  const [userEntryValue, setValue] = useState('')
  const [showSuggestions, setShowSuggestions] = useState<boolean>(true)
  const [flipSuggestion, setFlipSuggestion] = useState<boolean>(false)
  const [suggestions, setSuggestions] = useState<Suggestion[] | null>(null)
  const [randomCategoryRepeat, setRandomCategoryRepeat] = useState<
    string | null
  >(null)

  const addComboMove = useZustandStore((state) => state.addComboMove)
  const getMoves = useZustandStore((state) => state.getLsUserMoves)

  const autocompleteRef = useRef<HTMLInputElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  //-----------------HOOKS-----------------------

  //Filters categories based on search
  const searchedSuggestions = useCallback(() => {
    if (!suggestions) return false

    //user just wants to RNG lots
    if (randomCategoryRepeat) {
      return suggestions.filter(
        (option) => option.category === randomCategoryRepeat,
      )
    }

    return suggestions
      .filter((option) => {
        //dont show categories for empty moves
        if (option.moves.length < 1) return false

        //filters options on what user has already typed
        return option.category
          .toLowerCase()
          .includes(userEntryValue.toLowerCase())
      })
      .toSpliced(0, 1, {
        category: 'ANY',
        moves: suggestions.flatMap((s) => s.moves),
      })
  }, [randomCategoryRepeat, suggestions, userEntryValue])

  //sets suggestions on mount
  useEffect(() => {
    const moves = Object.entries(getMoves()).map(([category, moves]) => ({
      moves,
      category,
    }))
    setSuggestions(moves)
  }, [getMoves])
  //close dialog if clicks outside
  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      if (
        autocompleteRef.current &&
        !autocompleteRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false)
      }
    }
    document.addEventListener('click', handleClick)
    return () => {
      document.removeEventListener('click', handleClick)
    }
  }, [])

  //Put the suggestions above or below
  useEffect(() => {
    const inputPosition = inputRef.current?.getBoundingClientRect().bottom
    if (!inputPosition) {
      return
    }
    if (window.innerHeight - inputPosition < 160) {
      setFlipSuggestion(true)
    } else {
      setFlipSuggestion(false)
    }
  }, [])

  const addCustomMove = () => {
    setShowSuggestions(false)
    comboId &&
      moveIndex !== undefined &&
      addComboMove(comboId as ComboId, moveIndex, {
        moves: [userEntryValue],
        id: 'custom',
        type: 'custom',
      })
    updateCombos && updateCombos()
    closeInput()
  }

  const displaySuggestions = searchedSuggestions()
  console.log('displaySuggestions: ', displaySuggestions)
  return (
    <section className="" ref={autocompleteRef}>
      {/* -----------INPUT----------- */}
      <input
        autoFocus
        ref={inputRef}
        className="rounded-lg border px-2"
        value={userEntryValue}
        onChange={(e) => {
          setValue(e.target.value)
          if (e.target.value === '') {
            setRandomCategoryRepeat(null)
          }
        }}
        placeholder="RNG Move"
        onFocus={() => setShowSuggestions(true)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ',') {
            addCustomMove()
          }
        }}
      />
      <RenderGreyTick
        className="absolute -mt-5 ml-24 size-4 cursor-pointer text-green-400"
        onClick={() => {
          //set value in zustand
          updateCombos && updateCombos()
          closeInput()
        }}
      />
      <RenderRedXSVG
        className="absolute -mt-5 ml-28 size-4 cursor-pointer"
        onClick={() => closeInput()}
      />
      {/* -----------SUGGESTIONS LIST----------- */}
      {/* {showSuggestions && displaySuggestions && (
        <ul
          className={`absolute left-0 top-auto max-h-40 w-full overflow-y-auto rounded-md border bg-white sm:left-auto sm:w-fit ${flipSuggestion && '-mt-[42%]'}`}
        >
          {displaySuggestions.map((suggestion, i) => {
            const moves = suggestion.moves
            return (
              <li
                className={`cursor-pointer border-b px-2 hover:bg-gray-100 `}
                onClick={() => {
                  // setShowSuggestions(false)
                }}
                key={i}
              >
                {suggestion.category && (
                  <section
                    className=""
                    onClick={() => {
                      setRandomCategoryRepeat(suggestion.category)
                      setValue(moves[Math.floor(Math.random() * moves.length)])
                    }}
                  >
                    <label>{`RNG: ${suggestion.category}`}</label>
                  </section>
                )}
              </li>
            )
          })}
          {displaySuggestions.length === 0 &&
            (() => {
              return (
                <li className="cursor-pointer border-b px-2 hover:bg-gray-100">{`Add "${userEntryValue}" as a custom move?`}</li>
              )
            })()}
        </ul>
      )} */}
    </section>
  )
}
