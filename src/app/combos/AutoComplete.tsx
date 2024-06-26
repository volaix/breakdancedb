import { useState, useEffect, useRef } from 'react'

const AutoComplete = ({ options = ['no options loaded'] }) => {
  const [value, setValue] = useState('')
  const [showSuggestions, setShowSuggestions] = useState<boolean>(false)
  const [flipSuggestion, setFlipSuggestion] = useState<boolean>(false)
  const suggestions = options.filter((option) =>
    option.toLowerCase().includes(value.toLowerCase()),
  )

  const autocompleteRef = useRef<HTMLInputElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

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
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Add Move"
        onFocus={() => setShowSuggestions(true)}
      />
      {showSuggestions && (
        <ul
          className={`absolute max-h-40 overflow-y-auto rounded-md border bg-white ${flipSuggestion && '-mt-48'}`}
        >
          {suggestions.map((suggestion) => (
            <li
              className="cursor-pointer border-b px-2 hover:bg-gray-100"
              // className={``}
              onClick={() => {
                setValue(suggestion)
                setShowSuggestions(false)
                //TODO: add to list
              }}
              key={suggestion}
            >
              {suggestion}
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}

export default AutoComplete
