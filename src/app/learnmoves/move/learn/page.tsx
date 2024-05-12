'use client'
import { useState, useEffect, SetStateAction, Dispatch, Suspense } from 'react'
import { useLocalStorage } from '@/app/_utils/lib'
import {
  MovementGroup,
  MovementId,
  lsUserLearning,
} from '@/app/_utils/localStorageTypes'
import { Position, Transition } from '@/app/_utils/localStorageTypes'
import {
  getLocalStorageGlobal,
  updateLocalStorageGlobal,
} from '@/app/_utils/accessLocalStorage'
import { Move } from '@/app/_utils/localStorageTypes'
import { useSearchParams } from 'next/navigation'
import LoadingFallback from '@/app/_components/LoadingFallback'
import { useRouter } from 'next/navigation'
import { RenderEditButton } from '@/app/learnmoves/_components/RenderEditButton'
import DefaultStyledInput from '@/app/_components/DefaultStyledInput'
import { useForm, SubmitHandler } from 'react-hook-form'
import { makeDefaultMovementGroupArr } from '@/app/_utils/lsMakers'

// ------------------------Local Types ---------------------------------
//input types for react-hook-form
type Inputs = {
  [key: `${number}`]: string //displayName
}

type MovementType = 'static' | 'transition'
type MovementKeys = 'positions' | 'transitions'
//-------------------------------Local Utils---------------------------------
/**
 * looks in positions and transitions in Move to update the right value with slowRating
 * @param move Move
 * @returns Move
 */
const getUpdatedMove = (
  move: Move,
  currentlyEditing: MovementType,
  movementGroup: MovementGroup,
  slowRating: number,
): Move => {
  //determines what key to use when accessing Move
  let key: MovementKeys
  switch (currentlyEditing) {
    case 'static':
      key = 'positions'
      break
    case 'transition':
      key = 'transitions'
      break
  }

  //TODO Refactor this, below logic seems duplicated
  if (key === 'positions') {
    const index = move[key]?.findIndex((a) => {
      a.positionId === movementGroup.positionId
    })
    if (index && index > -1 && move.positions) {
      return {
        ...move,
        [key]: move[key]?.toSpliced(index, 1, {
          ...move.positions[index],
          slowRating,
        }),
      }
    }
  } else if (key === 'transitions') {
    const index = move[key]?.findIndex((a) => {
      a.transitionId === movementGroup.transitionId
    })
    if (index && index > -1 && move.transitions) {
      return {
        ...move,
        [key]: move[key]?.toSpliced(index, 1, {
          ...move.transitions[index],
          slowRating,
        }),
      }
    }
  }
  return move
}

const getPositionAndTransition = (
  movementGroup: MovementGroup,
  move: Move,
): {
  position?: Position
  transition?: Transition
} => {
  return {
    position: move.positions?.find(
      (a) => a.positionId === movementGroup.positionId,
    ),
    transition: move.transitions?.find(
      (a) => a.transitionId === movementGroup.transitionId,
    ),
  }
}

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
  }
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
  movementGroup,
  setMove,
}: {
  movementGroup: MovementGroup
  rating: number
  move: Move
  accessToLocalStorage: boolean
  currentlyEditing: MovementType
  setMove: Dispatch<SetStateAction<Move | null>>
}) => {
  //zustand to get state here rather than passed as props?

  //make a movekey for when we update in localstorage. defaulting to positions
  let moveKey: MovementKeys
  switch (currentlyEditing) {
    case 'static':
      moveKey = 'positions'
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
                  console.log('making updated move')
                  const updatedMove = getUpdatedMove(
                    move,
                    currentlyEditing,
                    movementGroup,
                    Number(e.target.id),
                  )

                  console.log('updatedMove: ', updatedMove)
                  //-----------------------updates display----------------------------

                  //updates view, otherwise user has to refresh to get updates from localstorageDB data
                  setMove(updatedMove)

                  //------------------------updates db--------------------------------

                  //expression for if Move[] matches has a match provided moveid
                  const matchCriteria = (a: Move) => a.moveId === move.moveId

                  //all the moves from localstorage
                  const globalMoves =
                    getLocalStorageGlobal[lsUserLearning](accessToLocalStorage)

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
  //FEATURE Have tooltips explain what statics and transitions are

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
  //-------------------------------state--------------------------------
  //note key for isEditing is actually a number from an index array fnc. however in js all keys are strings.
  const [isEditing, setIsEditing] = useState<{ [key: string]: boolean } | null>(
    null,
  )

  const [localMovements, setLocalMovements] = useState<MovementGroup[]>([])
  const [accessToLocalStorage, setAccessToLocalStorage] = useState(false)
  const [move, setMove] = useState<Move | null>(null)

  const searchParams = useSearchParams()
  const moveId: string | null = searchParams?.get('moveId') || null
  const router = useRouter()
  const { register, handleSubmit } = useForm<Inputs>()

  // -------------------------------------USE EFFECT---------------------------

  //makes sure has access to local storage
  useLocalStorage(setAccessToLocalStorage)

  //Hook to update after localstorage has been set
  useEffect(() => {}, [setIsEditing])

  //sets the order of the movements
  useEffect(() => {
    if (move) {
      setLocalMovements(
        move?.movements?.length
          ? move.movements
          : makeDefaultMovementGroupArr(move.positions, move.transitions),
      )
    }
  }, [move])

  //get learning moves
  useEffect(() => {
    const allMoves = getLocalStorageGlobal[lsUserLearning](accessToLocalStorage)
    const selectedMove = allMoves.find((obj) => obj.moveId === moveId)
    setMove(selectedMove || null)
  }, [accessToLocalStorage, moveId])

  //-------------------------------handlers------------------------------

  /**
   * To run when submitting the edit button.
   * After editing movement names, submitting changes to localstorage
   * @param i is index
   */
  //
  const onSubmitNewMoveName = (i: number): SubmitHandler<Inputs> => {
    return (data) => {
      console.log('running onsubmit with', data)

      //var for movements with display names
      const newMovements: MovementGroup[] = localMovements.map((a, i) => {
        return {
          ...a,
          displayName: data[`${i}`] || localMovements[i].displayName,
        }
      })
      //gets current localstorage
      const lsCurrent =
        getLocalStorageGlobal[lsUserLearning](accessToLocalStorage)
      //finds the current move inside the db
      const selectedMove = lsCurrent.findIndex((obj) => obj.moveId === moveId)

      if (selectedMove > -1) {
        const updatedMove: Move = {
          ...lsCurrent[selectedMove],
          movements: newMovements,
        }

        //update locally to view, if skip it wont rerender
        setMove(updatedMove)

        //updates local storage, while replacing the current move with what's been changed locally
        updateLocalStorageGlobal[lsUserLearning](
          lsCurrent.toSpliced(selectedMove, 1, updatedMove),
          accessToLocalStorage,
        )
      } else {
        console.log('could not match moveId with localstorage')
      }
      setIsEditing({ [i]: false })
    }
  }

  //------------------------------RENDER--------------------------------

  return (
    <section className="body-font text-gray-600">
      <div className="container mx-auto max-w-se px-5 py-24">
        <div className="mb-8 flex w-full flex-col text-center">
          <button
            className="fixed top-16"
            type="button"
            onClick={() => router.back()}
          >
            {`<- Go back`}
          </button>
          <h1 className="title-font mb-2 text-3xl font-medium text-gray-900 sm:text-4xl dark:text-white">
            Learn Slow
          </h1>
          <p className="w-full text-xs leading-relaxed text-gray-500 lg:w-1/2">
            {'Move Name: '}
            {move?.displayName}
          </p>
          <p className="w-full text-xs leading-relaxed text-gray-500 lg:w-1/2">
            Learn slow to learn fast. Recommended music around 60bpm. Do a move
            every beat. Feel free to skip past the hard ones and get the easy
            ones first.
          </p>
          <div className="mx-auto text-base text-xs leading-relaxed lg:w-2/3"></div>
        </div>
        <div>
          {move &&
            localMovements &&
            localMovements.map((movement, i) => {
              const { position, transition } = getPositionAndTransition(
                movement,
                move,
              )
              return (
                <div
                  className="my-6 flex flex-col items-center"
                  key={movement.displayName}
                >
                  <div className="flex">
                    {
                      //if user is not editing, show the edit button
                      (isEditing !== null && isEditing[i]) || (
                        <>
                          <h1 className="title-font text-lg font-medium capitalize text-gray-900 dark:text-white">
                            {movement.displayName}
                          </h1>
                          <div className="ml-1 w-2">
                            {
                              <RenderEditButton
                                onClick={() => {
                                  //change displayname to input
                                  console.log('open input')
                                  setIsEditing({ [i]: true })
                                }}
                              />
                            }
                          </div>
                        </>
                      )
                    }
                    {
                      //if user is editing, edit button can save
                      isEditing !== null && isEditing[i] && (
                        <>
                          <form onSubmit={handleSubmit(onSubmitNewMoveName(i))}>
                            <DefaultStyledInput
                              registerName={`${i}`}
                              defaultValue={movement.displayName}
                              register={register}
                            />
                            <button type="submit">
                              <div className="ml-1 w-2">
                                {
                                  <RenderEditButton
                                    onClick={() => {
                                      console.log('was clicked is ok')
                                      // setIsEditing({ [i]: true })
                                      //change displayname to input
                                      // setValue("example", "luo")
                                    }}
                                  />
                                }
                              </div>
                            </button>
                          </form>
                        </>
                      )
                    }
                  </div>
                  <div className="mb-4 mt-2 flex justify-center">
                    <div className="inline-flex h-1 w-16 rounded-full bg-indigo-500"></div>
                  </div>
                  <div className="flex flex-col items-center text-xs">
                    {transition && (
                      //If its a transition render Transition
                      <div className="flex flex-col py-3">
                        <span>
                          <RenderHearts
                            setMove={setMove}
                            accessToLocalStorage={accessToLocalStorage}
                            rating={transition?.slowRating}
                            move={move}
                            currentlyEditing={'transition'}
                            movementGroup={movement}
                          />
                          {'Transition: '}
                          {transition.displayName}
                        </span>
                        <div>{'Practice: Slow Transitions'}</div>
                      </div>
                    )}
                    {position && (
                      //If its a position render position
                      <div className="flex flex-col py-3">
                        <span>
                          <RenderHearts
                            setMove={setMove}
                            accessToLocalStorage={accessToLocalStorage}
                            rating={position?.slowRating}
                            move={move}
                            currentlyEditing={'static'}
                            movementGroup={movement}
                          />
                          {'Position: '}
                          {position.displayName}
                        </span>
                        <span className="flex">
                          <div>{'Practice: Slow Statics'}</div>
                          <RenderTooltip type={'static'} />
                        </span>
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
