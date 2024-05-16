import {
  useState,
  useEffect,
  Suspense,
  MouseEventHandler,
} from 'react'
import { useLocalStorage } from '@/app/_utils/lib'
import { MovementGroup, lsUserLearning } from '@/app/_utils/localStorageTypes'
import { Position, Transition } from '@/app/_utils/localStorageTypes'
import {
  getLocalStorageGlobal,
  setLocalStorageGlobal,
} from '@/app/_utils/accessLocalStorage'
import { Move } from '@/app/_utils/localStorageTypes'
import { useSearchParams } from 'next/navigation'
import LoadingFallback from '@/app/_components/LoadingFallback'
import { useRouter } from 'next/navigation'
import { useForm, SubmitHandler, Form } from 'react-hook-form'
import {
  makeDefaultMovementGroupArr,
  makeDefaultPosition,
  makeDefaultTransition,
  makeMovementId,
  makePositionId,
  makeTransitionId,
} from '@/app/_utils/lsMakers'
import { RenderEditButton, RenderRedDeleteButton } from '../../_components/Svgs'
import DefaultStyledInput from '@/app/_components/DefaultStyledInput'
import { RenderAddButton } from '../../_components/Svgs'
import { RenderHearts } from './RenderHearts'
import { useDataLearnStore } from './page'
import { MovementType, MovementKeys } from './pagetypes'
import { Dispatch, SetStateAction } from 'react'

//-------------local types------------------
//input types for react-hook-form
type Inputs = {
  [key: `${number}`]: string //displayName
}

//------------local utils --------------------
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

//----------------------------------------
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
 * renders a single movement group for the data/learn page
 * @returns jsx
 */
export default function RenderMovementGroup(
  {
    indexNumber,
    movement,
    localMovements,
    setMove,
    move,
  }: {
    indexNumber: number
    localMovements: MovementGroup[]
    movement: MovementGroup
    setMove: Dispatch<SetStateAction<Move | null>>
    move: Move
  }) {
  //------------------state----------------

  //zustand
  const setIsEditing = useDataLearnStore((state) => state.setIsEditing)
  const isEditing = useDataLearnStore((state) => state.isEditing)

  //react
  const [accessToLocalStorage, setAccessToLocalStorage] = useState(false)
  const { register, handleSubmit } = useForm<Inputs>()

  //gets position and transition referred to by movementGroup obj
  const {
    //-----makes a defaults if none found to handle edge cases----
    //do not have a default for the last movementgroup as it's just a transition loop to repeat and doesnt have positions
    position = indexNumber !== localMovements.length - 1 &&
    makeDefaultPosition({
      displayName: 'new-position',
    }),
    //doesn't make a transitionobj for the first pos, as nothing to transition from
    transition = indexNumber !== 0 &&
    makeDefaultTransition({
      displayName: 'new-transition',
      from: localMovements[indexNumber - 1].positionId || makePositionId(),
      to: position ? position.positionId : makePositionId(),
      transitionId: makeTransitionId(),
    }),
  } = getPositionAndTransition(movement, move)
  //----------------use effect-----------
  //makes sure has access to local storage
  useLocalStorage(setAccessToLocalStorage)

  //---------------handlers------------

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
      const selectedMove = lsCurrent.findIndex((obj) => obj.moveId === move.moveId)

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

  //--------------render-------------

  return (
    <div
      className="my-6 flex flex-col items-center"
    >
      <div className="flex">
        {
          //--------------MOVEMENT GROUP TITLE-------
          //if user is not editing, show delete and add button
          (isEditing !== null && isEditing[indexNumber]) || (
            <>
              <h1 className="title-font text-lg font-medium capitalize text-gray-900 dark:text-white">
                {movement.displayName}
              </h1>
              {/* ----------MODIFICATION BUTTONS-----*/}
              <div className="ml-2 flex items-center">
                <div className="w-2">
                  <RenderEditButton
                    onClick={() => {
                      setIsEditing({ [indexNumber]: true })
                    }}
                  />
                </div>
                <div className="ml-2 w-2">
                  <RenderAddButton
                    id={movement.movementId}
                    onClick={onClickAddMovement}
                  />
                </div>
                {
                  //if there's more than one mvmt left, show delete button
                  localMovements.length > 1 && (
                    <div className="ml-2 w-2">
                      <RenderRedDeleteButton
                        id={movement.movementId}
                        onClick={onClickDeleteMovement}
                      />
                    </div>
                  )
                }
              </div>
            </>
          )
        }
        {
          // ---------------EDIT INPUT------------
          //if user is editing, edit button can save. dont show delete and add button.
          isEditing !== null && isEditing[indexNumber] && (
            <>
              <form onSubmit={handleSubmit(onSubmitNewMoveName(indexNumber))}>
                <DefaultStyledInput
                  registerName={`${indexNumber}`}
                  defaultValue={movement.displayName}
                  register={register}
                />
                <button type="submit">
                  <div className="ml-1 w-2">
                    <RenderEditButton />
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
      {/*---------------TRANSITIONS w/ HEARTS & POSITIONS w/ HEARTS----- */}
      <div className="flex flex-col items-center text-xs">
        {transition && (
          //If its a transition render Transition
          <div className="flex flex-col py-3">
            <span>
              <RenderHearts
                movements={localMovements}
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
                movements={localMovements}
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
}