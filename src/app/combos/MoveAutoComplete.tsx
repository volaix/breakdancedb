import { useContext, useEffect, useRef, useState } from 'react'
import { z } from 'zod'

import { RenderRedXSVG } from '../_components/Svgs'
import {
  BasicMoveSchema,
  FlowSchema,
  moveTransitionSchema,
} from '../_utils/zodSchemas'
import { ComboId } from '../_utils/zustandTypes'
import { useZustandStore } from '../_utils/zustandLocalStorage'
import { ComboIdContext } from './util'

type FlowOption = z.infer<typeof FlowSchema> //flow
type TransitionOption = z.infer<typeof moveTransitionSchema> //single transition
type SingleMoveOption = z.infer<typeof BasicMoveSchema> //individual move
type Option = SingleMoveOption | TransitionOption | FlowOption

const AutoComplete = ({ closeInput }: { closeInput: () => void }) => {
  //-----------------------STATE---------------------------
  const { moveIndex, comboId, updateCombos } = useContext(ComboIdContext) ?? {}

  const [userEntryValue, setValue] = useState('')
  const [showSuggestions, setShowSuggestions] = useState<boolean>(false)
  const [flipSuggestion, setFlipSuggestion] = useState<boolean>(false)

  const singleMoves = useZustandStore((state) => state.userMoves)
  const addComboMove = useZustandStore((state) => state.addComboMove)

  const basicMoveOptions: SingleMoveOption[] = Object.entries(
    singleMoves,
  ).flatMap(([key, value]) =>
    value.map(
      (move): SingleMoveOption => ({
        category: key,
        displayName: move,
      }),
    ),
  )

  const options: Option[] = [
    ...basicMoveOptions,

    // ...transitionOptions
  ]

  //filters options on what user has already typed
  const filteredOptions = options.filter((option) => {
    const optionText = (() => {
      switch (true) {
        case isSingleMove(option):
          return option.displayName
        // case isTransition(option):
        //   return option.moveFrom.displayName
        default:
          return ''
      }
    })()

    return optionText.toLowerCase().includes(userEntryValue.toLowerCase())
  })

  const autocompleteRef = useRef<HTMLInputElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  //-----------------HOOKS-----------------------
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

  return (
    <section className="" ref={autocompleteRef}>
      {/* -----------INPUT----------- */}
      <input
        autoFocus
        ref={inputRef}
        className="rounded-lg border px-2"
        value={userEntryValue}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Add Move"
        onFocus={() => setShowSuggestions(true)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ',') {
            addCustomMove()
          }
          //Note: cannot add e.key === 'escape'. Cancels input selection before is detected.
        }}
      />
      <RenderRedXSVG
        className="absolute -mt-5 ml-28 size-4 cursor-pointer"
        onClick={() => closeInput()}
      />
      {/* -----------SUGGESTIONS LIST----------- */}
      {showSuggestions && (
        <ul
          className={`absolute left-0 top-auto max-h-40 w-full overflow-y-auto rounded-md border bg-white sm:left-auto sm:w-fit ${flipSuggestion && '-mt-48'}`}
        >
          {filteredOptions.map((suggestion, i) => {
            return (
              <li
                className="cursor-pointer border-b px-2 hover:bg-gray-100"
                onClick={() => {
                  setShowSuggestions(false)
                }}
                key={i}
              >
                {isSingleMove(suggestion) && (
                  <section
                    className=""
                    onClick={() => {
                      setValue(suggestion.displayName)
                      comboId &&
                        moveIndex !== undefined &&
                        addComboMove(comboId as ComboId, moveIndex, {
                          moves: [suggestion.displayName],
                          id: 'custom',
                          type: 'move',
                        })
                      updateCombos && updateCombos()
                      closeInput()
                    }}
                  >
                    <label>{suggestion.displayName}</label>
                    <small className="ml-1">{`Category: ${suggestion.category}`}</small>
                  </section>
                )}
              </li>
            )
          })}
          {filteredOptions.length === 0 &&
            (() => {
              return (
                <li
                  className="cursor-pointer border-b px-2 hover:bg-gray-100"
                  onClick={() => addCustomMove()}
                >{`Create "${userEntryValue}"?`}</li>
              )
            })()}
        </ul>
      )}
    </section>
  )
}

const isSingleMove = (suggestion: Option): suggestion is SingleMoveOption =>
  BasicMoveSchema.safeParse(suggestion).success

export default AutoComplete
