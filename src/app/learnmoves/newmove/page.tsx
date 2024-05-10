"use client"
import { useState, useEffect } from "react"
import {
  getUserLearning,
  useLocalStorage,
  Move,
  lsUserLearning,
  updateLocalStorageGlobal,
  makeMoveId,
  makeDefaultMoveExec,
  Hold,
} from "@/app/lib"
import { useMoveStore } from "./store"
import { makeTransitions } from "@/app/lib"
import { makePositions } from "@/app/lib"
import { makeDefaultTransitionNames } from "@/app/lib"
import rocks from '@/db/rocks.json'
import { v4 } from "uuid"



/**
 * Renders a text input with default position name
 */
const RenderPosition = ({ position }: { position: number }) => {
  //-----------------------state---------------------------
  const [inputVal, setInputVal] = useState<string>(`Position-${position}-${rocks[Math.floor(Math.random() * rocks.length)]}`)
  //----------------------render----------------------------
  return (
    <div className="flex">
      <div className="mr-2"></div>
      <div className="relative text-xs">
        {null && (
          <label className="dark:text-gray-400 leading-7 text-sm text-gray-600">
            Move Name
          </label>
        )}
        <input
          type="text"
          id="name"
          value={inputVal}
          onChange={(e) => setInputVal(e.target.value)}
          name="name"
          className="dark:text-gray-500 w-full bg-gray-100 bg-opacity-50 rounded border border-gray-300 focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 resize-none leading-6 transition-colors duration-200 ease-in-out dark:bg-gray-800 dark:bg-opacity-40 dark:border-gray-700 dark:focus:bg-gray-900 dark:focus:ring-indigo-900 dark:text-gray-100" />
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
  const [saveText, setSaveText] = useState<string>("Save")
  const [accessToLocalStorage, setAccessToLocalStorage] = useState(false)
  const [existingMoves, setExistingMoves] = useState<Move[]>([])
  const [rangeVal, setRangeVal] = useState<string>('6')


  //--------------------------hooks ----------------------
  useLocalStorage(setAccessToLocalStorage)

  useEffect(() => {
    if (accessToLocalStorage) {
      setExistingMoves(getUserLearning())
    }
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

      const newTransitions = makeTransitions({ displayNames: makeDefaultTransitionNames(positions.length), positions: lsPositions, })

      //makes a new move
      const newMove: Move = {
        displayName: moveName,
        positions: lsPositions,
        moveExecution: makeDefaultMoveExec(),
        moveId: makeMoveId(),
        transitions: newTransitions,
        holds: lsPositions.map((a, i): Hold => {
          //the only place where holdIds are made
          return {
            fromPosition: lsPositions[i].positionId,
            toPosition: a.positionId,
            transition: newTransitions[i].transitionId,
            displayName: `Pos${i + 1}-> Trans${i + 1} -> Pos${i + 2}`,
            slowRating: 0,
            holdId: v4(),
          }
        })

      }

      //updates localstorage with newmove
      updateLocalStorageGlobal[lsUserLearning](
        [...existingMoves, newMove],
        accessToLocalStorage,
      )
    }
    setSaveText("Saved")
    return
  }

  const onChangeName = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateMove(e.target.value)
  }
  const max = '20'
  //-----------------------------Render---------------------------
  return (
    <div>
      <a href="/learnmoves" className="inline-flex items-center text-indigo-400">
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
      <div className="relative text-xs px-5">
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
      <div className="shadow-lg p-6 w-full max-w-md">
        <div className="flex">
          <h2 className="text-2xl font-bold mb-4">Optional</h2>
        </div>
        <div className="mb-4">
          <label htmlFor="price-range" className="block text-gray-700 font-bold mb-2">
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
            }} />
          <div className="text-xs">You can always edit positions again later</div>
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
