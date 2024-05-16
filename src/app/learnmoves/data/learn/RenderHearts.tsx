'use client'
import {
  SetStateAction,
  Dispatch
} from 'react'
import { MovementGroup, lsUserLearning } from '@/app/_utils/localStorageTypes'
import {
  getLocalStorageGlobal,
  setLocalStorageGlobal
} from '@/app/_utils/accessLocalStorage'
import { Move } from '@/app/_utils/localStorageTypes'
import { MovementType, MovementKeys, getUpdatedMove } from './page'

//-----------------------Renders ------------------------------
/**
 * Renders 10 hearts. Used above each movement. Occurs multiple times per movement group.
 * @returns jsx
 */
export const RenderHearts = ({
  rating, move, accessToLocalStorage, currentlyEditing, movementGroup, setMove, movements,
}: {
  movementGroup: MovementGroup
  movements: MovementGroup[]
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
                    movements
                  )

                  console.log('updatedMove: ', updatedMove)
                  //-----------------------updates display----------------------------
                  //updates view, otherwise user has to refresh to get updates from localstorageDB data
                  // setLocalMovements(updatedMove)
                  setMove(updatedMove)

                  //------------------------updates db--------------------------------
                  //expression for if Move[] matches has a match provided moveid
                  const matchCriteria = (a: Move) => a.moveId === move.moveId

                  //all the moves from localstorage
                  const globalMoves = getLocalStorageGlobal[lsUserLearning](accessToLocalStorage)

                  //validation if local moveId exists in global moveId
                  if (globalMoves.find(matchCriteria)) {
                    //updates localstorage on click
                    setLocalStorageGlobal[lsUserLearning](
                      globalMoves.map((ogMove: Move) => matchCriteria(ogMove) ? updatedMove : ogMove
                      ),
                      accessToLocalStorage
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
                id={'' + (10 - i)} />
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
        })}
    </div>
  )
}
