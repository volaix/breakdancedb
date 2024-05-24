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
import { Brand } from '../_utils/typehelpers'
import { RenderGreyTick, RenderRedoIcon } from '../_components/Svgs'
import { produce } from 'immer'
import Link from 'next/link'

//------------------------local utils------------------------------
const getRandomItem = (items: string[]): string => {
  return items[Math.floor(Math.random() * items.length)]
}

//------------------------localtypes-------------------------------
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
  const [learning, setLearning] = useState<Flow | null>(null)
  const [singleCategory, setSingleCategory] = useState<boolean>(true)
  const displayMoves = learning && movesFromGlobalState.length > 0
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

  //----------------functions----------------
  const shuffleLearning = useCallback(
    (single?: keyof Flow) => {
      if (single) {
        setLearning((prevLearning) => {
          if (!prevLearning) return null
          return {
            ...prevLearning,
            [single]: getRandomItem(
              getLsUserMovesByKey(selectedCategory[single]),
            ),
          }
        })
      } else {
        setLearning({
          entryMove: getRandomItem(
            getLsUserMovesByKey(selectedCategory.entryMove),
          ),
          keyMove: getRandomItem(getLsUserMovesByKey(selectedCategory.keyMove)),
          exitMove: getRandomItem(
            getLsUserMovesByKey(selectedCategory.exitMove),
          ),
        })
      }
    },
    [getLsUserMovesByKey, selectedCategory],
  )

  //---------------------------hooks---------------------------------
  //Populate existing moves
  useEffect(() => {
    setMovesFromGlobalState(getLsUserMovesByKey(lsToprock))
  }, [getLsUserMovesByKey])

  //on mount
  useEffect(() => {
    shuffleLearning()
  }, [shuffleLearning])

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
      // setLsFlows([...getLsFlows(), learning])
      console.log('open modal')
    } else {
      console.log('cannot find move currently being learned')
    }
    shuffleLearning()
  }
  const onClickSkip = () => {
    shuffleLearning()
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
                className="px-4 py-1 focus:outline-none disabled:bg-indigo-500 
                disabled:text-white dark:enabled:text-gray-300"
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
          {displayMoves || (
            <div className="flex flex-col text-center">
              No moves to display.
              <Link href="/yourmoves">
                <button
                  className="bg-indigo-500 px-4 py-1 text-white
                 focus:outline-none dark:text-gray-300"
                >
                  Add moves
                </button>
              </Link>
            </div>
          )}
          {/* //----------------------FLOW INFORMATION AREA----------------------- */}
          {displayMoves && (
            <div className="mb-5 flex w-full flex-col gap-4 p-4 text-xs">
              {(
                ['entryMove', 'keyMove', 'exitMove'] as Array<
                  keyof SelectedCategoryState
                >
              ).map((dropdown, index) => (
                <div key={index} className="relative flex">
                  {/* //-------------------------DROPDOWN------------------------- */}
                  <div className="w-1/2">
                    {/* title */}
                    <div>{dropdown}</div>
                    {/* select */}
                    <div className="relative">
                      <select
                        disabled={index !== 0 && singleCategory}
                        className="focus:shadow-outline block w-full 
                      appearance-none rounded-lg border border-gray-300
                      bg-white px-4 py-2 pr-10 leading-tight 
                       focus:outline-none enabled:hover:border-gray-500 disabled:opacity-35"
                        value={
                          singleCategory
                            ? selectedCategory['entryMove']
                            : selectedCategory[dropdown]
                        }
                        onChange={(e) =>
                          singleCategory
                            ? setSelectedCategory({
                                entryMove: e.target.value as Category,
                                keyMove: e.target.value as Category,
                                exitMove: e.target.value as Category,
                              })
                            : setSelectedCategory({
                                ...selectedCategory,
                                [dropdown]: e.target.value as Category,
                              })
                        }
                      >
                        {categories.map((category) => (
                          <option key={category} value={category}>
                            {category}
                          </option>
                        ))}
                      </select>
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                        <svg
                          className={`h-4 w-4 fill-current ${singleCategory && 'opacity-30'}`}
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
                    {/* end of select */}
                  </div>
                  {/* //--------------------------INDIVIDUAL MOVE------------------------- */}
                  <div className="w-1/2">
                    {displayMoves && (
                      <div
                        className="h-full w-full 
                     dark:bg-gray-900 dark:text-white"
                      >
                        {`${selectedCategory[dropdown]} move`}
                        <div
                          className="
                      relative flex w-full
                      appearance-none justify-between overflow-hidden rounded-lg 
                        border border-gray-300 p-2"
                        >
                          <h2 className="font-medium tracking-widest">
                            {learning[dropdown]}
                          </h2>
                          <div className="flex">
                            <div className="mr-1 h-4 w-4">
                              <RenderRedoIcon
                                onClick={() => shuffleLearning(dropdown)}
                              />
                            </div>
                            {
                              //im not convinced this is a useful feature
                              false && (
                                <span
                                  className="mr-1 inline-flex h-4 w-4 flex-shrink-0 
                          items-center justify-center rounded-full bg-gray-300 text-white"
                                >
                                  <RenderGreyTick />
                                </span>
                              )
                            }
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
          {/* //--------------------------END OF DROPDOWN ZONE------------------------------- */}
        </div>
        {/* ----------------------------------RESULT BUTTONS------------------------------------ */}
        {displayMoves && (
          <div className="flex justify-evenly px-2 py-5">
            <a
              onClick={onClickSkip}
              className="rounded border border-indigo-500 px-6 py-2 text-center text-indigo-500"
            >
              re-shuffle
            </a>
            {false && (
              <a
                //waiting for modal feature
                onClick={onClickYes}
                className="rounded border border-indigo-500 bg-indigo-500 px-6 py-2 text-center text-white "
              >
                Yes
              </a>
            )}
          </div>
        )}
      </div>
    </main>
  )
}
