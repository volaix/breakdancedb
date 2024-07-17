import Link from 'next/link'
import { useCallback, useEffect, useState } from 'react'
import { RenderRedoIcon } from '../_components/Svgs'
import {
  BasicMove,
  FlowDictionary,
  FlowId,
  GlobalStateProperties,
  MoveCategories,
  lsToprock,
  lsUserMoves,
} from '../_utils/zustandTypes'
import { useZustandStore } from '../_utils/zustandLocalStorage'

//------------------------localtypes-------------------------------
type Category = keyof GlobalStateProperties[typeof lsUserMoves]
type SelectedCategory = Record<'selectedCategory', Category>

//------------------------local utils------------------------------
const pickRandomString = (items: string[]): string => {
  return items[Math.floor(Math.random() * items.length)]
}

const makeBasicMoves = (
  flowId: FlowId,
  lsFlows: FlowDictionary | null,
): BasicMove[] => {
  const { entryMove, keyMove, exitMove } = lsFlows?.[flowId] || {}
  return entryMove && keyMove && exitMove
    ? [
        {
          category: entryMove.category as MoveCategories,
          displayName: entryMove.displayName,
        },
        {
          category: keyMove.category as MoveCategories,
          displayName: keyMove.displayName,
        },
        {
          category: exitMove.category as MoveCategories,
          displayName: exitMove.displayName,
        },
      ]
    : []
}

export default function ExistingMoves() {
  // -------------state---------
  const [learning, setLearning] = useState<{ selectedCategory: string } | null>(
    null,
  )
  const getLsUserMovesByKey = useZustandStore(
    (state) => state.getLsUserMovesByKey,
  )
  const displayMoves = !!learning
  const [selectedCategory, setSelectedCategory] =
    useState<SelectedCategory | null>(null)
  //----------------functions----------------

  const shuffleLearning = useCallback(() => {
    if (selectedCategory) {
      const shuffleSingleKey = (key: 'selectedCategory') =>
        pickRandomString(getLsUserMovesByKey(selectedCategory[key]))

      setLearning({
        selectedCategory: shuffleSingleKey('selectedCategory'),
      })
    }
  }, [getLsUserMovesByKey, selectedCategory])

  //---------------------------hooks---------------------------------

  const getLsUserMoves = useZustandStore((state) => state.getLsUserMoves)
  const [categories, setCategories] = useState<string[]>()
  //sets categories
  useEffect(() => {
    setCategories(Object.keys(getLsUserMoves()))
  }, [getLsUserMoves])

  //on mount
  useEffect(() => {
    shuffleLearning()
  }, [shuffleLearning])

  // --------------render------------
  return (
    <>
      {/* --------------existing moves--------------- */}
      {
        <article>
          {/* ------------error message---------- */}
          {displayMoves || (
            <div className="flex flex-col text-center">
              No moves to display.
              <Link href="/yourmoves">
                <button className="bg-indigo-500 px-4 py-1 text-white focus:outline-none dark:text-gray-300">
                  Add moves
                </button>
              </Link>
            </div>
          )}
          {/* ----------------dropdowns----------- */}
          {displayMoves && selectedCategory && (
            <div className="flex w-full flex-col gap-4 text-xs">
              {(['selectedCategory'] as Array<keyof SelectedCategory>).map(
                (movePosition, i) => (
                  <div key={i} className="relative flex">
                    {/* //-------------------------DROPDOWN------------------------- */}
                    <article className="w-1/2">
                      {/* title */}
                      <div>{movePosition}</div>
                      {/* select */}
                      <div className="relative">
                        <select
                          className="focus:shadow-outline block w-full appearance-none rounded-lg border border-gray-300 bg-white px-4 py-2 pr-10 leading-tight focus:outline-none enabled:hover:border-gray-500 disabled:opacity-35 dark:border-indigo-500 dark:bg-transparent dark:bg-none dark:text-white dark:disabled:opacity-10 "
                          value={selectedCategory[movePosition]}
                          onChange={(e) =>
                            setSelectedCategory({
                              ...selectedCategory,
                              [movePosition]: e.target.value as Category,
                            })
                          }
                        >
                          {categories &&
                            categories.map((category) => (
                              <option key={category} value={category}>
                                {category}
                              </option>
                            ))}
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                          <svg
                            className={`h-4 w-4 fill-current dark:fill-indigo-500`}
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
                    </article>
                    {/* //--------------------------INDIVIDUAL MOVE------------------------- */}
                    <article className="w-1/2">
                      {displayMoves && (
                        <section className="h-full w-full ">
                          <label>{`${selectedCategory[movePosition]} move`}</label>
                          <div className="relative flex w-full appearance-none items-center justify-between overflow-hidden rounded-lg border border-gray-300  dark:border-indigo-500">
                            <select
                              className="focus:shadow-outline block w-full appearance-none rounded-lg border border-none border-gray-300 bg-transparent py-2 pl-2 leading-tight focus:outline-none enabled:hover:border-gray-500 disabled:opacity-35 dark:text-white"
                              value={learning[movePosition]}
                              onChange={(e) => {
                                setLearning(() => ({
                                  [movePosition]: e.target.value,
                                }))
                              }}
                            >
                              {getLsUserMovesByKey(
                                selectedCategory[movePosition],
                              )
                                .toSorted()
                                .map((moveStr) => {
                                  //should hide based on advanced flags
                                  const shouldHideMove = (
                                    hideCondition: boolean,
                                    movesUsed:
                                      | {
                                          displayName: string
                                          category: string
                                        }[]
                                      | undefined,
                                  ) =>
                                    hideCondition &&
                                    movesUsed?.some(
                                      ({ displayName, category }) =>
                                        displayName === moveStr &&
                                        category ===
                                          selectedCategory[movePosition],
                                    )

                                  return (
                                    <option key={moveStr} value={moveStr}>
                                      {moveStr}
                                    </option>
                                  )
                                })}
                            </select>
                            <div className="mr-1 h-4 w-4">
                              <RenderRedoIcon
                                className="fill-black dark:fill-indigo-500"
                                onClick={() => shuffleLearning()}
                              />
                            </div>
                          </div>
                        </section>
                      )}
                    </article>
                  </div>
                ),
              )}
            </div>
          )}
        </article>
      }
    </>
  )
}
