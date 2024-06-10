'use client'
// @format
import { useRef } from 'react'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { Notification } from '../_components/Notification'
import { useZustandStore } from '../_utils/zustandLocalStorage'
import { MoveTransition, extractMoveTransitions } from '../_utils/lib'
import {
  makeMoveTransitionId,
  makePositionTransitionId,
} from '../_utils/lsGenerators'

type SelectedMove = {
  selectedMove?: string
  selectedCategory?: string
}

function getRandomMove(arr: Array<[string, string[]]>): SelectedMove {
  const newArr = arr.filter((val) => val[1].length > 1)
  if (newArr.length === 0) return {}

  const randomElement = newArr[Math.floor(Math.random() * newArr.length)]
  if (randomElement[1].length === 0) return {}
  const val = {
    selectedMove:
      randomElement[1][Math.floor(Math.random() * randomElement[1].length)],
    selectedCategory: randomElement[0],
  }
  return val
}

//----------------------------mainrender--------------------------

/*
 * Renders 3 moves with 3 buttons at the bottom.
 */
export default function RenderTransitions() {
  //-----------------------------state-----------------------------
  //learning refers to "what will be displayed" and is RNG set
  const [{ notificationVisible, message }, setNotification] = useState<{
    notificationVisible: boolean
    message: string
  }>({ notificationVisible: false, message: '' })
  const [{ selectedMove, selectedCategory }, setSelectedMove] =
    useState<SelectedMove>({})
  const [flowTransitions, setTransitions] = useState<MoveTransition[]>([])
  const [moves, setMoves] = useState<Array<[string, string[]]>>([])
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const [overrideTransitions, setOverrideTransitions] = useState<
    MoveTransition[]
  >([])
  const getLsUserMoves = useZustandStore((state) => state.getLsUserMoves)
  const getLsFlows = useZustandStore((state) => state.getLsFlows)
  const getLsTransitions = useZustandStore((state) => state.getLsTransitions)
  const setLsTransitions = useZustandStore((state) => state.setLsTransitions)

  const modalRef = useRef<HTMLDivElement>(null)
  const totalRelevantTransitionsCanDo: number = overrideTransitions.filter(
    ({ canDo, moveFrom }) =>
      canDo &&
      selectedCategory === moveFrom.category &&
      moveFrom.displayName === selectedMove,
  ).length
  const totalFlowTransitions =
    moves?.reduce((acc, [, strings]) => acc + strings.length, 0) || 0
  const totalImpossiblesFromMoveA = overrideTransitions.filter(
    ({ isImpossible, moveFrom }) =>
      isImpossible &&
      selectedCategory === moveFrom.category &&
      moveFrom.displayName === selectedMove,
  ).length

  const options = [
    { id: 'job-1', label: 'I can do it! ❤️‍🔥', description: 'Success' },
    { id: 'job-2', label: 'Too hard 🐸', description: 'Attempt' },
    {
      id: 'job-3',
      label: "It's literally impossible 😅",
      description: 'Invalid Selection',
    },
    {
      id: 'job-4',
      label: "I'm skipping 🏃‍♂️",
      description: 'Not going to try',
    },
  ]
  // --------------hooks--------
  //onload getCurrentLsTransitions and set to override local state
  useEffect(() => {
    setOverrideTransitions(getLsTransitions() || [])
  }, [getLsTransitions])

  //Sets transitions from flow on load
  useEffect(() => {
    const allTrans = extractMoveTransitions(getLsFlows())
    //filters transitions to just MoveA
    setTransitions(
      allTrans.filter(
        ({ moveFrom }) =>
          moveFrom.category === selectedCategory &&
          moveFrom.displayName === selectedMove,
      ),
    )
  }, [getLsFlows, selectedCategory, selectedMove])

  //Show Notifcation for 2 seconds
  useEffect(() => {
    const fadeOutTimer = setTimeout(
      () => setNotification({ notificationVisible: false, message: '' }),
      2000,
    )
    return () => clearTimeout(fadeOutTimer)
  }, [notificationVisible])

  //Hide
  useEffect(() => {
    setMoves(Object.entries(getLsUserMoves()))
  }, [getLsUserMoves])

  //Modal Handling
  useEffect(() => {
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    } else {
      document.removeEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen])

  //-------------------------handlers--------------------------------
  //Modal Click Outside
  const handleClickOutside = (event: MouseEvent) => {
    if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
      setIsOpen(false)
    }
  }

  //-----------------------render--------------------
  return (
    <main className="mt-20 flex w-full max-w-xs flex-col items-center justify-between text-sm dark:text-gray-600 ">
      {/* -------------------TITLE SECTION--------------- */}
      <section className="mb-5 flex w-full flex-col text-center dark:text-gray-400">
        {/* ---------------------------TITLE------------------------ */}
        <hgroup>
          <h1 className="title-font mb-2 text-3xl font-medium sm:text-4xl dark:text-white">
            Transitions
          </h1>
          <p className="mx-auto px-2 text-sm leading-relaxed lg:w-2/3">
            {`Learn every move into every other move`}
          </p>
        </hgroup>
      </section>
      {/* ----------END OF TITLE SECTION------------- */}
      <section className="mb-2">
        <p className="text-default-500 text-small">
          {selectedMove
            ? `Selected: ${selectedMove}`
            : `Select a move below 🤫`}
        </p>
        <p>
          {selectedMove &&
            `${flowTransitions.length + totalRelevantTransitionsCanDo}/${totalFlowTransitions - totalImpossiblesFromMoveA}`}
        </p>
      </section>
      {/* ---------------MOVES---------------- */}
      <section className="flex w-full">
        {/* //----------------------MOVE A----------------------- */}
        <article className="w-1/2 rounded-lg bg-slate-100 p-2 pb-10 dark:bg-gray-800 dark:bg-opacity-40">
          <h2 className="text-lg">Move A</h2>
          <section
            className="scrollbar scrollbar-thin scrollbar-thumb-rounded scrollbar-thumb-dark 
            h-64 overflow-y-scroll rounded p-4"
          >
            {moves &&
              moves.map(([category, moves], moveIndex) => {
                //dont show empty categories
                if (moves.length < 1) return

                return (
                  <article key={moveIndex}>
                    <h3 className="mb-1 text-base font-bold">{category}</h3>
                    <section className="flex flex-col">
                      {moves.map((move, moveIndex) => (
                        <label key={moveIndex} className="mb-1">
                          <input
                            type="radio"
                            name="baseMove"
                            checked={
                              selectedMove === move &&
                              selectedCategory === category
                            }
                            className="mr-2 text-blue-500"
                            value={move}
                            onClick={() => {
                              //deselect if selected
                              if (selectedMove === move) {
                                setSelectedMove({})
                              }
                            }}
                            onChange={(e) => {
                              setSelectedMove({
                                selectedMove: e.target.value,
                                selectedCategory: category,
                              })
                            }}
                          />
                          {move}
                        </label>
                      ))}
                    </section>
                  </article>
                )
              })}
          </section>
          <button
            className="mt-5 rounded-md border border-indigo-500 p-1 text-2xs text-indigo-500"
            onClick={() => setSelectedMove(getRandomMove(moves))}
          >
            Choose Random
          </button>
        </article>
        {/* -------------------MOVE B---------------- */}
        <article
          className={`ml-1 w-1/2 rounded-lg bg-slate-100 p-2 pb-10 dark:bg-gray-800 dark:bg-opacity-40 ${selectedMove || 'opacity-20'}`}
        >
          <h2 className="text-lg">Move B</h2>
          <div
            className="scrollbar scrollbar-thin scrollbar-thumb-rounded scrollbar-thumb-dark 
    mx-4 h-64 overflow-y-scroll rounded"
          >
            {moves &&
              moves.map(([category, moves], moveIndex) => {
                return (
                  <article key={moveIndex}>
                    <h3 className="mb-1 text-base font-bold">{category}</h3>
                    <section className="flex flex-col">
                      {moves.map((move, moveIndex) => {
                        const isOverridden = overrideTransitions.find(
                          ({ moveTo, moveFrom }) => {
                            return (
                              moveTo.category === category &&
                              moveTo.displayName === move &&
                              moveFrom.category === selectedCategory &&
                              moveFrom.displayName === selectedMove
                            )
                          },
                        )
                        const isImpossible = isOverridden?.isImpossible

                        const isChecked =
                          flowTransitions.some(({ moveTo }) => {
                            return (
                              moveTo.category === category &&
                              moveTo.displayName === move
                            )
                          }) || !!isOverridden?.canDo

                        return (
                          <article
                            className="mb-3 flex flex-col"
                            key={moveIndex}
                          >
                            <label className="">
                              {!!isImpossible || (
                                <input
                                  className="mr-2"
                                  checked={isChecked}
                                  type="checkbox"
                                  onClick={() => {
                                    //send notification if flow is overriding the ability to turn off
                                    if (isChecked && !isOverridden?.canDo) {
                                      setNotification({
                                        notificationVisible: true,
                                        message: 'Flow is overriding this move',
                                      })
                                      return
                                    }

                                    setOverrideTransitions((prev) => {
                                      if (isOverridden) {
                                        const index = prev.findIndex(
                                          (move) =>
                                            move.moveTransitionId ===
                                            isOverridden.moveTransitionId,
                                        )
                                        return index > -1 && isOverridden
                                          ? prev.toSpliced(index, 1, {
                                              ...isOverridden,
                                              isImpossible: false,
                                              canDo: !isChecked,
                                            })
                                          : prev
                                      }
                                      const newTrans: MoveTransition = {
                                        canDo: !isChecked,
                                        moveTransitionId:
                                          makeMoveTransitionId(),
                                        isImpossible: false,
                                        moveFrom: {
                                          category: selectedCategory || '',
                                          displayName: selectedMove || '',
                                        },
                                        moveTo: {
                                          category,
                                          displayName: move,
                                        },
                                      }
                                      return [...prev, newTrans]
                                    })
                                  }}
                                />
                              )}
                              <span
                                className={`${isImpossible && 'line-through'}`}
                              >
                                {move}
                              </span>
                            </label>
                            <section className="flex">
                              {false && (
                                <button
                                  onClick={() => setIsOpen(true)}
                                  className={`mt-1 w-min rounded-md border border-indigo-500 p-0.5  py-0 text-3xs text-indigo-500 ${!isImpossible ? 'opacity-100' : 'opacity-20'}`}
                                  type="button"
                                >
                                  Attempt
                                </button>
                              )}
                              <button
                                onClick={() =>
                                  setOverrideTransitions((prev) => {
                                    if (isOverridden) {
                                      const overrideIndex = prev.findIndex(
                                        (move) =>
                                          move.moveTransitionId ===
                                          isOverridden.moveTransitionId,
                                      )
                                      return overrideIndex > -1 && isOverridden
                                        ? prev.toSpliced(overrideIndex, 1, {
                                            ...isOverridden,
                                            isImpossible: !isImpossible,
                                          })
                                        : prev
                                    }
                                    const newTrans: MoveTransition = {
                                      canDo: isChecked,
                                      moveTransitionId: makeMoveTransitionId(),
                                      isImpossible: true,
                                      moveFrom: {
                                        category: selectedCategory || '',
                                        displayName: selectedMove || '',
                                      },
                                      moveTo: {
                                        category,
                                        displayName: move,
                                      },
                                    }
                                    return [...prev, newTrans]
                                  })
                                }
                                className={`ml-1 mt-1 w-min rounded-md border border-indigo-500 p-0.5  py-0 text-3xs text-indigo-500 ${isImpossible ? 'opacity-100' : 'opacity-20'}`}
                                type="button"
                              >
                                Impossible
                              </button>
                            </section>
                          </article>
                        )
                      })}
                    </section>
                  </article>
                )
              })}
          </div>
        </article>
        {/* ---------------END OF MOVE B------------ */}
      </section>
      {/* ---------------END OF MOVES------------ */}

      {/* ----------------------------------RESULT BUTTONS------------------------------------ */}
      <Notification visible={notificationVisible} message={message} />
      <p>{`Transitions from flows: ${flowTransitions.length}`}</p>
      <p>{`Transitions manually set here: ${totalRelevantTransitionsCanDo}`}</p>
      <p>{`Moves total: ${totalFlowTransitions}`}</p>
      <p>{`Impossible moves: ${totalImpossiblesFromMoveA}`}</p>

      {
        <div className="flex justify-evenly px-2 py-5 text-xs">
          <section>
            <button
              onClick={(_) => {
                setNotification({ notificationVisible: true, message: 'Saved' })
                setLsTransitions(overrideTransitions)
              }}
              className="inline-flex h-fit rounded border-0 bg-indigo-500 px-6 py-2 text-xs text-white hover:bg-indigo-600 focus:outline-none"
            >
              SAVE
            </button>
          </section>
        </div>
      }

      {/* ==================MODAL===================== */}
      {isOpen && (
        <div
          id="select-modal"
          tabIndex={-1}
          aria-hidden="true"
          className="fixed inset-0 z-50 flex h-full w-full items-center justify-center overflow-y-auto overflow-x-hidden bg-gray-800 bg-opacity-50"
        >
          <div
            className="relative max-h-full w-full max-w-md p-4"
            ref={modalRef}
          >
            {/* Modal content */}
            <div className="relative rounded-lg bg-white shadow dark:bg-gray-700">
              {/* Modal header */}
              <div className="flex items-center justify-between rounded-t border-b p-4 md:p-5 dark:border-gray-600">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Attempt Move
                </h3>
                <button
                  type="button"
                  className="ms-auto inline-flex h-8 w-8 items-center justify-center rounded-lg bg-transparent text-sm text-gray-400 hover:bg-gray-200 hover:text-gray-900 dark:hover:bg-gray-600 dark:hover:text-white"
                  onClick={() => setIsOpen(false)}
                >
                  <svg
                    className="h-3 w-3"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 14 14"
                  >
                    <path
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                    />
                  </svg>
                  <span className="sr-only">Close modal</span>
                </button>
              </div>
              {/* Modal body */}
              <article className="p-4 md:p-5">
                <p>{`Backflip -> Chocolate hunter`}</p>
                <p className="mb-4 text-gray-500 dark:text-gray-400">
                  Update the status:
                </p>
                <ul className="mb-4 space-y-4">
                  {options.map((option) => (
                    <li key={option.id}>
                      <input
                        type="radio"
                        id={option.id}
                        name="job"
                        value={option.id}
                        className="peer hidden"
                        required={option.id === 'job-1'}
                      />
                      <label
                        htmlFor={option.id}
                        className="inline-flex w-full cursor-pointer items-center justify-between rounded-lg border border-gray-200 bg-white p-5 text-gray-900 hover:bg-gray-100 hover:text-gray-900 peer-checked:border-blue-600 peer-checked:text-blue-600 dark:border-gray-500 dark:bg-gray-600 dark:text-white dark:hover:bg-gray-500 dark:hover:text-gray-300 dark:peer-checked:text-blue-500"
                      >
                        <div className="block">
                          <div className="w-full text-lg font-semibold">
                            {option.label}
                          </div>
                          <div className="w-full text-gray-500 dark:text-gray-400">
                            {option.description}
                          </div>
                        </div>
                        <svg
                          className="ms-3 h-4 w-4 text-gray-500 rtl:rotate-180 dark:text-gray-400"
                          aria-hidden="true"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 14 10"
                        >
                          <path
                            stroke="currentColor"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M1 5h12m0 0L9 1m4 4L9 9"
                          />
                        </svg>
                      </label>
                    </li>
                  ))}
                </ul>
                <button
                  className="inline-flex w-full justify-center rounded-lg bg-blue-700 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                  onClick={() => setIsOpen(false)}
                >
                  Save
                </button>
              </article>
            </div>
          </div>
        </div>
      )}
      {/* //-----------------end of modal------------ */}
    </main>
  )
}
