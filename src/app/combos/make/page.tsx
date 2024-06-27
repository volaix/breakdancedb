'use client'
//@format
import { comboIdKey } from '@/app/_utils/lib'
import { produce } from 'immer'
import { useRouter, useSearchParams } from 'next/navigation'
import { Suspense, useEffect, useState } from 'react'
import LoadingFallback from '../../_components/LoadingFallback'
import { Notification } from '../../_components/Notification'
import RenderThunder from '../../_components/RenderChilli'
import { RenderRedHoldButton } from '../../_components/Svgs'
import {
  ComboId,
  ComboMove,
  FlowDictionary,
  FlowId,
  KeyOfMoves,
  MoveCategories,
  MoveId,
  PositionTransitionId,
  lsToprock,
} from '../../_utils/lsTypes'
import {
  makeComboId,
  makeFlowId,
  makeMoveId,
  makePositionTransitionId,
} from '../../_utils/lsGenerators'
import { useZustandStore } from '../../_utils/zustandLocalStorage'
import { BRAND } from 'zod'

const confidenceRanking = new Map<number, string>([
  [1, 'I tried'],
  [2, 'Feels like 1 move'],
  [3, 'Super confident'],
  [4, 'Has character'],
  [5, 'Complete Freedom'],
])

const idMap: Record<
  SelectedComboSeq[keyof SelectedComboSeq]['type'],
  ComboMove['id']
> = {
  flow: makeFlowId(), //only used as safety
  move: makeMoveId(),
  custom: 'custom',
  transition: makePositionTransitionId(),
}

function convertComboMovesToSelectedComboSeq(
  comboMoves: ComboMove[],
): SelectedComboSeq {
  return comboMoves.reduce((acc, { moves, type, id }, index) => {
    acc[index] = { type, moves, id }
    return acc
  }, {} as SelectedComboSeq)
}

//-----------------local types-------------

type SelectedComboNumber = boolean[]

type SelectedComboSeq = {
  [key: number]: {
    id?: FlowId | MoveId | PositionTransitionId | 'custom'
    type: 'flow' | 'move' | 'custom' | 'transition'
    moves: string[]
  }
}

type Checked = {
  flows?: true
  useMoves?: true
  custom?: true
}

const RenderMakeCombo = () => {
  //------------------------------state---------------------------------
  const [rating, setRating] = useState<number>(1)
  const [hideUsedFlows, setHideUsedFlows] = useState<boolean>(true)
  const [subCategoryRadio, setSubCategoryRadio] = useState<{
    single?: true
    custom?: true
    anySingle?: true
  }>({ single: true })
  const [notes, setNotes] = useState<string>('')
  const [title, setTitle] = useState<string>('')
  const [notification, setNotification] = useState<null | {
    visible?: boolean
    message?: string
  }>(null)
  const [displayFlows, setDisplayFlows] = useState<FlowDictionary | null>(null)
  const [selectedMoveKey, setSelectedMoveKey] = useState<MoveCategories>(
    lsToprock as string & BRAND<'category'>,
  )
  const [customInputVal, setCustomInputVal] = useState<string>('')
  const [checked, setChecked] = useState<Checked>({ flows: true })
  const [singleMove, setSingleMove] = useState<string>('')
  const [selectedComboNumber, setSelectedComboNumber] =
    useState<SelectedComboNumber>([true, false, false])
  const [selectedComboSeq, setSelectedComboSeq] =
    useState<SelectedComboSeq | null>(null)
  const [existingComboId, setSelectedComboId] = useState<ComboId>()
  const [categorySearch, setCategorySearch] = useState<boolean>(false)

  const getLsFlows = useZustandStore((state) => state.getLsFlows)
  const getLsUserMoves = useZustandStore((state) => state.getLsUserMoves)
  const setLsCombos = useZustandStore((state) => state.setLsCombos)
  const getLsCombos = useZustandStore((state) => state.getLsCombos)
  const getLsComboById = useZustandStore((state) => state.getLsComboById)
  const getLsUserMoveCategories = useZustandStore(
    (state) => state.getLsUserMoveCategories,
  )

  const [moveCategories, setMoveCategories] = useState<KeyOfMoves[]>()
  const [category, setCategory] = useState<KeyOfMoves>()
  const [filterFlowIds, setFilterFlowIds] = useState<FlowId[]>()
  const userMoves = getLsUserMoves()
  const currentIndex = selectedComboNumber.indexOf(true)
  const router = useRouter()
  const searchParams = useSearchParams()

  //-----------------------------hooks-------------------------------
  //ADV. OPT. Category Search
  useEffect(() => {
    if (!categorySearch) return
    const lsFlows = getLsFlows()
    if (!lsFlows) return

    //Sets info for the category dropdown
    setMoveCategories(getLsUserMoveCategories())

    //Sets the filters for flow
    if (subCategoryRadio.anySingle) {
      //get all single flows
      setFilterFlowIds(
        Object.entries(lsFlows)
          .filter(([_, flowVal]) => {
            if (!flowVal) return false
            const { entryMove, exitMove, keyMove } = flowVal
            return (
              entryMove.category === keyMove.category &&
              keyMove.category === exitMove.category
            )
          })
          .map(([flowId]) => flowId as FlowId),
      )
    } else if (subCategoryRadio.single) {
      setFilterFlowIds(
        Object.entries(lsFlows)
          .filter(([_, flowVal]) => {
            if (!flowVal) return false
            const { entryMove, exitMove, keyMove } = flowVal
            return (
              category === entryMove.category &&
              entryMove.category === keyMove.category &&
              keyMove.category === exitMove.category
            )
          })
          .map(([flowId]) => flowId as FlowId),
      )
    } else if (subCategoryRadio.custom) {
      console.log('wip')
    }
  }, [
    category,
    categorySearch,
    getLsFlows,
    getLsUserMoveCategories,
    subCategoryRadio,
  ])

  //Handle existing combo querystring
  useEffect(() => {
    const existingId = searchParams.get(comboIdKey) as ComboId
    if (!existingId) return

    const existingCombo = getLsComboById(existingId)
    if (!existingCombo) return

    setSelectedComboId(existingId)
    const { displayName, notes, execution, sequence } = existingCombo
    setTitle(displayName)
    setNotes(notes)
    setRating(execution)
    setSelectedComboSeq(convertComboMovesToSelectedComboSeq(sequence))
  }, [getLsComboById, searchParams])

  //Show Notifcation for 2 seconds
  useEffect(() => {
    const fadeOutTimer = setTimeout(
      () => setNotification({ visible: false }),
      2000,
    )
    return () => clearTimeout(fadeOutTimer)
  }, [notification?.visible])

  //EDGECASE: when user selects usemove for the very first time show default move
  useEffect(() => {
    if (
      checked.useMoves &&
      selectedComboSeq?.[currentIndex]?.type === 'move' &&
      !selectedComboSeq?.[currentIndex].moves[0]
    ) {
      setSelectedComboSeq((prev) => ({
        ...prev,
        [currentIndex]: {
          type: 'move',
          moves: [userMoves[selectedMoveKey][0]],
        },
      }))
    }
  }, [
    singleMove,
    checked.useMoves,
    selectedComboSeq,
    currentIndex,
    userMoves,
    selectedMoveKey,
  ])

  //EDGECASE: When user selects not "1" and checked.usermoves is alrd selected, auto update to show dropdown option
  useEffect(() => {
    if (checked.useMoves && !selectedComboSeq?.[currentIndex]) {
      setSelectedComboSeq((prev) => ({
        ...prev,
        [currentIndex]: {
          type: 'move',
          moves: [singleMove] || [userMoves[selectedMoveKey][0]],
        },
      }))
    }
  }, [
    checked.useMoves,
    currentIndex,
    selectedComboNumber,
    selectedComboSeq,
    selectedMoveKey,
    singleMove,
    userMoves,
  ])

  //user typing updates the move view
  useEffect(() => {
    const selectedKey = selectedComboNumber.indexOf(true)

    //if checkbox is ticked
    if (checked.custom && customInputVal) {
      //and there is a change in text
      if ([customInputVal][0] !== selectedComboSeq?.[selectedKey]?.moves?.[0])
        setSelectedComboSeq({
          ...selectedComboSeq,
          [selectedComboNumber.indexOf(true)]: {
            type: 'custom',
            moves: [customInputVal],
          },
        })
    }
  }, [checked.custom, customInputVal, selectedComboNumber, selectedComboSeq])

  //gets flows on mount
  useEffect(() => {
    setDisplayFlows(getLsFlows())
  }, [getLsFlows])

  //-----------------------------render---------------------------------
  return (
    <main className="mt-20 flex w-full max-w-xs flex-col items-center justify-between text-sm dark:text-gray-600 ">
      <hgroup>
        <h1 className="title-font mb-2 text-center text-3xl font-medium sm:text-4xl dark:text-white">
          {existingComboId ? 'Edit Combo' : 'Make Combo'}
        </h1>
        {!!existingComboId || (
          <p className="mx-2 text-center text-base leading-relaxed lg:w-2/3">
            {`Make a combo for use in cyphers, battles, performances, or just for fun.`}
          </p>
        )}
      </hgroup>
      {/* ---------------------spacer------------------- */}
      <section className="mb-4 mt-2 flex w-10 justify-center">
        <div className="inline-flex h-1 w-16 rounded-full bg-indigo-500" />
      </section>
      {/* -----------------------combo name------------------ */}
      <article className="mt-5 w-full px-5">
        <h2 className="text-xs ">Combo Name:</h2>
        <input
          className="w-full rounded border border-gray-300 bg-gray-100 bg-opacity-50 px-3 py-1 text-xs leading-8 text-gray-700 outline-none transition-colors duration-200 ease-in-out focus:border-indigo-500 focus:bg-transparent focus:ring-2 focus:ring-indigo-200 dark:border-gray-700 dark:bg-gray-800 dark:bg-opacity-40 dark:text-gray-100 dark:focus:ring-indigo-900"
          type="text"
          value={title}
          placeholder="Super Combo 9000"
          onChange={(e) => setTitle(e.target.value)}
        />
      </article>
      {/* --------------------combo sequence------------------ */}
      <article className="w-full px-5">
        <h2 className="mb-2 mt-5 w-full text-xs">Combo Sequence:</h2>
        <ol className="mr-5 ">
          {selectedComboSeq &&
            Object.entries(selectedComboSeq).map(([key, value], index) => {
              return (
                <li
                  key={index}
                  className={
                    selectedComboNumber.indexOf(true) === Number(key)
                      ? 'text-indigo-500'
                      : ''
                  }
                >
                  {(value.moves.length &&
                    `${Number(key) + 1}. ${value.moves.join(' -> ')}`) ||
                    'no move selected'}
                </li>
              )
            })}
        </ol>
        {!!selectedComboSeq || (
          <p className="text-xs">Pick a dropdown below to get started</p>
        )}
      </article>
      {/* -----------------------step buttons--------------------- */}
      <article className="container mx-auto mt-10 flex flex-col flex-wrap px-5">
        <h2 className="text-xs">Editing:</h2>
        <section className="mx-auto flex flex-wrap ">
          {selectedComboNumber.map((isSelected, index) => {
            const text =
              index + 1 === selectedComboNumber.length ? '+' : `${index + 1}`

            return (
              <>
                <button
                  key={index}
                  className={`title-font flex w-1/4 min-w-20 max-w-20
                     items-center justify-center border-b-2 px-5
                     py-3 text-xs font-medium leading-none tracking-wider enabled:border-gray-200 enabled:hover:text-gray-900 disabled:rounded-t disabled:border-indigo-500  disabled:text-indigo-500 sm:w-auto sm:justify-start sm:px-6 enabled:dark:border-gray-800 enabled:dark:hover:text-white disabled:dark:bg-gray-800 disabled:dark:text-white `}
                  disabled={isSelected}
                  onClick={() => {
                    if (text === '+') {
                      setSelectedComboNumber((prevState) => [
                        ...prevState,
                        false,
                      ])
                    } else {
                      setSelectedComboNumber(
                        selectedComboNumber.map((_, i) => !!(i === index)),
                      )
                    }
                  }}
                >
                  {text}
                </button>
                {
                  //dont render first and last delete button
                  index !== 0 && selectedComboNumber.length > index + 1 && (
                    <button className="size-1">
                      <RenderRedHoldButton
                        onClick={() => {
                          setSelectedComboSeq((prevState) =>
                            produce(prevState, (draft) => {
                              if (draft) {
                                delete draft[index]

                                //sort keys numerically
                                const keys = Object.keys(draft)
                                  .map(Number)
                                  .sort((a, b) => a - b)
                                for (let key of keys) {
                                  if (key > index) {
                                    draft[key - 1] = draft[key]
                                    delete draft[key]
                                  }
                                }
                              }
                            }),
                          )
                          setSelectedComboNumber((prevState) =>
                            prevState.toSpliced(index, 1),
                          )
                        }}
                      />
                    </button>
                  )
                }
              </>
            )
          })}
        </section>
        <article className="mt-5 flex w-full flex-col text-center">
          {/* -----------------------flows--------------------- */}
          <article>
            <label className="flex rounded bg-indigo-50 px-2 py-1 text-xs font-medium tracking-widest text-indigo-500 dark:bg-gray-800 dark:text-gray-400">
              FLOWS
              <input
                className="ml-2"
                checked={!!checked.flows}
                onChange={(_) => {
                  checked.flows ? setChecked({}) : setChecked({ flows: true })
                }}
                type="radio"
              />
            </label>
            {/* -----------------advanced options---------------- */}
            <section className="mt-5 text-center">
              <details className="flex flex-col text-center leading-snug">
                <summary className="text-xs">Advanced Options</summary>
                <section className="mt-2">
                  <section className="ml-2 mt-1 ">
                    <label className="text-xs">Hide Used</label>
                    <input
                      className="ml-2"
                      checked={hideUsedFlows}
                      onClick={() => setHideUsedFlows((prev) => !prev)}
                      type="checkbox"
                    />
                  </section>
                </section>

                <article>
                  <section>
                    <label className="text-xs">
                      Category Search
                      <input
                        className="ml-2"
                        checked={categorySearch}
                        onClick={() => setCategorySearch((prev) => !prev)}
                        type="checkbox"
                      />
                    </label>
                  </section>
                  {categorySearch && (
                    <article>
                      <section className="mt-1 text-2xs">
                        <label className="">
                          Single
                          <input
                            className="ml-1"
                            type="radio"
                            name="singleOrMulti"
                            checked={subCategoryRadio.single}
                            onChange={() =>
                              setSubCategoryRadio({ single: true })
                            }
                          />
                        </label>
                        {/* <label className="ml-2 ">
                          Custom
                          <input
                            type="radio"
                            name="singleOrMulti"
                            className="ml-1"
                            checked={subCategoryRadio.custom}
                            onChange={() =>
                              setSubCategoryRadio({ custom: true })
                            }
                          />
                        </label> */}
                        <label className="ml-2 ">
                          Any Singular Category
                          <input
                            type="radio"
                            name="singleOrMulti"
                            className="ml-1"
                            checked={subCategoryRadio.anySingle}
                            onChange={() =>
                              setSubCategoryRadio({ anySingle: true })
                            }
                          />
                        </label>
                      </section>
                      {subCategoryRadio.single && (
                        <select
                          className="focus:shadow-outline mt-1 block w-full appearance-none rounded-lg border border-gray-300 bg-white px-4 py-2 pr-10 leading-tight focus:outline-none enabled:hover:border-gray-500 disabled:opacity-35 dark:border-indigo-500 dark:bg-transparent dark:bg-none dark:text-white dark:disabled:opacity-10"
                          value={category}
                          onChange={(e) => {
                            setCategory(e.target.value as KeyOfMoves)
                          }}
                        >
                          <option value="">Select a category</option>
                          {moveCategories &&
                            moveCategories.map((category) => {
                              return (
                                <option key={category} value={category}>
                                  {category}
                                </option>
                              )
                            })}
                        </select>
                      )}
                    </article>
                  )}
                </article>
              </details>
              <section className="flex flex-col"></section>
            </section>
            {/* ------------------end of advanced options------------- */}
            {checked.flows && (
              <section className="flex flex-col ">
                <section className="mt-2 flex overflow-x-scroll">
                  {displayFlows &&
                    Object.entries(displayFlows)
                      .sort(([_, a], [__, b]) => {
                        if (!b || !a) return 0
                        return b.rating - a.rating
                      })
                      .map(([flowId, flowVal], flowIndex) => {
                        if (!flowVal) return
                        const { entryMove, exitMove, keyMove, rating, notes } =
                          flowVal
                        const combos = getLsCombos()

                        //checks if flowId exists in one of the combos
                        const flowIsUsed = Object.values(combos || {}).some(
                          (a) => a && a.sequence.some((b) => b.id === flowId),
                        )

                        //ADV OPT: Category Search.
                        if (
                          categorySearch &&
                          filterFlowIds &&
                          !filterFlowIds.some((a) => a === flowId)
                        ) {
                          return
                        }

                        //ADV OPT: Hide used flows.
                        if (flowIsUsed && hideUsedFlows) return

                        const indexOfCurCombo =
                          selectedComboNumber.indexOf(true)
                        const isSelected =
                          selectedComboSeq?.[indexOfCurCombo]?.type ===
                            'flow' &&
                          selectedComboSeq[indexOfCurCombo].moves.join('') ===
                            [
                              entryMove.displayName,
                              keyMove.displayName,
                              exitMove.displayName,
                            ].join('')

                        return (
                          <button
                            className={`w-1/3 p-1 ${isSelected && 'bg-lime-300 dark:bg-lime-900 '}`}
                            key={flowIndex}
                            onClick={() =>
                              setSelectedComboSeq((prevState) => {
                                return {
                                  ...prevState,
                                  [indexOfCurCombo]: {
                                    type: 'flow',
                                    id: flowId as FlowId,
                                    moves: [
                                      entryMove.displayName,
                                      keyMove.displayName,
                                      exitMove.displayName,
                                    ],
                                  },
                                }
                              })
                            }
                          >
                            <div className="relative flex h-full flex-col overflow-hidden rounded-lg bg-gray-100 bg-opacity-75 p-3 text-center dark:bg-gray-800 dark:bg-opacity-40">
                              <section className="flex flex-row-reverse">
                                {Array.from(Array(5)).map((_, i) => {
                                  return (
                                    <RenderThunder
                                      key={i}
                                      checked={i === 5 - rating}
                                    />
                                  )
                                })}
                              </section>

                              <section className="title-font mb-1 text-[9px] font-medium text-black dark:text-white">
                                {[
                                  {
                                    category: entryMove.category,
                                    displayText: entryMove.displayName,
                                  },
                                  {
                                    category: keyMove.category,
                                    displayText: keyMove.displayName,
                                  },
                                  {
                                    category: exitMove.category,
                                    displayText: exitMove.displayName,
                                  },
                                ].map(({ category, displayText }) => {
                                  return (
                                    <section
                                      key={displayText}
                                      className="flex flex-col items-start overflow-hidden text-ellipsis whitespace-nowrap leading-none"
                                    >
                                      <h3 className="text-[6px] text-gray-400 dark:text-gray-500">{`${category}: `}</h3>
                                      <p>{displayText}</p>
                                    </section>
                                  )
                                })}
                              </section>
                              <p className="text-[6px]  leading-relaxed">
                                {notes}
                              </p>
                            </div>
                          </button>
                        )
                      })}
                </section>
              </section>
            )}
          </article>
          {/* ---------------------moves------------------ */}
          <article>
            <label className="flex rounded bg-indigo-50 px-2 py-1 text-xs font-medium tracking-widest text-indigo-500 dark:bg-gray-800 dark:text-gray-400">
              USE MOVE
              {/* -----------------radio--------------- */}
              <input
                className="ml-2"
                checked={!!checked.useMoves}
                onChange={(e) => {
                  //if checked, uncheck
                  if (checked.useMoves) {
                    setChecked({})
                  } else {
                    setChecked({ useMoves: true })
                    setSingleMove(userMoves[selectedMoveKey][0])
                    setSelectedComboSeq((prev) => ({
                      ...prev,
                      [currentIndex]: {
                        type: 'move',
                        moves: [singleMove],
                      },
                    }))
                  }
                }}
                type="radio"
              />
            </label>
            {/* -----------------category------------- */}
            <section>
              {checked.useMoves && (
                <section className="flex flex-col text-left">
                  <label className="text-xs">
                    {`Category: `}
                    <select
                      className="w-full rounded-md border border-gray-300 px-4 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      onChange={(e) => {
                        setSelectedMoveKey(e.target.value as MoveCategories)
                      }}
                    >
                      {Object.entries(userMoves).map(([key, value]) => {
                        return (
                          <>
                            {
                              <option key={key} value={key}>
                                {key}
                              </option>
                            }
                          </>
                        )
                      })}
                    </select>
                  </label>
                  {/* -------------single move----------------- */}
                  <label className="text-xs">
                    {`Move: `}
                    {userMoves[selectedMoveKey].length > 0 && (
                      <select
                        defaultValue={userMoves[selectedMoveKey][0]}
                        className="w-full rounded-md border border-gray-300 px-4 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={singleMove}
                        onChange={(e) => {
                          setSingleMove(e.target.value)
                          setSelectedComboSeq((prev) => ({
                            ...prev,
                            [currentIndex]: {
                              type: 'move',
                              moves: [e.target.value],
                            },
                          }))
                        }}
                      >
                        {userMoves[selectedMoveKey].map((value) => {
                          return (
                            <>
                              {
                                <option key={value} value={value}>
                                  {value}
                                </option>
                              }
                            </>
                          )
                        })}
                      </select>
                    )}
                  </label>
                </section>
              )}
            </section>
          </article>
          {/* ---------------------custom------------------ */}
          <article>
            <label className="flex rounded bg-indigo-50 px-2 py-1 text-xs font-medium tracking-widest text-indigo-500 dark:bg-gray-800 dark:text-gray-400">
              CUSTOM
              <input
                className="ml-2"
                checked={!!checked.custom}
                onChange={() => {
                  //if turn off reset display
                  if (checked.custom) {
                    setSelectedComboSeq((original) => {
                      return produce(original, (draft) => {
                        if (draft) {
                          draft[selectedComboNumber.indexOf(true)].moves = []
                        }
                      })
                    })
                  } else {
                    setSelectedComboSeq({
                      ...selectedComboSeq,
                      [selectedComboNumber.indexOf(true)]: {
                        type: 'custom',
                        moves: [customInputVal],
                      },
                    })
                  }
                  checked.custom ? setChecked({}) : setChecked({ custom: true })
                }}
                type="radio"
              />
            </label>
            {checked.custom && (
              <label className="">
                {`Custom Move: `}
                <>
                  <input
                    disabled={!checked.custom}
                    value={customInputVal}
                    onChange={(e) => setCustomInputVal(e.target.value || '')}
                    className="w-full rounded border border-gray-300 bg-gray-100 bg-opacity-50 px-3 py-1 text-base leading-8 text-gray-700 outline-none transition-colors duration-200 ease-in-out focus:border-indigo-500 focus:bg-transparent focus:ring-2 focus:ring-indigo-200 dark:border-gray-700 dark:bg-gray-800 dark:bg-opacity-40 dark:text-gray-100 dark:focus:ring-indigo-900"
                    type="text"
                    defaultValue={''}
                  />
                </>
              </label>
            )}
          </article>
          {/* ------------------how much do you like it?----------------- */}
          <article className="mt-10">
            <label className="">Confidence Ranking</label>
            <section className="mt-5 flex flex-row-reverse place-content-center">
              {Array.from(Array(5)).map((_, i) => {
                return (
                  <RenderThunder
                    id={5 - i + ''}
                    checked={i === 5 - rating}
                    onChange={(e) => {
                      setRating(Number(e.target.id))
                    }}
                    color="peer-checked:text-indigo-500"
                    key={i}
                    size="size-10"
                  />
                )
              })}
            </section>
            <p className="text-4xs">{confidenceRanking.get(rating)}</p>
          </article>
          {/* --------------------notes----------------------- */}
          <section className="mt-5">
            <h2>Notes</h2>
            <textarea
              onChange={(e) => setNotes(e.target.value)}
              value={notes}
              className="h-32 w-full resize-none rounded border border-gray-300 bg-gray-100 bg-opacity-50 px-3 py-1 text-xs text-gray-700 outline-none transition-colors duration-200 ease-in-out focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-200 dark:border-gray-700 dark:bg-gray-800 dark:bg-opacity-40 dark:text-gray-100 dark:focus:bg-gray-900 dark:focus:ring-indigo-900"
            />
          </section>
          <Notification
            visible={!!notification?.visible}
            message={notification?.message || ''}
          />
          {/* -------------------save button----------------- */}
          <button
            onClick={(_) => {
              //Update existing combo
              if (existingComboId && selectedComboSeq) {
                const comboFormat = {
                  displayName: title,
                  execution: rating,
                  sequence: Object.keys(selectedComboSeq).map((key) => {
                    const { type, moves, id } = selectedComboSeq[Number(key)]
                    return { type, id: id || 'custom', moves }
                  }),
                  notes: notes,
                }
                setLsCombos(comboFormat, existingComboId)
                setNotification({ visible: true, message: 'Combo Saved!' })
                router.push('/battle')
              }
              //Save a new Combo
              else if (selectedComboSeq) {
                const comboFormat = {
                  displayName: title,
                  execution: rating,
                  sequence: Object.keys(selectedComboSeq).map((key) => {
                    const comboSeq = selectedComboSeq[Number(key)]
                    return {
                      type: comboSeq.type,
                      id:
                        (comboSeq.type === 'flow' && comboSeq.id) ||
                        idMap[comboSeq.type] ||
                        'custom',
                      moves: comboSeq.moves,
                    }
                  }),
                  notes: notes,
                }

                setLsCombos(comboFormat, makeComboId())
                setNotification({ visible: true, message: 'Combo Saved!' })
                router.push('/combos')
              } else {
                console.log('theres no selectedComboSeq')
              }
            }}
            className="mt-5 inline-flex rounded border-0 bg-indigo-500 px-6 py-2 text-xs text-white hover:bg-indigo-600 focus:outline-none"
          >
            SAVE
          </button>
        </article>
      </article>
    </main>
  )
}

export default function RenderPageMakeCombo() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <RenderMakeCombo />
    </Suspense>
  )
}
