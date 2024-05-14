'use client'
import { useState, useEffect } from 'react'
import { useLocalStorage } from '@/app/_utils/lib'
import { makeMoveId } from '@/app/_utils/lsMakers'
import { lsUserLearning } from '@/app/_utils/localStorageTypes'
import {
  setLocalStorageGlobal,
  getLocalStorageGlobal,
} from '@/app/_utils/accessLocalStorage'
import { Move } from '@/app/_utils/localStorageTypes'
import { useMoveStore } from './store'
import { makeTransitions } from '@/app/_utils/lsMakers'
import { makePositions } from '@/app/_utils/lsMakers'
import { makeDefaultTransitionNames } from '@/app/_utils/lsMakers'
import rocks from '@/db/rocks.json'
import { useRouter } from 'next/navigation'

/**
 * Renders a text input with default position name
 */
const RenderPosition = ({ position }: { position: number }) => {
  //-----------------------state---------------------------
  const [inputVal, setInputVal] = useState<string>(
    `Position-${position}-${rocks[Math.floor(Math.random() * rocks.length)]}`,
  )
  //----------------------render----------------------------
  return (
    <div className="flex">
      <div className="mr-2"></div>
      <div className="relative text-xs">
        {null && (
          <label className="text-sm leading-7 text-gray-600 dark:text-gray-400">
            Move Name
          </label>
        )}
        <input
          type="text"
          id="name"
          value={inputVal}
          onChange={(e) => setInputVal(e.target.value)}
          name="name"
          className="w-full resize-none rounded border border-gray-300 bg-gray-100 bg-opacity-50 px-3 py-1 text-base leading-6 text-gray-700 outline-none transition-colors duration-200 ease-in-out focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-200 dark:border-gray-700 dark:bg-gray-800 dark:bg-opacity-40 dark:text-gray-100 dark:text-gray-500 dark:focus:bg-gray-900 dark:focus:ring-indigo-900"
        />
      </div>
    </div>
  )
}
/**
 * Renders the new move page
 * @returns jsx
 */
const RenderPage = () => {
  //-----------------------state------------------------------
  const { updatePositions, moveName, positions, updateMove } = useMoveStore()
  const [saveText, setSaveText] = useState<string>('Save')
  const [accessToLocalStorage, setAccessToLocalStorage] = useState(false)
  const [existingMoves, setExistingMoves] = useState<Move[]>([])
  const [rangeVal, setRangeVal] = useState<string>('6')
  const router = useRouter()

  //--------------------------hooks ----------------------
  //checks if local storage is avail
  useLocalStorage(setAccessToLocalStorage)

  //sets existing moves with what's learning in localstorage
  useEffect(() => {
    setExistingMoves(
      getLocalStorageGlobal[lsUserLearning](accessToLocalStorage),
    )
  }, [accessToLocalStorage])

  //When RangeVal updates, update positions in the shared state*/
  useEffect(() => {
    updatePositions(Number(rangeVal))
  }, [rangeVal, updatePositions])
  //------------------------------------------------------

  //When clicking the savebutton
  const onSave = () => {
    //FEATURE Display Transitions next to positions. If a transition is named, automatically update position name to "Pre transitionname or post". e.g. Pre Sweep and Post Sweep if transition p1-p2 is called Sweep.
    console.log('onsave run')
    if (accessToLocalStorage) {
      const lsPositions = makePositions(positions.map((p) => p.displayName))

      const newTransitions = makeTransitions({
        displayNames: makeDefaultTransitionNames(positions.length),
        positions: lsPositions,
      })

      //makes a new move
      const newMove: Move = {
        displayName: moveName,
        moveId: makeMoveId(),
        positions: lsPositions,
        moveExecution: {
          memorised: true,
          slow: true,
          normal: true,
          fast: false,
        },
        transitions: newTransitions,
      }

      //updates localstorage with newmove
      setLocalStorageGlobal[lsUserLearning](
        [...existingMoves, newMove],
        accessToLocalStorage,
      )
    }
    setSaveText('Saved')
    router.back()
    return
  }

  const onChangeName = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateMove(e.target.value)
  }
  const max = '20'
  //-----------------------------Render---------------------------
  return (
    <div>
      <a
        href="/learnmoves"
        className="inline-flex items-center text-indigo-400"
      >
        <svg
          className="ml-2 h-4 w-4 rotate-180"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth="2"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M5 12h14"></path>
          <path d="M12 5l7 7-7 7"></path>
        </svg>
        go back to learn moves
      </a>
      <div className="relative px-5 text-xs">
        <label className="text-sm leading-7 text-gray-600 dark:text-gray-400">
          Move Name
        </label>
        <input
          value={moveName}
          onChange={onChangeName}
          type="text"
          className="w-full resize-none rounded border border-gray-300 bg-gray-100 bg-opacity-50 px-3 py-1 text-base leading-6 text-gray-700 outline-none transition-colors duration-200 ease-in-out focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-200 dark:border-gray-700 dark:bg-gray-800 dark:bg-opacity-40 dark:text-gray-100 dark:focus:bg-gray-900 dark:focus:ring-indigo-900"
        />
        recommended 1-3 words
      </div>
      <div className="w-full p-2">
        <button
          onClick={onSave}
          className="mx-auto flex rounded border-0 bg-indigo-500 px-8 py-2 text-lg text-white hover:bg-indigo-600 focus:outline-none"
        >
          {saveText}
        </button>
      </div>
      <div className="w-full max-w-md p-6 shadow-lg">
        <div className="flex">
          <h2 className="mb-4 text-2xl font-bold">Optional</h2>
        </div>
        <div className="mb-4">
          <label
            htmlFor="price-range"
            className="mb-2 block font-bold text-gray-700"
          >
            Move Positions
          </label>
          <input
            type="range"
            id="price-range"
            className="w-full accent-indigo-500"
            min="1"
            max={max}
            value={rangeVal}
            onInput={(e: React.ChangeEvent<HTMLInputElement>) => {
              // updatePositions([...positions, e.target.value])
              setRangeVal(e.target.value)
            }}
          />
          <div className="text-xs">
            You can always edit positions again later
          </div>
        </div>
        <div className="flex justify-between text-gray-500">
          <span id="minPrice">{rangeVal}</span>
          <span id="maxPrice">{max}</span>
        </div>
        <div className="mt-5">
          {positions.map((e, i) => (
            <span className="" key={i}>
              <RenderPosition position={i + 1} />
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}

export default RenderPage
