import { useLocalStorage } from '@/app/_utils/lib'
import { Move, MovementGroup, Position, Transition } from '@/app/_utils/lsTypes'
import {
  makeDefaultPosition,
  makeDefaultTransition,
  makeMovementId,
  makePositionId,
  makePositionTransitionId,
} from '@/app/_utils/lsGenerators'
import { Dispatch, MouseEventHandler, SetStateAction, useState } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'

import { useZustandStore } from '@/app/_utils/zustandLocalStorage'
import { create } from 'zustand'
import {
  RenderAddButtonSVG,
  RenderEditButton,
  RenderRedHoldButton,
} from '../../../_components/Svgs'
import { RenderHearts } from './RenderHearts'
import { MovementType } from './pagetypes'
// ----------------------store-----------------------------
export interface DataLearnState {
  //note key for isEditing is actually a number from an index array fnc. however in js all keys are strings.
  isEditing: { [key: string]: boolean } | null
  setIsEditing: (val: { [key: string]: boolean }) => void
}

export const useDataLearnStore = create<DataLearnState>()((set) => ({
  isEditing: null,
  setIsEditing: (val) => set(() => ({ isEditing: val })),
}))

//-------------local types------------------
//input types for react-hook-form
type Inputs = {
  //this wouldve been better as a map
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
 * renders a single movement group for the data/study page
 * @returns jsx
 */
export default function RenderMovementGroup({
  indexNumber,
  movement,
  localMovements,
  setMove,
  move,
  isOppositeSide,
}: {
  indexNumber: number
  localMovements: MovementGroup[]
  movement: MovementGroup
  setMove: Dispatch<SetStateAction<Move | null>>
  move: Move
  isOppositeSide?: boolean
}) {
  //------------------state----------------

  const getLsUserLearning = useZustandStore((state) => state.getLsUserLearning)
  const setIsEditing = useDataLearnStore((state) => state.setIsEditing)
  const isEditing = useDataLearnStore((state) => state.isEditing)
  const setLsUserLearning = useZustandStore((state) => state.setLsUserLearning)
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
        transitionId: makePositionTransitionId(),
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

        const lsLearningMovesArr = getLsUserLearning()
        const moveIndex = lsLearningMovesArr.findIndex(
          (a) => a.moveId === move.moveId,
        )
        if (moveIndex !== undefined && moveIndex > -1) {
          setLsUserLearning(
            lsLearningMovesArr.toSpliced(moveIndex, 1, withDeletedMove),
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
            transitionId: makePositionTransitionId(),
          }),
        }
        //-------------updates local+db------------
        //#P2MIGRATION DELETE
        setMove(insertedNewMove)

        //db
        setLsUserLearning(
          getLsUserLearning().toSpliced(currMovementGroupIndex, 1),
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
      const lsCurrent = getLsUserLearning()
      //finds the current move inside the db
      const selectedMove = lsCurrent.findIndex(
        (obj) => obj.moveId === move.moveId,
      )

      if (selectedMove > -1) {
        const updatedMove: Move = {
          ...lsCurrent[selectedMove],
          movements: newMovements,
        }

        //Can be deleted at #P2MIGRATION
        //update locally to view, if skip it wont rerender
        setMove(updatedMove)

        //update db
        setLsUserLearning(lsCurrent.toSpliced(selectedMove, 1, updatedMove))
      } else {
        console.log('could not match moveId with localstorage')
      }
      setIsEditing({ [i]: false })
    }
  }

  //--------------render-------------

  return (
    <div className="my-6 flex flex-col items-center">
      <div className="flex">
        {
          //--------------MOVEMENT GROUP TITLE-------
          //if user is not editing, show delete and add button
          (isEditing !== null && isEditing[indexNumber]) || (
            <>
              <div className="flex flex-col">
                {
                  //show flag for if it's opposite side
                  isOppositeSide && (
                    <div className="text-xs text-indigo-500 ">
                      Opposite Side
                    </div>
                  )
                }
                {
                  //if not opposite side display title text normally
                  isOppositeSide || (
                    <h1 className="title-font text-lg font-medium capitalize text-gray-900 dark:text-white">
                      {movement.displayName}
                    </h1>
                  )
                }
                {
                  // if it's opposite side use italics
                  isOppositeSide && (
                    <h1 className="title-font text-lg font-medium capitalize italic text-gray-900 dark:text-white">
                      {movement.displayName}
                    </h1>
                  )
                }
              </div>
              {/* ----------MODIFICATION BUTTONS-----*/}
              <div className="ml-2 flex items-center">
                <div className="w-2">
                  <RenderEditButton
                    className="dark:fill-gray-500"
                    onClick={() => {
                      setIsEditing({ [indexNumber]: true })
                    }}
                  />
                </div>
                <div className="ml-2 w-2">
                  <RenderAddButtonSVG
                    id={movement.movementId}
                    onClick={onClickAddMovement}
                    className="dark:fill-gray-500"
                  />
                </div>
                {
                  //if there's more than one mvmt left, show delete button
                  localMovements.length > 1 && (
                    <div className="ml-2 w-2">
                      <RenderRedHoldButton
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
                <input
                  className="w-full rounded border border-gray-300 bg-gray-100 bg-opacity-50 px-3 py-1 text-base leading-8 text-gray-700 outline-none transition-colors duration-200 ease-in-out focus:border-indigo-500 focus:bg-transparent focus:ring-2 focus:ring-indigo-200 dark:border-gray-700 dark:bg-gray-800 dark:bg-opacity-40 dark:text-gray-100 dark:focus:ring-indigo-900"
                  type="text"
                  defaultValue={movement.displayName}
                  {...register(`${indexNumber}`)}
                />
                <button type="submit">
                  <div className="ml-1 w-2">
                    <RenderEditButton className="dark:fill-gray-500" />
                  </div>
                </button>
              </form>
            </>
          )
        }
      </div>
      <div className="mb-4 mt-2 flex justify-center">
        {/* -----------SPACER--------------- */}
        <div className="inline-flex h-1 w-16 rounded-full bg-indigo-500"></div>
      </div>
      {/*---------------TRANSITIONS w/ HEARTS & POSITIONS w/ HEARTS----- */}
      <div className="flex flex-col items-center text-xs">
        {
          // render if it's a transition and not in the first movement group
          //impossible to transition into first movementgroup
          transition && indexNumber !== 0 && (
            //If its a transition render Transition
            <div className="flex flex-col py-3">
              <span>
                <RenderHearts
                  movements={localMovements}
                  setMove={setMove}
                  rating={
                    isOppositeSide
                      ? transition.oppositeSideSlowRating
                      : transition.slowRating
                  }
                  isOppositeSide={!!isOppositeSide}
                  move={move}
                  currentlyEditing={'transition'}
                  movementGroup={movement}
                />
                {'Transition: '}
                {transition.displayName}
              </span>
              <div>{'Practice: Slow Transitions'}</div>
            </div>
          )
        }
        {position && (
          //If its a position render position
          <div className="flex flex-col py-3">
            <span>
              <RenderHearts
                movements={localMovements}
                setMove={setMove}
                isOppositeSide={!!isOppositeSide}
                rating={
                  isOppositeSide
                    ? position.oppositeSideSlowRating
                    : position.slowRating
                }
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
