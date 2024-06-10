'use client'
import {
  Move,
  MovementGroup,
  PositionId,
  PositionTransitionId,
} from '@/app/_utils/lsTypes'
import {
  makeDefaultPosition,
  makeDefaultTransition,
  makePositionId,
  makePositionTransitionId,
} from '@/app/_utils/lsGenerators'
import { useZustandStore } from '@/app/_utils/zustandLocalStorage'
import { produce } from 'immer'
import { Dispatch, SetStateAction, useState } from 'react'
import { MovementKeys, MovementType } from './pagetypes'

//--------------local utils--------------

/**
 * looks in positions and transitions in Move to update the right value with slowRating
 * @param move Move
 * @returns Move
 */
const getUpdatedMoveSlowRating = ({
  move,
  currentlyEditing,
  movementGroup,
  slowRating,
  movements,
  isOppositeSide = false,
}: {
  move: Move
  currentlyEditing: MovementType
  movementGroup: MovementGroup
  slowRating: number
  movements: MovementGroup[]
  isOppositeSide?: boolean
}): Move => {
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

  if (key === 'positions') {
    const index = move.positions?.findIndex((a) => {
      return a.positionId === movementGroup.positionId
    })
    if (index !== undefined && index > -1 && move.positions) {
      //if move.positions index can be found, then update the slowrating
      return produce(move, (draft) => {
        if (draft.positions) {
          //opposite side flag
          if (isOppositeSide) {
            draft.positions[index].oppositeSideSlowRating = slowRating
          }
          //normal slow rating
          else {
            draft.positions[index].slowRating = slowRating
          }
        }
      })
    } else {
      console.log('ERROR: Could not find positionId in movementGroup')
      //return move with a default position anyway

      //find movement
      const mvmntIndex = move.movements?.findIndex(
        (a) => a.movementId === movementGroup.movementId,
      )
      //positionId to set
      const positionId: PositionId =
        movementGroup.positionId || makePositionId()

      const nextMoveState = produce(move, (draft) => {
        //update move movementgroupwith positionId
        if (draft.movements && mvmntIndex !== undefined && mvmntIndex > -1) {
          draft.movements[mvmntIndex].positionId = positionId
        }
        //update move positions with default position
        if (draft.positions) {
          draft.positions.push(
            makeDefaultPosition({
              [isOppositeSide ? 'oppositeSideSlowRating' : 'slowRating']:
                slowRating,
              displayName: 'New Position',
              positionId,
            }),
          )
        }
      })
      return nextMoveState
    }
  } else if (key === 'transitions') {
    const index = move.transitions?.findIndex((a) => {
      return a.transitionId === movementGroup.transitionId
    })
    if (index !== undefined && index > -1 && move.transitions) {
      //return move with updated slow ratings
      return produce(move, (draft) => {
        if (draft.transitions) {
          if (isOppositeSide) {
            draft.transitions[index].oppositeSideSlowRating = slowRating
          } else {
            draft.transitions[index].slowRating = slowRating
          }
        }
      })
    } else {
      console.log('ERROR: Could not find transitionId in movementGroup')

      const transitionId: PositionTransitionId =
        movementGroup.transitionId || makePositionTransitionId()

      //return move with a default transition
      return produce(move, (draft) => {
        if (draft.transitions) {
          const mvmtId = draft.movements?.findIndex(
            (a) => a.movementId === movementGroup.movementId,
          )
          if (draft.movements && mvmtId !== undefined && mvmtId > -1) {
            //movementgroup updated transitionId
            draft.movements[mvmtId].transitionId = transitionId
          }

          //add transition to the end of transition[]
          draft.transitions.push(
            makeDefaultTransition({
              displayName: 'New Transition',
              [isOppositeSide ? 'oppositeSideSlowRating' : 'slowRating']:
                slowRating,
              transitionId,
              to: movementGroup.positionId || makePositionId(),
              from:
                movements[
                  movements.findIndex(
                    (a) => a.positionId === movementGroup.positionId,
                  ) - 1
                ].positionId || makePositionId(),
            }),
          )
        }
      })
    }
  }
  return move
}

//-----------------------Renders ------------------------------
/**
 * Renders 10 hearts. Used above each movement. Occurs multiple times per movement group.
 * @returns jsx
 */
export const RenderHearts = ({
  rating = 0,
  move,
  isOppositeSide,
  currentlyEditing,
  movementGroup,
  setMove,
  movements,
}: {
  movementGroup: MovementGroup
  movements: MovementGroup[]
  rating?: number
  move: Move
  currentlyEditing: MovementType
  setMove: Dispatch<SetStateAction<Move | null>>
  isOppositeSide: boolean
}) => {
  //-----------------------------state-------------------
  const setLsUserLearning = useZustandStore((state) => state.setLsUserLearning)
  const getLsUserLearning = useZustandStore((state) => state.getLsUserLearning)
  const [openLegend, setOpenLegend] = useState<boolean>(false)
  const [openList, setOpenList] = useState<boolean>(false)
  const danceList = useZustandStore((state) => state.getDanceList)()

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

  //---------handlers------------
  const handleClickLegend = () => {
    setOpenLegend(!openLegend)
  }
  const handleClickList = () => {
    setOpenList(!openList)
  }

  //----------------------------------------render-------------------------------
  return (
    <>
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
                    const updatedMove = getUpdatedMoveSlowRating({
                      move,
                      currentlyEditing,
                      movementGroup,
                      slowRating: Number(e.target.id),
                      movements,
                      isOppositeSide,
                    })

                    console.log('updatedMove: ', updatedMove)
                    //-----------------------updates display----------------------------
                    //updates view, otherwise user has to refresh to get updates from localstorageDB data
                    // setLocalMovements(updatedMove)
                    setMove(updatedMove)

                    //------------------------updates db--------------------------------
                    //expression for if Move[] matches has a match provided moveid
                    const matchCriteria = (a: Move) => a.moveId === move.moveId

                    //all the moves from localstorage
                    const globalMoves = getLsUserLearning()

                    //validation if local moveId exists in global moveId
                    if (globalMoves.find(matchCriteria)) {
                      setLsUserLearning(
                        globalMoves.map((ogMove: Move) =>
                          matchCriteria(ogMove) ? updatedMove : ogMove,
                        ),
                      )
                    } else {
                      console.error('cannot find moveid in localstorage')
                    }
                  }}
                  checked={i === 10 - rating}
                  type="radio"
                  className="peer -ms-5 size-5 cursor-pointer appearance-none border-0
  bg-transparent
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
      <div>
        {/* -----open close legend------ */}
        <div className="text-center text-[8px] text-indigo-500 opacity-25 dark:text-white">
          <button onClick={handleClickLegend} className="italic">
            {openLegend ? `close` : `view heart legend`}{' '}
          </button>
        </div>
        {/* -----------legend----------- */}
        {openLegend && (
          <div className="mb-5">
            <h1> # of hearts </h1>
            <ol className="mt-2 list-decimal">
              <li>tried to go to the position </li>
              <li> can go to the position </li>
              <li>tried to control the position w/list</li>
              <li> can control the position w/list</li>
              <li>tried to move 60bpm w/list</li>
              <li> can move 60bpm w/ list </li>
              <li>can move 200bpm half list</li>
              <li> can move 200 bpm w/ list </li>
              <li>can move 300bpm half list</li>
              <li> can move 300bpm w/ list </li>
            </ol>
            <div className="text-center text-[8px] text-indigo-500 opacity-25 dark:text-white">
              <button onClick={handleClickList} className="italic">
                {openList ? `close dance list` : `view dance list`}{' '}
              </button>
            </div>
            {openList && (
              <div>
                <h1>Dance List</h1>
                <ol className="mt-2 list-decimal">
                  {danceList.length > 0 &&
                    danceList.map((a) => <li key={a}>{a}</li>)}
                  {danceList.length > 0 || <li>no dance list can be loaded</li>}
                </ol>
              </div>
            )}
          </div>
        )}
      </div>
    </>
  )
}
