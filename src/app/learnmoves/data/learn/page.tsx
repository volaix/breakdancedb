'use client'
import {
  useState,
  useEffect,
  Suspense,
  MouseEventHandler,
} from 'react'
import { useLocalStorage } from '@/app/_utils/lib'
import { MovementGroup, lsUserLearning } from '@/app/_utils/localStorageTypes'
import { Position, Transition } from '@/app/_utils/localStorageTypes'
import RenderMovementGroup from './MovementGroup'
import {
  getLocalStorageGlobal,
  setLocalStorageGlobal,
} from '@/app/_utils/accessLocalStorage'
import { Move } from '@/app/_utils/localStorageTypes'
import { useSearchParams } from 'next/navigation'
import LoadingFallback from '@/app/_components/LoadingFallback'
import { useRouter } from 'next/navigation'
import { RenderEditButton, RenderRedDeleteButton } from '../../_components/Svgs'
import DefaultStyledInput from '@/app/_components/DefaultStyledInput'
import { useForm, SubmitHandler, Form } from 'react-hook-form'
import {
  makeDefaultMovementGroupArr,
  makeDefaultPosition,
  makeDefaultTransition,
  makeMovementId,
  makePositionId,
  makeTransitionId,
} from '@/app/_utils/lsMakers'
import { RenderAddButton } from '../../_components/Svgs'
import { RenderHearts } from './RenderHearts'

// ------------------------Local Types ---------------------------------
//input types for react-hook-form
type Inputs = {
  [key: `${number}`]: string //displayName
}

export type MovementType = 'static' | 'transition'
export type MovementKeys = 'positions' | 'transitions'
//-------------------------------Local Utils---------------------------------
/**
 * looks in positions and transitions in Move to update the right value with slowRating
 * @param move Move
 * @returns Move
 */
export const getUpdatedMove = (
  move: Move,
  currentlyEditing: MovementType,
  movementGroup: MovementGroup,
  slowRating: number,
  movements: MovementGroup[],
): Move => {
  //  determines what key to use when accessing Move
  let key: MovementKeys
  switch (currentlyEditing) {
    case 'static':
      key = 'positions'
      break
    case 'transition':
      key = 'transitions'
      break
  }

  //TODO refactor this almost duplicated code. RN lacking typescript ability to have the key
  if (key === 'positions') {
    const index = move[key]?.findIndex((a) => {
      return a.positionId === movementGroup.positionId
    })
    if (index !== undefined && index > -1 && move.positions) {
      return {
        ...move,
        [key]: move[key]?.toSpliced(index, 1, {
          ...move.positions[index],
          slowRating,
        }),
      }
    } else {
      console.log('ERROR: Could not find positionId in movementGroup')
      //return move with a default position anyway
      return {
        ...move,
        positions: move.positions?.toSpliced(
          move.positions.length,
          0,
          makeDefaultPosition({
            slowRating,
            displayName: 'newPos',
            positionId: movementGroup.positionId,
          }),
        ),
      }
    }
  } else if (key === 'transitions') {
    const index = move[key]?.findIndex((a) => {
      return a.transitionId === movementGroup.transitionId
    })
    if (index !== undefined && index > -1 && move.transitions) {
      return {
        ...move,
        [key]: move[key]?.toSpliced(index, 1, {
          ...move.transitions[index],
          slowRating,
        }),
      }
    } else {
      console.log('ERROR: Could not find transitionId in movementGroup')
      //return move with a default position anyway
      const mvmtIndex = movements.findIndex(
        (a) => a.positionId === movementGroup.positionId,
      )
      return {
        ...move,
        transitions: move.transitions?.toSpliced(
          move.transitions.length,
          0,
          makeDefaultTransition({
            slowRating,
            displayName: 'newTrans',
            transitionId: movementGroup.transitionId || makeTransitionId(),
            to: movementGroup.positionId || makePositionId(),
            from: movements[mvmtIndex - 1].positionId || makePositionId(),
          }),
        ),
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
  const [hasOppositeSide, setHasOppositeSide] = useState<boolean>(false)

  const searchParams = useSearchParams()
  const moveId: string | null = searchParams?.get('moveId') || null
  const router = useRouter()
  const { register, handleSubmit } = useForm<Inputs>()

  // -------------------------------------USE EFFECT---------------------------

  //makes sure has access to local storage
  useLocalStorage(setAccessToLocalStorage)

  //Hook to update after localstorage has been set
  useEffect(() => { }, [setIsEditing])

  //sets the order of the movements
  useEffect(() => {
    if (move) {
      if (move?.movements?.length) {
        //set local movements
        setLocalMovements(move.movements)
      } else {
        const defaultMvmtGroupArr = makeDefaultMovementGroupArr(
          move.positions,
          move.transitions,
        )
        //----------update DB -----------------
        //--------make defaults----------
        //get the current move[]
        const lsMoveArr =
          getLocalStorageGlobal.userLearning(accessToLocalStorage)
        //index of move that we need to add movements[] to
        const mvIndex = lsMoveArr.findIndex((a) => a.moveId === move.moveId)
        //makes a move obj with new mvmts[]
        const newMoveObj = {
          ...move,
          movements: defaultMvmtGroupArr,
        }
        // const updatedMvmtArr = lsMoveArr.toSpliced(mvIndex, 1, newMoveObj)
        const updatedMvmtArr = lsMoveArr.toSpliced(mvIndex, 1, newMoveObj)
        //---------sets---------
        //update db first, after move is set, it will rerender
        setLocalStorageGlobal.userLearning(updatedMvmtArr, accessToLocalStorage)
        //set local move, and localmovements will be updated on rerender
        setMove(newMoveObj)
        //----------------------------------
      }
    }
  }, [accessToLocalStorage, move])

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
        setLocalStorageGlobal[lsUserLearning](
          lsCurrent.toSpliced(selectedMove, 1, updatedMove),
          accessToLocalStorage,
        )
      } else {
        console.log('could not match moveId with localstorage')
      }
      setIsEditing({ [i]: false })
    }
  }

  const onClickDeleteMovement: MouseEventHandler<SVGSVGElement> = (e) => {
    if (move) {
      //---------deletes in a pseudo object-----------
      //find index to delete
      const currMovementGroupIndex = move.movements?.findIndex(
        (a) => a.movementId === (e.target as SVGSVGElement).id,
      )

      //if the index exists
      if (currMovementGroupIndex !== undefined && currMovementGroupIndex > -1) {
        //delete it in a new obj
        const deletedMvmt = [
          ...(move.movements?.toSpliced(currMovementGroupIndex, 1) || []),
        ]
        console.log('deletedMvmt: ', deletedMvmt)
        //update larger structure with new obj
        const withDeletedMove = {
          ...move,
          movements: deletedMvmt,
        }
        console.log('withDeletedMove: ', withDeletedMove)
        //-------------updates local+db------------
        //local
        setMove(withDeletedMove)
        //db

        const lsLearningMovesArr =
          getLocalStorageGlobal[lsUserLearning](accessToLocalStorage)
        const moveIndex = lsLearningMovesArr.findIndex(
          (a) => a.moveId === move.moveId,
        )
        if (moveIndex !== undefined && moveIndex > -1) {
          setLocalStorageGlobal[lsUserLearning](
            //gets localstorage learning
            lsLearningMovesArr
              //updates the specific move with our deleted one
              .toSpliced(moveIndex, 1, withDeletedMove),
            accessToLocalStorage,
          )
        } else {
          console.log(
            'ERROR: cannot find the current moveid compared to localstorage learning moveArr',
          )
        }
      } else {
        console.log('ERROR: cannot find movementId inside movement array')
      }
    } else {
      console.log('ERROR: local move could not be loaded')
    }
  }

  /**
   * onclick handler for user trying to add a new movement. makes a movement below the current.
   * returns void
   */
  const onClickAddMovement: MouseEventHandler<SVGSVGElement> = (e) => {
    console.log('trying to add a new movement')
    if (move) {
      //---------makes new move-----------
      const currMovementGroupIndex = move.movements?.findIndex(
        (a) => a.movementId === (e.target as SVGSVGElement).id,
      )

      if (currMovementGroupIndex !== undefined && currMovementGroupIndex > -1) {
        const insertedNewMove = {
          ...move,
          movements: move.movements?.toSpliced(currMovementGroupIndex + 1, 0, {
            displayName: 'new-movement-b',
            movementId: makeMovementId(),
            positionId: makePositionId(),
            transitionId: makeTransitionId(),
          }),
        }
        //-------------updates local+db------------
        setMove(insertedNewMove)

        //db
        setLocalStorageGlobal[lsUserLearning](
          //gets localstorage learning and updates the specific move with our deleted one
          getLocalStorageGlobal[lsUserLearning](accessToLocalStorage).toSpliced(
            currMovementGroupIndex,
            1,
          ),
          accessToLocalStorage,
        )
      } else {
        console.log('ERROR: cannot find movementId inside movement array')
      }
    } else {
      console.log('ERROR: local move could not be loaded')
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
          {/* RenderMovementsGroup */}
          {move &&
            localMovements &&
            localMovements.map((movement, i) => {
              //gets position and transition referred to by movementGroup obj
              const {
                //-----makes a defaults if none found to handle edge cases----
                //do not have a default for the last movementgroup as it's just a transition loop to repeat and doesnt have positions
                position = i !== localMovements.length - 1 &&
                makeDefaultPosition({
                  displayName: 'new-position',
                }),
                //doesn't make a transitionobj for the first pos, as nothing to transition from
                transition = i !== 0 &&
                makeDefaultTransition({
                  displayName: 'new-transition',
                  from: localMovements[i - 1].positionId || makePositionId(),
                  to: position ? position.positionId : makePositionId(),
                  transitionId: makeTransitionId(),
                }),
              } = getPositionAndTransition(movement, move)
              //---------------------------------------------------------------
              // TODO refactor this to use zustand. looks ugly like this and isn't clear in rendermovementgroup what all the functions do
              return <RenderMovementGroup movement={movement} key={movement.displayName} position={position} isEditing={isEditing} onClickAddMovement={onClickAddMovement} transition={transition} setIsEditing={setIsEditing} indexNumber={i} localMovements={localMovements} handleSubmit={handleSubmit} onSubmitNewMoveName={onSubmitNewMoveName} register={register} setMove={setMove} accessToLocalStorage={accessToLocalStorage} move={move}
              />
            })}
        </div>
        <form className="py-10">
          <span>
            <input type="checkbox" />
            Move into reverse direction?
          </span>
          <div className="text-xs">
            this will double the movement groups
          </div>
        </form>
        <div>
          {move &&
            localMovements && hasOppositeSide &&
            localMovements.map((movement, i) => {
              //gets position and transition referred to by movementGroup obj
              const {
                //-----makes a defaults if none found to handle edge cases----
                //do not have a default for the last movementgroup as it's just a transition loop to repeat and doesnt have positions
                position = i !== localMovements.length - 1 &&
                makeDefaultPosition({
                  displayName: 'new-position',
                }),
                //doesn't make a transitionobj for the first pos, as nothing to transition from
                transition = i !== 0 &&
                makeDefaultTransition({
                  displayName: 'new-transition',
                  from: localMovements[i - 1].positionId || makePositionId(),
                  to: position ? position.positionId : makePositionId(),
                  transitionId: makeTransitionId(),
                }),
              } = getPositionAndTransition(movement, move)
              //---------------------------------------------------------------
              return <RenderMovementGroup
                movement={movement}
                key={movement.displayName}
                position={position}
                isEditing={isEditing}
                onClickAddMovement={onClickAddMovement}
                transition={transition}
                setIsEditing={setIsEditing}
                indexNumber={i}
                localMovements={localMovements}
                handleSubmit={handleSubmit}
                onSubmitNewMoveName={onSubmitNewMoveName}
                register={register}
                setMove={setMove}
                accessToLocalStorage={accessToLocalStorage}
                move={move}
              />
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
