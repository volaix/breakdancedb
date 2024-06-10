'use client'
// @format
import { useRef } from 'react'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { Notification } from '../_components/Notification'
import { useZustandStore } from '../_utils/zustandLocalStorage'

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
export default function RenderFlows() {
  //-----------------------------state-----------------------------
  //learning refers to "what will be displayed" and is RNG set
  const [{ selectedMove, selectedCategory }, setSelectedMove] =
    useState<SelectedMove>({})
  const [visible, setVisible] = useState(false)
  const [notificationMessage, setNotificationMessage] = useState<string>('')
  const [textAreaValue, setTextAreaValue] = useState<string>('')
  const [ratingVal, setRatingVal] = useState<number>(1)
  const [moves, setMoves] = useState<Array<[string, string[]]>>([])
  const getLsUserMoves = useZustandStore((state) => state.getLsUserMoves)
  // --------------hooks--------
  //Show Notifcation for 2 seconds
  useEffect(() => {
    const fadeOutTimer = setTimeout(() => setVisible(false), 2000)
    return () => clearTimeout(fadeOutTimer)
  }, [visible])

  //Hide
  useEffect(() => {
    setMoves(Object.entries(getLsUserMoves()))
  }, [getLsUserMoves])
  //-------------------------handlers--------------------------------
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const modalRef = useRef<HTMLDivElement>(null)
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

  const handleClickOutside = (event: MouseEvent) => {
    if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
      setIsOpen(false)
    }
  }

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
            `1/${moves?.reduce((acc, [, strings]) => acc + strings.length, 0) || 0}`}
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
              moves.map(([category, moves], moveIndex) => (
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
              ))}
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
                const isImpossible = false
                return (
                  <article key={moveIndex}>
                    <h3 className="mb-1 text-base font-bold">{category}</h3>
                    <section className="flex flex-col">
                      {moves.map((move, moveIndex) => (
                        <article className="mb-3 flex flex-col" key={moveIndex}>
                          <label className="">
                            {!!isImpossible || (
                              <input
                                className="mr-2"
                                type="checkbox"
                                onClick={() => {
                                  console.log('clicked')
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
                            <button
                              onClick={() => setIsOpen(true)}
                              className={`mt-1 w-min rounded-md border border-indigo-500 p-0.5  py-0 text-3xs text-indigo-500 ${!isImpossible ? 'opacity-100' : 'opacity-20'}`}
                              type="button"
                            >
                              Attempt
                            </button>
                            <button
                              onClick={() => console.log('mark as impossible')}
                              className={`ml-1 mt-1 w-min rounded-md border border-indigo-500 p-0.5  py-0 text-3xs text-indigo-500 ${isImpossible ? 'opacity-100' : 'opacity-20'}`}
                              type="button"
                            >
                              Impossible
                            </button>
                          </section>
                        </article>
                      ))}
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
      <Notification visible={visible} message={notificationMessage} />

      {
        <div className="flex justify-evenly px-2 py-5 text-xs">
          <section>
            <Link
              className="rounded border border-indigo-500 px-3 py-2 text-center text-indigo-500"
              href="/yourmoves"
            >
              Go to Learn Move
            </Link>
            <Link
              href="/yourmoves"
              className="rounded border border-indigo-500 px-3 py-2 text-center text-indigo-500"
            >
              Go to Your Moves
            </Link>
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
              <div className="p-4 md:p-5">
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
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  )
}
