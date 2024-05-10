'use client'
import { useState, useEffect, SetStateAction, Dispatch, Suspense } from 'react'
import {
  Hold,
  Move,
  MoveExecution,
  MovementKeys,
  Position,
  PositionId,
  Transition,
  TransitionId,
  getLocalStorageGlobal,
  lsUserLearning,
  updateLocalStorageGlobal,
  useLocalStorage,
} from '@/app/lib'
import { useSearchParams } from 'next/navigation'
import LoadingFallback from '@/app/LoadingFallback'

// ------------------------Local Types ---------------------------------
type MovementGroup = {
  displayName: string
  position?: Position
  transition?: Transition
  hold?: Hold
}

type MovementValue = Position | Transition | Hold
type MovementType = 'static' | 'transition' | 'hold'
//-------------------------------Local Utils---------------------------------

/**
 *
 * Gets text for tooltip
 * @returns
 */
const getText = (type: MovementType): string => {
  switch (type) {
    case 'static':
      return 'For Footwork: statics are dancing using mainly the one position. Get confidence in the movement. Think big hip rotations. Shifting weight. Using hands and feet. Using knees. Adding flow concepts. Spinning. Shoulder alignment.'
    case 'transition':
      return 'For FW: Go from previous pose to current pose. Try whips with legs. Ease-in or Ease-out. Play with speed. Add foot steps inbetween. Alternate heel to toe. Butt slide. Foot slide. Hand slide.'
    case 'hold':
      return 'For FW: Loop like a transition. However this time make sure youre able to suddenly hold inbetween positions at any point. Practice holding at previous position for 4 counts, holding inside the transition for 4 counts, then holding at current position for 4 counts.'
  }
}

/**
 *  Reorders positions and transitions into the correct display order for learnmoves/move/learn page
 * @param positions Position[]
 * @param transitions Transition[]
 * @returns [] of Position, Transition, and Hold
 */
const formatPosTransHolds = (
  positions: Position[] = [],
  transitions: Transition[] = [],
  holds: Hold[] = [],
): MovementGroup[] => {
  //return early if empty arr is given
  if (positions.length === 0) return []
  if (transitions.length === 0) return []

  const lastTransition = transitions[transitions.length - 1]
  const lastHold = holds[holds.length - 1]

  //manually type first and last movements as they have different elements to the rest
  const baseArr: MovementGroup[] = [
    {
      displayName: 'First-Movement',
      position: positions[0],
    },
    {
      displayName: 'Loop-Movement',
      transition: lastTransition,
      hold: lastHold,
    },
  ]
  //get rid of the first and last of positions as these are manually made in base arr.
  const removedFirstAndLast = positions.filter(
    (a, i) => !(i === positions.length || i === 0),
  )

  //insert a formatted Movement[] inside baseArr
  return baseArr.toSpliced(
    1,
    0,
    ...removedFirstAndLast.map((a, i) => {
      //i is 0 based index
      return {
        displayName: `movement-group-${i + 2}`,
        position: a,
        transition: transitions[i],
        hold: holds[i],
      }
    }),
  )
}

//-----------------------Renders ------------------------------

/**
 * Renders 10 hearts. Used above each movement. Occurs multiple times per movement group.
 * @returns jsx
 */
const RenderHearts = ({
  rating,
  move,
  accessToLocalStorage,
  currentlyEditing,
  movementId,
  setMove,
}: {
  rating: number
  move: Move
  accessToLocalStorage: boolean
  currentlyEditing: MovementType
  movementId: string
  setMove: Dispatch<SetStateAction<Move | null>>
}) => {
  //zustand to get state here rather than passed as props?

  //make a movekey for when we update in localstorage. defaulting to positions
  let moveKey: MovementKeys
  switch (currentlyEditing) {
    case 'static':
      moveKey = 'positions'
      break
    case 'hold':
      moveKey = 'holds'
      break
    case 'transition':
      moveKey = 'transitions'
      break
  }

  //----------------------------------------render-------------------------------
  return (
    <div className="flex flex-row-reverse items-center justify-end">
      {
        //render 10 hearts
        Array.from(Array(10)).map((a, i) => {
          return (
            <>
              <input
                //When heart is clicked, the input will update local state and localstorage
                onChange={(e) => {
                  //-----------------------makes the updated move------------------

                  //checks if hearts id can be found in the MoveId
                  //of the hearts we're editing, to match the move[] that's used for localstoragedb
                  const indexToUpdate = move[moveKey]?.findIndex(
                    (c) =>
                      !!(
                        (c as Position).positionId === movementId ||
                        (c as Transition).transitionId === movementId ||
                        (c as Hold).holdId === movementId
                      ),
                  )

                  //if can find id match, then try to update, else throw validation error
                  if (indexToUpdate !== -1) {
                    const updatedMove: Move = {
                      ...move,
                      [moveKey]: (move[moveKey] || []).map((a, i) =>
                        i === indexToUpdate
                          ? {
                              ...a,
                              slowRating: Number(e.target.id),
                            }
                          : a,
                      ),
                    }

                    //-----------------------updates display----------------------------

                    //updates view, otherwise user has to refresh to get updates from localstorageDB data
                    setMove(updatedMove)

                    //------------------------updates db--------------------------------

                    //expression for if Move[] matches has a match provided moveid
                    const matchCriteria = (a: Move) => a.moveId === move.moveId

                    //all the moves from localstorage
                    const globalMoves =
                      getLocalStorageGlobal[lsUserLearning](
                        accessToLocalStorage,
                      )

                    //validation if local moveId exists in global moveId
                    if (globalMoves.find(matchCriteria)) {
                      //updates localstorage on click
                      updateLocalStorageGlobal[lsUserLearning](
                        globalMoves.map((ogMove: Move) =>
                          matchCriteria(ogMove) ? updatedMove : ogMove,
                        ),
                        accessToLocalStorage,
                      )
                    } else {
                      //TODO have UI visible error handling
                      console.log('cannot find moveid in localstorage')
                    }
                  } else {
                    //TODO have UI visible error handling
                    console.log(
                      'couldnt find id match of hearts to moves supplied',
                    )
                  }
                }}
                checked={i === 10 - rating}
                type="radio"
                className="peer -ms-5 size-5 cursor-pointer
          appearance-none border-0 bg-transparent
          text-transparent
          checked:bg-none focus:bg-none focus:ring-0 focus:ring-offset-0"
                id={'' + (10 - i)}
              />
              <label
                className="pointer-events-none text-gray-300 
            peer-checked:text-red-500"
              >
                <svg
                  className="size-5 flex-shrink-0"
                  width="16"
                  height="16"
                  fill="currentColor"
                  viewBox="0 0 16 16"
                >
                  <path
                    fill-rule="evenodd"
                    d="M8 1.314C12.438-3.248 23.534 4.735 8 15-7.534
                 4.736 3.562-3.248 8 1.314z"
                  ></path>
                </svg>
              </label>
            </>
          )
        })
      }
    </div>
  )
}

/** Renders Tooltips depending on what is being hovered */
const RenderTooltip = ({ type }: { type: MovementType }) => {
  return <></>
  //FEATURE Have tooltips explain what statics, transitions, and holds are

  //text of the tooltip
  const text = getText(type)

  //tooltip has been selected
  const [isSelected, setIsSelected] = useState<boolean>(false)

  //render
  return (
    <div className="flex items-center pl-0.5">
      <svg width="15" height="15" viewBox="0 0 24 24">
        <path d="m13 17-2 0 0-6 2 0 0 6zm-1-15c6 0 10 4 10 10s-4 10-10 10-10-4-10-10 4-10 10-10zm0 18c4 0 8-4 8-8s-4-8-8-8-8 4-8 8 4 8 8 8zm1-11-2 0 0-2 2 0 0 2z" />
      </svg>
    </div>
  )
}

/**
 * Renders the heading text, and all the moves
 */
const RenderMoveLearn = () => {
  const [accessToLocalStorage, setAccessToLocalStorage] = useState(false)
  const [move, setMove] = useState<Move | null>(null)
  const [orderOfPosTransHolds, setOrderOfPosTransHolds] = useState<
    MovementGroup[]
  >([])
  const searchParams = useSearchParams()
  const moveId: string | null = searchParams?.get('moveId') || null

  // -------------------------------------USE EFFECT---------------------------

  //makes sure has access to local storage
  useLocalStorage(setAccessToLocalStorage)

  //sets the order of the movements
  useEffect(() => {
    if (move)
      setOrderOfPosTransHolds(
        formatPosTransHolds(move.positions, move.transitions, move.holds),
      )
  }, [move])

  //get learning moves
  useEffect(() => {
    const allMoves = getLocalStorageGlobal[lsUserLearning](accessToLocalStorage)
    const selectedMove = allMoves.find((obj) => obj.moveId === moveId)
    setMove(selectedMove || null)
  }, [accessToLocalStorage, moveId])

  //-----------------------------------------------------------------------------

  const numberOfPositions = move?.positions?.length
  const numberOfTransitions = move?.transitions?.length
  return (
    <section className="body-font text-gray-600">
      <div className="container mx-auto max-w-se px-5 py-24">
        <div className="mb-8 flex w-full flex-col text-center">
          <h1 className="title-font mb-2 text-3xl font-medium text-gray-900 sm:text-4xl dark:text-white">
            Learn Slow
          </h1>
          <p className="w-full text-xs leading-relaxed text-gray-500 lg:w-1/2">
            Learn slow to learn fast. Recommended music around 60bpm. Do a move
            every beat. Feel free to skip past the hard ones and get the easy
            ones first.
          </p>
          <div className="mx-auto text-base text-xs leading-relaxed lg:w-2/3"></div>
        </div>
        <div>
          {move &&
            orderOfPosTransHolds &&
            orderOfPosTransHolds.map((movement, i) => {
              return (
                <div
                  className="my-6 flex flex-col items-center"
                  key={movement.displayName}
                >
                  <h1 className="title-font text-lg font-medium capitalize text-gray-900 dark:text-white">
                    {movement.displayName}
                  </h1>
                  <div className="mb-4 mt-2 flex justify-center">
                    <div className="inline-flex h-1 w-16 rounded-full bg-indigo-500"></div>
                  </div>
                  <div className="flex flex-col items-center text-xs">
                    {movement.position && (
                      //If its a position render position
                      <div className="flex flex-col py-3">
                        <span>
                          <RenderHearts
                            setMove={setMove}
                            accessToLocalStorage={accessToLocalStorage}
                            rating={movement.position?.slowRating}
                            move={move}
                            currentlyEditing={'static'}
                            movementId={movement.position.positionId}
                          />
                          {'Position: '}
                          {movement.position.displayName}
                        </span>
                        <span className="flex">
                          <div>{'Practice: Slow Statics'}</div>
                          <RenderTooltip type={'static'} />
                        </span>
                      </div>
                    )}
                    {movement.transition && (
                      //If its a transition render Transition
                      <div className="flex flex-col py-3">
                        <span>
                          <RenderHearts
                            setMove={setMove}
                            accessToLocalStorage={accessToLocalStorage}
                            rating={movement.transition?.slowRating}
                            move={move}
                            currentlyEditing={'transition'}
                            movementId={movement.transition.transitionId}
                          />
                          {'Transition: '}
                          {movement.transition.displayName}
                        </span>
                        <div>{'Practice: Slow Transitions'}</div>
                      </div>
                    )}
                    {movement.hold && (
                      //If its a hold render hold
                      <div className="flex flex-col pt-3">
                        <span>
                          <RenderHearts
                            setMove={setMove}
                            accessToLocalStorage={accessToLocalStorage}
                            move={move}
                            currentlyEditing={'hold'}
                            movementId={movement.hold.holdId}
                            rating={movement.hold.slowRating}
                          />
                          {'Holds: '}
                          {movement.hold.displayName}
                        </span>
                        <div>{'Practice: Slow Holds'}</div>
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
        </div>
      </div>
    </section>
  )
}

export default function RenderPage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <RenderMoveLearn />
    </Suspense>
  )
}
