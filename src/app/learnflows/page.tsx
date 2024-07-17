'use client'
// @format
import { makeFlowId } from '@/app/_utils/lsGenerators'
import Link from 'next/link'
import { useCallback, useEffect, useState } from 'react'
import { Notification } from '../_components/Notification'
import RenderThunder from '../_components/RenderChilli'
import { RenderRedoIcon } from '../_components/Svgs'
import {
  MoveTransition,
  extractComboIds,
  extractMoveTransitions,
} from '../_utils/lib'
import {
  BasicFlow,
  BasicMove,
  ComboMove,
  FlowDictionary,
  FlowId,
  GlobalStateProperties,
  MoveCategories,
  lsUserMoves,
} from '../_utils/zustandTypes'
import { useZustandStore } from '../_utils/zustandLocalStorage'

const likeRanking = new Map<number, string>([
  [5, 'Super Cool!'],
  [4, 'ok ill use it'],
  [3, 'ok but not for me'],
  [2, 'this sucks'],
  [1, 'I tried'],
])

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

//------------------------localtypes-------------------------------
type Category = keyof GlobalStateProperties[typeof lsUserMoves]
type SelectedCategoryState = Record<keyof BasicFlow, Category>

//----------------------------mainrender--------------------------
/*
 * Renders 3 moves with 3 buttons at the bottom.
 */
export default function RenderFlows() {
  //-----------------------------state-----------------------------
  //learning refers to "what will be displayed" and is RNG set
  const [learning, setLearning] = useState<BasicFlow | null>(null)
  const [visible, setVisible] = useState(false)
  const [hideUnique, setHideUniques] = useState(false)
  const [notificationMessage, setNotificationMessage] = useState<string>('')
  const [textAreaValue, setTextAreaValue] = useState<string>('')
  const [singleCategory, setSingleCategory] = useState<boolean>(true)
  const [selectedCategory, setSelectedCategory] =
    useState<SelectedCategoryState | null>(null)
  const [ratingVal, setRatingVal] = useState<number>(1)
  const [hideMovesIfBattle, setHideMovesIfBattle] = useState<boolean>(false)
  const [movesUsedInBattle, setMovesUsedInBattle] = useState<BasicMove[]>()
  const [hideMovesIfFlow, setHideMovesIfFlow] = useState<boolean>(false)
  const [movesUsedInFlow, setMovesUsedInFlow] = useState<BasicMove[]>()
  const [categories, setCategories] = useState<string[]>()
  const [moveTransitions, setMoveTransitions] = useState<MoveTransition[]>()

  const setFlow = useZustandStore((state) => state.setLsFlow)
  const getBattle = useZustandStore((state) => state.getLsBattle)
  const getFlows = useZustandStore((state) => state.getLsFlows)
  const getCombosById = useZustandStore((state) => state.getLsComboById)
  const getUserMovesByKey = useZustandStore(
    (state) => state.getLsUserMovesByKey,
  )
  const getUserMoves = useZustandStore((state) => state.getLsUserMoves)
  const getUserMoveCategories = useZustandStore(
    (state) => state.getLsUserMoveCategories,
  )

  const displayMoves = !!learning
  //----------------functions----------------
  const isSameMove = (move1: BasicMove, move2: BasicMove): boolean =>
    move1.displayName === move2.displayName && move1.category === move2.category

  const shuffleLearning = useCallback(
    (single?: keyof BasicFlow) => {
      if (!selectedCategory) {
        return
      } else {
        const shuffleSingleKey = (key: keyof BasicFlow) =>
          pickRandomString(getUserMovesByKey(selectedCategory[key]))
        if (single) {
          setLearning((prevLearning) =>
            prevLearning
              ? { ...prevLearning, [single]: shuffleSingleKey(single) }
              : null,
          )
        } else {
          setLearning({
            entryMove: shuffleSingleKey('entryMove'),
            keyMove: shuffleSingleKey('keyMove'),
            exitMove: shuffleSingleKey('exitMove'),
          })
        }
      }
    },
    [getUserMovesByKey, selectedCategory],
  )

  //---------------------------hooks---------------------------------
  //sets categories on mount
  useEffect(() => {
    const categories = getUserMoveCategories()
    setCategories(categories)
    setSelectedCategory({
      entryMove: categories[0],
      keyMove: categories[0],
      exitMove: categories[0],
    })
  }, [getUserMoveCategories])

  //Shuffle learning on mount
  useEffect(() => {
    shuffleLearning()
  }, [shuffleLearning])

  /**
 * For ADV. OPT. Hide Uniques
  Set move transitions
 */
  useEffect(() => {
    if (!hideUnique) return
    const lsFlowsLocal = getFlows()
    if (!lsFlowsLocal) return

    const moveTransitions: MoveTransition[] =
      extractMoveTransitions(lsFlowsLocal)

    setMoveTransitions(moveTransitions)

    // setMovesUsedInFlow(basicMoves)
  }, [getFlows, hideMovesIfFlow, hideUnique])

  //if hideMovesIfFlow flag, set movesUsedInFlow
  useEffect(() => {
    if (!hideMovesIfFlow) return
    const lsFlows = getFlows()
    if (!lsFlows) return
    const flowIds: FlowId[] = Object.keys(lsFlows) as FlowId[]
    const basicMoves: BasicMove[] = flowIds.flatMap((flowId) =>
      makeBasicMoves(flowId, lsFlows),
    )
    setMovesUsedInFlow(basicMoves)
  }, [getFlows, hideMovesIfFlow])

  //if hideMovesIfBattle flag, set movesUsedInBattle
  useEffect(() => {
    if (!hideMovesIfBattle) return
    const lsBattle = getBattle()
    if (!lsBattle) return

    const lsFlows = getFlows()
    const movesFromFlowIds: BasicMove[] = extractComboIds(lsBattle.rounds)
      //FlowId[] used in lsBattle
      .map((comboId): FlowId[] | undefined => {
        const comboVal = getCombosById(comboId)
        if (!comboVal) return

        const comboMoves: ComboMove[] = comboVal.sequence.filter(
          (comboMove) => comboMove.type === 'flow' && comboMove.id,
        )

        return comboMoves.map((comboMove) => comboMove.id as FlowId)
      })
      .flat(1)
      .filter((a): a is FlowId => a !== undefined)
      //BasicMoves from FlowIds[]
      .map((flowId) => makeBasicMoves(flowId, lsFlows))
      .flat(1)

    setMovesUsedInBattle(movesFromFlowIds)
  }, [getBattle, getCombosById, getFlows, hideMovesIfBattle])

  //Show Notifcation for 2 seconds
  useEffect(() => {
    const fadeOutTimer = setTimeout(() => setVisible(false), 2000)
    return () => clearTimeout(fadeOutTimer)
  }, [visible])
  //-------------------------handlers--------------------------------

  //update local storage when user clicks yes
  const onClickYes = () => {
    if (learning) {
      if (!selectedCategory) return
      setFlow(
        {
          entryMove: {
            displayName: learning.entryMove,
            category: selectedCategory.entryMove,
          },
          keyMove: {
            displayName: learning.keyMove,
            category: selectedCategory.keyMove,
          },
          exitMove: {
            displayName: learning.exitMove,
            category: selectedCategory.exitMove,
          },
          rating: ratingVal,
          notes: textAreaValue,
        },
        makeFlowId(),
      )
    } else {
      console.log('cannot find move currently being learned')
    }
    shuffleLearning()
    setNotificationMessage('Saved and re-shuffled')
    setVisible(true)
  }
  const onClickSkip = () => {
    shuffleLearning()
  }

  //-----------------------render--------------------
  return (
    <main>
      <div className="mt-12 flex w-full max-w-xs flex-col items-center justify-between text-sm dark:text-gray-600 ">
        <div className="mt-10 flex w-full flex-col">
          <div className="mb-10 flex w-full flex-col text-center dark:text-gray-400">
            {/* ---------------------------TITLE SUBTITLE------------------------ */}
            <h1 className="title-font mb-2 text-3xl font-medium sm:text-4xl dark:text-white">
              RNG Set
            </h1>
            <p className="mx-auto px-2 text-base leading-relaxed lg:w-2/3">
              {`Learn every move into every other move. Do as many as you can. Try be you.`}
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
            {/* -----------------advanced options---------------- */}
            <section className="mt-5">
              <details className="flex flex-col leading-snug">
                <summary className="text-xs">Advanced Options</summary>
                <section className="mt-2">
                  <article>
                    <label> Hide moves already used in Battle </label>
                    <input
                      className="ml-1"
                      checked={hideMovesIfBattle}
                      onChange={(e) => {
                        setHideMovesIfBattle(e.target.checked)
                      }}
                      type="checkbox"
                    />
                  </article>
                  <article>
                    <label>Hide moves already used in Flows</label>
                    <input
                      className="ml-1"
                      checked={hideMovesIfFlow}
                      onChange={(e) => {
                        setHideMovesIfFlow(e.target.checked)
                      }}
                      type="checkbox"
                    />
                  </article>
                  <article>
                    <label>Hide non unique transitions in saved flows</label>
                    <input
                      className="ml-1"
                      checked={hideUnique}
                      onChange={(e) => {
                        setHideUniques(e.target.checked)
                      }}
                      type="checkbox"
                    />
                  </article>
                </section>
              </details>
              <section className="flex flex-col"></section>
            </section>
            {/* ------------------end of advanced options------------- */}
          </div>
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
          {/* //----------------------FLOW INFORMATION AREA----------------------- */}
          {displayMoves && selectedCategory && (
            <div className="mb-5 flex w-full flex-col gap-4 p-4 text-xs">
              {(
                ['entryMove', 'keyMove', 'exitMove'] as Array<
                  keyof SelectedCategoryState
                >
              ).map((movePosition, movePosIndex, movePosArr) => (
                <div key={movePosIndex} className="relative flex">
                  {/* //-------------------------DROPDOWN------------------------- */}
                  <article className="w-1/2">
                    {/* title */}
                    <div>{movePosition}</div>
                    {/* select */}
                    <div className="relative">
                      <select
                        disabled={movePosIndex !== 0 && singleCategory}
                        className="focus:shadow-outline block w-full appearance-none rounded-lg border border-gray-300 bg-white px-4 py-2 pr-10 leading-tight focus:outline-none enabled:hover:border-gray-500 disabled:opacity-35 dark:border-indigo-500 dark:bg-transparent dark:bg-none dark:text-white dark:disabled:opacity-10"
                        value={
                          singleCategory
                            ? selectedCategory['entryMove']
                            : selectedCategory[movePosition]
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
                          className={`h-4 w-4 fill-current dark:fill-indigo-500 ${singleCategory && movePosIndex !== 0 && 'opacity-30'}`}
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
                      <section className="h-full w-full dark:bg-gray-900 dark:text-white">
                        <label>{`${selectedCategory[movePosition]} move`}</label>
                        <div className="relative flex w-full appearance-none items-center justify-between overflow-hidden rounded-lg border border-gray-300 dark:border-indigo-500">
                          <select
                            className="focus:shadow-outline block w-full appearance-none rounded-lg border border-none border-gray-300 bg-transparent py-2 pl-2 leading-tight focus:outline-none enabled:hover:border-gray-500 disabled:opacity-35"
                            value={learning[movePosition]}
                            onChange={(e) => {
                              setLearning((prev) => ({
                                entryMove: prev?.entryMove || '',
                                keyMove: prev?.keyMove || '',
                                exitMove: prev?.exitMove || '',
                                [movePosition]: e.target.value,
                              }))
                            }}
                          >
                            {getUserMovesByKey(selectedCategory[movePosition])
                              .toSorted()
                              .map((moveStr) => {
                                //---------ADV. OPT. FUNCTION -----------
                                const advOptionIsTicked =
                                  hideUnique ||
                                  hideMovesIfFlow ||
                                  hideMovesIfBattle

                                if (advOptionIsTicked) {
                                  // Don't show option if this move and past move match an existing transition
                                  if (hideUnique) {
                                    const thisMove: BasicMove = {
                                      category: selectedCategory[movePosition],
                                      displayName: moveStr,
                                    }
                                    const pastMove: BasicMove = {
                                      category:
                                        selectedCategory[
                                          movePosArr[movePosIndex - 1]
                                        ],
                                      displayName:
                                        learning[movePosArr[movePosIndex - 1]],
                                    }
                                    if (
                                      moveTransitions?.some(
                                        ({ moveFrom, moveTo }) =>
                                          isSameMove(moveTo, thisMove) &&
                                          isSameMove(moveFrom, pastMove),
                                      )
                                    ) {
                                      return
                                    }
                                  }

                                  const areMovesAlreadyUsed = (
                                    hideCondition: boolean,
                                    movesUsed?: BasicMove[],
                                  ): boolean => {
                                    return (
                                      hideCondition &&
                                      !!movesUsed?.some(
                                        ({ displayName, category }) =>
                                          displayName === moveStr &&
                                          category ===
                                            selectedCategory[movePosition],
                                      )
                                    )
                                  }

                                  // Don't show option if moves are already used
                                  if (
                                    areMovesAlreadyUsed(
                                      hideMovesIfBattle,
                                      movesUsedInBattle,
                                    ) ||
                                    areMovesAlreadyUsed(
                                      hideMovesIfFlow,
                                      movesUsedInFlow,
                                    )
                                  ) {
                                    return
                                  }
                                }

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
                              onClick={() => shuffleLearning(movePosition)}
                            />
                          </div>
                        </div>
                      </section>
                    )}
                  </article>
                </div>
              ))}
            </div>
          )}
          {/* //--------------------------END OF DROPDOWN ZONE------------------------------- */}
        </div>
        {/* //--------------------------I LIKE THIS METER------------------------------- */}
        <section className="pb-10 text-center">
          <h2 className="pb-2">I like this</h2>
          <div className="flex flex-row-reverse">
            {Array.from(Array(5)).map((a, i) => {
              return (
                <RenderThunder
                  id={5 - i + ''}
                  checked={i === 5 - ratingVal}
                  onChange={(e) => {
                    setRatingVal(Number(e.target.id))
                  }}
                  key={i}
                  size="size-10"
                />
              )
            })}
          </div>
          <p className="text-4xs">{likeRanking.get(ratingVal)}</p>
        </section>
        {/* ---------------------------------Notes----------------------------------- */}
        <h2>Notes</h2>
        <div className="w-full px-4">
          <textarea
            className="w-full resize-none rounded border border-gray-300 bg-gray-100 bg-opacity-50 px-3 py-1 text-xs text-gray-700 outline-none transition-colors duration-200 ease-in-out focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-200 dark:border-gray-700 dark:bg-gray-800 dark:bg-opacity-40 dark:text-gray-100 dark:focus:bg-gray-900 dark:focus:ring-indigo-900"
            rows={3}
            cols={30}
            value={textAreaValue}
            onChange={(e) => setTextAreaValue(e.target.value)}
          />
        </div>
        {/* ----------------------------------RESULT BUTTONS------------------------------------ */}
        <Notification visible={visible} message={notificationMessage} />
        {displayMoves && (
          <div className="flex justify-evenly px-2 py-5 text-xs">
            <Link
              className="rounded border border-indigo-500 px-3 py-2 text-center text-indigo-500"
              href="/viewflows"
            >
              View Flows
            </Link>
            <a
              onClick={onClickSkip}
              className="rounded border border-indigo-500 px-3 py-2 text-center text-indigo-500"
            >
              re-shuffle
            </a>
            {/* --------------SAVE------------------- */}
            <a
              onClick={onClickYes}
              className="rounded border border-indigo-500 bg-indigo-500 px-3 py-2 text-center text-white "
            >
              Save
            </a>
          </div>
        )}
      </div>
    </main>
  )
}
