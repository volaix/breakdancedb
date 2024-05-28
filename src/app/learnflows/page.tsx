'use client'
// @format
import { makeFlowId } from '@/app/_utils/lsMakers'
import { useCallback, useEffect, useState } from 'react'
import { RenderRedoIcon } from '../_components/Svgs'
import {
  BasicFlow,
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
import RenderThunder from '../_components/RenderChilli'

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

//------------------------local utils------------------------------
const pickRandomString = (items: string[]): string => {
  return items[Math.floor(Math.random() * items.length)]
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
  const [notificationMessage, setNotificationMessage] = useState<string>('')
  const [textAreaValue, setTextAreaValue] = useState<string>('')
  const [singleCategory, setSingleCategory] = useState<boolean>(true)
  const [selectedCategory, setSelectedCategory] =
    useState<SelectedCategoryState>({
      entryMove: lsToprock,
      keyMove: lsToprock,
      exitMove: lsToprock,
    })
  const [ratingVal, setRatingVal] = useState<number>(1)

  const displayMoves = !!learning
  const setLsFlow = useZustandStore((state) => state.setLsFlow)
  const getLsUserMovesByKey = useZustandStore(
    (state) => state.getLsUserMovesByKey,
  )

  //----------------functions----------------
  const shuffleLearning = useCallback(
    (single?: keyof BasicFlow) => {
      if (single) {
        setLearning((prevLearning) => {
          if (!prevLearning) return null
          return {
            ...prevLearning,
            [single]: pickRandomString(
              getLsUserMovesByKey(selectedCategory[single]),
            ),
          }
        })
      } else {
        setLearning({
          entryMove: pickRandomString(
            getLsUserMovesByKey(selectedCategory.entryMove),
          ),
          keyMove: pickRandomString(
            getLsUserMovesByKey(selectedCategory.keyMove),
          ),
          exitMove: pickRandomString(
            getLsUserMovesByKey(selectedCategory.exitMove),
          ),
        })
      }
    },
    [getLsUserMovesByKey, selectedCategory],
  )

  //---------------------------hooks---------------------------------
  //on mount
  useEffect(() => {
    shuffleLearning()
  }, [shuffleLearning])

  //Show Notifcation for 2 seconds
  useEffect(() => {
    const fadeOutTimer = setTimeout(() => setVisible(false), 2000)
    return () => clearTimeout(fadeOutTimer)
  }, [visible])
  //-------------------------handlers--------------------------------

  //update local storage when user clicks yes
  const onClickYes = () => {
    if (learning) {
      setLsFlow(
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
              New Flow
            </h1>
            <p className="mx-auto px-2 text-base leading-relaxed lg:w-2/3">
              {`Play around with these three moves. Dance through it. Try be you.`}
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
                        border border-gray-300 p-2 dark:border-indigo-500"
                      >
                        <h2 className="font-medium tracking-widest">
                          {learning[dropdown]}
                        </h2>
                        <div className="flex">
                          <div className="mr-1 h-4 w-4">
                            <RenderRedoIcon
                              className="fill-black dark:fill-indigo-500"
                              onClick={() => shuffleLearning(dropdown)}
                            />
                          </div>
                        </div>
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
        <h2 className="pb-2">I like this</h2>
        <div className="flex flex-row-reverse pb-10">
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
        <h2>Notes</h2>
        <div className="w-full px-4">
          <textarea
            className="w-full rounded-lg border border-gray-300 px-4 py-1 text-xs
    shadow-sm focus:border-transparent focus:outline-none
    focus:ring-2 focus:ring-blue-400"
            rows={3}
            cols={30}
            value={textAreaValue}
            onChange={(e) => setTextAreaValue(e.target.value)}
          />
        </div>
        {/* ----------------------------------RESULT BUTTONS------------------------------------ */}
        <Notification visible={visible} message={notificationMessage} />
        {displayMoves && (
          <div className="flex justify-evenly px-2 py-5">
            <a
              onClick={onClickSkip}
              className="rounded border border-indigo-500 px-6 py-2 text-center text-indigo-500"
            >
              re-shuffle
            </a>

            <a
              onClick={onClickYes}
              className="rounded border border-indigo-500 bg-indigo-500 px-6 py-2 text-center text-white "
            >
              Save
            </a>
          </div>
        )}
      </div>
    </main>
  )
}

interface NotificationProps {
  message: string
  visible: boolean
}

const Notification: React.FC<NotificationProps> = ({ message, visible }) => {
  return (
    <div
      className={`transition-opacity duration-1000 ${visible ? 'opacity-100' : 'opacity-0'}`}
    >
      {visible && (
        <div className="rounded bg-blue-500 p-4 text-white">{message}</div>
      )}
    </div>
  )
}
