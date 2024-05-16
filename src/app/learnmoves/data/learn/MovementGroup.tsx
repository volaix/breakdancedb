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
  { position,
    transition,
    isEditing,
    setIsEditing,
    onClickAddMovement,
    indexNumber,
    movement,
    onClickDeleteMovement,
    localMovements,
    handleSubmit,
    onSubmitNewMoveName,
    register,
    setMove,
    accessToLocalStorage,
    move,
  }) {

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