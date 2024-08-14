import { useContext, useEffect, useRef, useState } from 'react'
import { RenderRedXSVG } from '../_components/Svgs'
import { ComboId } from '../_utils/zustandTypes'
import { useZustandStore } from '../_utils/zustandLocalStorage'
import { ComboIdContext } from './util'

type Option = string

const CategoryAutoComplete = ({ closeInput }: { closeInput: () => void }) => {
  //-----------------------STATE---------------------------
  const { moveIndex, comboId, updateCombos } = useContext(ComboIdContext) ?? {}

  const [userEntryValue, setValue] = useState('')
  const [showSuggestions, setShowSuggestions] = useState<boolean>(false)
  const [flipSuggestion, setFlipSuggestion] = useState<boolean>(false)

  const combos = useZustandStore((state) => state.combos)
  const addCategory = useZustandStore((state) => state.addCategory)

  //----------------------FUNCTIONS------------------------
  if (comboId) {
    console.log('combos: ', combos?.[comboId])
  }
  const comboOptions = (): string[] => {
    if (combos === undefined) {
      return []
    }
    return Object.entries(combos).flatMap(([_, value]) => {
      if (!value?.categories) {
        return []
      }
      return value.categories
    })
  }
  const options: Option[] = [...comboOptions()]
  console.log('options: ', options)

  //filters options on what user has already typed
  const filteredOptions = options
    .filter((item) => item !== null && item !== undefined && item !== '')
    .filter((optionText) => {
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

  const addCustomCategory = () => {
    setShowSuggestions(false)
    comboId &&
      moveIndex !== undefined &&
      addCategory(comboId as ComboId, moveIndex, userEntryValue)
    updateCombos && updateCombos()
    closeInput()
  }

  //----------------------RENDER--------------------------
  return (
    <section className="" ref={autocompleteRef}>
      {/* -----------INPUT----------- */}
      <input
        autoFocus
        ref={inputRef}
        className="rounded-lg border px-2"
        value={userEntryValue}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Add Category"
        onFocus={() => setShowSuggestions(true)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ',') {
            addCustomCategory()
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
          {filteredOptions.map((categorySuggestion, i) => {
            return (
              <li
                className="cursor-pointer border-b px-2 hover:bg-gray-100"
                onClick={() => {
                  setShowSuggestions(false)
                }}
                key={i}
              >
                <section
                  className=""
                  onClick={() => {
                    setValue(categorySuggestion)
                    comboId &&
                      moveIndex !== undefined &&
                      addCategory(
                        comboId as ComboId,
                        moveIndex,
                        categorySuggestion,
                      )
                    updateCombos && updateCombos()
                    closeInput()
                  }}
                >
                  <label>{categorySuggestion}</label>
                </section>
              </li>
            )
          })}
          {filteredOptions.length === 0 &&
            (() => {
              return (
                <li
                  className="cursor-pointer border-b px-2 hover:bg-gray-100"
                  onClick={() => addCustomCategory()}
                >{`Create "${userEntryValue}"?`}</li>
              )
            })()}
        </ul>
      )}
    </section>
  )
}

export default CategoryAutoComplete
