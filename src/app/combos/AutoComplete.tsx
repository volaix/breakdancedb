import { useState, useEffect, useRef, useContext } from 'react'
import { useZustandStore } from '../_utils/zustandLocalStorage'
import {
  BasicMoveSchema,
  FlowSchema,
  MoveTransitionSchema,
} from '../_utils/lsSchemas'
import { z } from 'zod'
import { ComboIdContext } from './page'
import { ComboId } from '../_utils/lsTypes'
import { transitionIdSchema } from '../_utils/lsSchemas'

type FlowOption = z.infer<typeof FlowSchema> //flow
type TransitionOption = z.infer<typeof MoveTransitionSchema> //single transition
type SingleMoveOption = z.infer<typeof BasicMoveSchema> //individual move
type Option = SingleMoveOption | TransitionOption | FlowOption

const AutoComplete = ({ closeInput }: { closeInput: () => void }) => {
  //-----------------------STATE---------------------------
  const { moveIndex, comboId, updateCombos } = useContext(ComboIdContext) ?? {}

  const [userEntryValue, setValue] = useState('')
  const [showSuggestions, setShowSuggestions] = useState<boolean>(false)
  const [flipSuggestion, setFlipSuggestion] = useState<boolean>(false)

  const transitons = useZustandStore((state) => state.moveTransitions)
  const singleMoves = useZustandStore((state) => state.userMoves)
  const addComboMove = useZustandStore((state) => state.addComboMove)

  const transitionOptions: TransitionOption[] = transitons ?? []
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

  const options: Option[] = [...transitionOptions, ...basicMoveOptions]

  //filters options on what user has already typed
  const filteredOptions = options.filter((option) => {
    const optionText = (() => {
      switch (true) {
        case isSingleMove(option):
          return option.displayName
        case isTransition(option):
          return option.moveFrom.displayName
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

  return (
    <section className="" ref={autocompleteRef}>
      <input
        ref={inputRef}
        className="rounded-lg border px-2"
        value={userEntryValue}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Add Move"
        onFocus={() => setShowSuggestions(true)}
      />
      {showSuggestions && (
        <ul
          className={`absolute left-0 top-auto   max-h-40 overflow-y-auto rounded-md border bg-white ${flipSuggestion && '-mt-48'}`}
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
                        moveIndex &&
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
                {isTransition(suggestion) &&
                  (() => {
                    const transitionLabel = `${suggestion.moveFrom.displayName} -> ${suggestion.moveTo.displayName}`
                    return (
                      <>
                        <section
                          onClick={() => {
                            setValue(transitionLabel)
                            const id = transitionIdSchema.safeParse(
                              suggestion.moveTransitionId,
                            ).data
                            if (!id) return
                            addComboMove(
                              comboId as ComboId,
                              moveIndex as number,
                              {
                                moves: [
                                  suggestion.moveFrom.displayName,
                                  suggestion.moveTo.displayName,
                                ],
                                id,
                                type: 'transition',
                              },
                            )
                          }}
                        >
                          <label>{transitionLabel}</label>
                          <small className="ml-1">Transition</small>
                        </section>
                      </>
                    )
                  })()}
              </li>
            )
          })}
        </ul>
      )}
    </section>
  )
}

const isSingleMove = (suggestion: Option): suggestion is SingleMoveOption =>
  BasicMoveSchema.safeParse(suggestion).success
const isTransition = (suggestion: Option): suggestion is TransitionOption =>
  MoveTransitionSchema.safeParse(suggestion).success

export default AutoComplete
