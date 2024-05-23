'use client'
// @format
import { ChangeEvent, useCallback, useEffect, useState } from 'react'
import {
  Flow,
  GlobalStateProperties,
  lsBlowups,
  lsDrops,
  lsFloorwork,
  lsFootwork,
  lsFreezes,
  lsMisc,
  lsPower,
  lsSuicides,
  lsToprock,
  lsUserMoves,
} from '../_utils/localStorageTypes'
import { useZustandStore } from '../_utils/zustandLocalStorage'

//------------------------local utils------------------------------
const getRandomItem = (items: string[]): string => {
  return items[Math.floor(Math.random() * items.length)]
}

//------------------------localtypes-------------------------------
type Learning = Flow | null
type Category = keyof GlobalStateProperties[typeof lsUserMoves]
type SelectedCategoryState = Record<keyof Flow, Category>
//----------------------------mainrender--------------------------
/*
 * Renders 3 moves with 3 buttons at the bottom.
 */
export default function RenderFlows() {
  //-----------------------------state-----------------------------
  const [movesFromGlobalState, setMovesFromGlobalState] = useState<string[]>([])
  //learning refers to "what will be displayed" and is RNG set
  const [learning, setLearning] = useState<Learning>(null)
  const [singleCategory, setSingleCategory] = useState<boolean>(true)
  const displayMoves = learning && movesFromGlobalState.length > 0
  const setLsFlows = useZustandStore((state) => state.setLsFlows)
  const getLsFlows = useZustandStore((state) => state.getLsFlows)
  const getLsUserMovesByKey = useZustandStore(
    (state) => state.getLsUserMovesByKey,
  )
  const categories: Category[] = [
    lsToprock,
    lsFootwork,
    lsPower,
    lsFreezes,
    lsFloorwork,
    lsSuicides,
    lsDrops,
    lsBlowups,
    lsMisc,
  ]
  const [selectedCategory, setSelectedCategory] =
    useState<SelectedCategoryState>({
      entryMove: lsToprock,
      keyMove: lsToprock,
      exitMove: lsToprock,
    })

  const updateLearning = useCallback(() => {
    setLearning({
      entryMove: getRandomItem(getLsUserMovesByKey(selectedCategory.entryMove)),
      keyMove: getRandomItem(getLsUserMovesByKey(selectedCategory.keyMove)),
      exitMove: getRandomItem(getLsUserMovesByKey(selectedCategory.exitMove)),
    })
  }, [
    getLsUserMovesByKey,
    selectedCategory.entryMove,
    selectedCategory.exitMove,
    selectedCategory.keyMove,
  ])

  //---------------------------hooks---------------------------------
  //Populate existing moves
  useEffect(() => {
    setMovesFromGlobalState(getLsUserMovesByKey(lsToprock))
  }, [getLsUserMovesByKey])

  //on mount
  useEffect(() => {
    updateLearning()
  }, [updateLearning])

  //-------------------------handlers--------------------------------

  //handle dropdown
  const handleChange = (
    e: ChangeEvent<HTMLSelectElement>,
    dropdown: keyof SelectedCategoryState,
  ) => {
    setSelectedCategory({
      ...selectedCategory,
      [dropdown]: e.target.value as Category,
    })
  }

  //update local storage when user clicks yes
  const onClickYes = () => {
    //validation for if there is a flow displayed
    if (learning) {
      //updates localstorage with the added flow
      setLsFlows([...getLsFlows(), learning])
    } else {
      console.log('cannot find move currently being learned')
    }
    updateLearning()
  }
  const onClickSkip = () => {
    updateLearning()
  }
  const onClickNo = () => {
    updateLearning()
  }

  //-----------------------render--------------------
  return (
    <main>
      <div className="flex w-full max-w-xs flex-col items-center justify-between text-sm dark:text-gray-600 ">
        <div className="mt-10 flex w-full flex-col">
          <div className="mb-10 flex w-full flex-col text-center dark:text-gray-400">
            {/* ---------------------------TITLE SUBTITLE------------------------ */}
            <h1 className="title-font mb-2 text-3xl font-medium sm:text-4xl dark:text-white">
              Flows
            </h1>
            <p className="mx-auto px-2 text-base leading-relaxed lg:w-2/3">
              {`Try play around with three moves. Dance with each move. Or go quickly through it. It's up to you. Ratings at the end with some notes.`}
            </p>
            {/* ---------------------------BUTTON SWITCH------------------------ */}
            <div className="mx-auto mt-6 flex overflow-hidden rounded border-2 border-indigo-500">
              <button
                disabled={singleCategory}
                onClick={() => setSingleCategory(true)}
                className="px-4 py-1 focus:outline-none disabled:bg-indigo-500 disabled:text-white dark:enabled:text-gray-300"
              >
                Single
              </button>
              <button
                disabled={!singleCategory}
                onClick={() => setSingleCategory(false)}
                className="px-4 py-1 focus:outline-none disabled:bg-indigo-500 disabled:text-white dark:enabled:text-gray-300"
              >
                Custom
              </button>
            </div>
          </div>
          {/* //----------------------FLOW INFORMATION AREA----------------------- */}
          <div className="mb-5 flex w-full flex-col gap-4 p-4 text-xs">
            {(
              ['entryMove', 'keyMove', 'exitMove'] as Array<
                keyof SelectedCategoryState
              >
            ).map((dropdown, index) => (
              <div key={index} className="relative flex">
                {/* //-------------------------DROPDOWN------------------------- */}
                <div className="w-1/2">
                  <div>{dropdown}</div>
                  <div className="relative">
                    <select
                      className="focus:shadow-outline block w-full appearance-none rounded border border-gray-300 bg-white px-4 py-2 pr-10 leading-tight shadow hover:border-gray-500 focus:outline-none"
                      value={selectedCategory[dropdown]}
                      onChange={(e) => handleChange(e, dropdown)}
                    >
                      {categories.map((category) => (
                        <option key={category} value={category}>
                          {category}
                        </option>
                      ))}
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                      <svg
                        className="h-4 w-4 fill-current"
                        fill="#000000"
                        height="800px"
                        width="800px"
                        version="1.1"
                        id="Layer_1"
                        viewBox="0 0 407.437 407.437"
                      >
                        <polygon points="386.258,91.567 203.718,273.512 21.179,91.567 0,112.815 203.718,315.87 407.437,112.815 " />
                      </svg>
                    </div>
                  </div>
                </div>
                {/* //--------------------------INDIVIDUAL MOVE------------------------- */}
                <div className="w-1/2">
                  {displayMoves && (
                    <div className="flex w-full flex-col items-center bg-slate-300 py-3 dark:bg-gray-900">
                      <div className="capitalize text-black dark:text-white">
                        {learning[dropdown]}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
          {/* //--------------------------END OF DROPDOWN ZONE------------------------------- */}
          {displayMoves || <div>No moves to display</div>}
        </div>
        {/* ----------------------------------RESULT BUTTONS------------------------------------ */}
        {displayMoves && (
          <div className="flex justify-evenly px-2 py-5">
            <a
              onClick={onClickYes}
              className="rounded border border-violet-600 bg-violet-600 px-6 py-2 text-center text-white "
            >
              Yes
            </a>

            <a
              onClick={onClickSkip}
              className="rounded border border-violet-600 px-6 py-2 text-center text-violet-600"
            >
              Skip
            </a>
            <a
              onClick={onClickNo}
              className="rounded border border-violet-600 bg-violet-600 px-6 py-2 text-center text-white"
            >
              No
            </a>
          </div>
        )}
      </div>
    </main>
  )
}
