'use client'
import { useState, useEffect, Suspense } from 'react'
import { useLocalStorage } from '@/app/_utils/lib'
import { makePositionId } from '@/app/_utils/lsMakers'
import { lsUserLearning } from '@/app/_utils/localStorageTypes'
import { Position } from '@/app/_utils/localStorageTypes'
import { PositionId } from '@/app/_utils/localStorageTypes'
import {
  getLocalStorageGlobal,
  updateLocalStorageGlobal,
} from '@/app/_utils/accessLocalStorage'
import { Move } from '@/app/_utils/localStorageTypes'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import LoadingFallback from '@/app/_components/LoadingFallback'
import { RenderEditButton } from '../../_components/Svgs'
import { RenderAddButton } from '../../_components/Svgs'

//------------------------------components-----------------------

/**
 *
 * Render a delete button
 * @returns jsx
 */
const RenderRedDeleteButton = ({
  onClick,
}: {
  onClick: React.MouseEventHandler<HTMLDivElement>
}) => {
  return (
    <div onClick={onClick}>
      <svg height="20px" width="20px" viewBox="0 0 496.158 496.158">
        <path
          fill="#E04F5F"
          d="M0,248.085C0,111.063,111.069,0.003,248.075,0.003c137.013,0,248.083,111.061,248.083,248.082
	c0,137.002-111.07,248.07-248.083,248.07C111.069,496.155,0,385.087,0,248.085z"
        />
        <path
          fill="#FFFFFF"
          d="M383.546,206.286H112.612c-3.976,0-7.199,3.225-7.199,7.2v69.187c0,3.976,3.224,7.199,7.199,7.199
	h270.934c3.976,0,7.199-3.224,7.199-7.199v-69.187C390.745,209.511,387.521,206.286,383.546,206.286z"
        />
      </svg>
    </div>
  )
}
/**
 * Renders all the positions including add, edit, and delete buttons.
 * Edits a singular Move
 * @returns jsx
 */
const RenderPositions = () => {
  // Vars/State
  const [move, setMove] = useState<Move | null>(null)
  const [editing, setEditing] = useState<{ [key: number]: boolean }>({})
  const [currentMoves, setCurrentMoves] = useState<Move[]>([])
  const [accessToLocalStorage, setAccessToLocalStorage] = useState(false)
  const searchParams = useSearchParams()
  const moveId: string | null = searchParams?.get('moveId') || null

  //------------------------------Use Effect-----------------------------------------
  //----------------------------------------------------------------------------------
  //Gets all the current moves
  useEffect(() => {
    setCurrentMoves([
      ...getLocalStorageGlobal[lsUserLearning](accessToLocalStorage),
    ])
  }, [accessToLocalStorage])

  // Sets accessToLocalStorage as boolean
  useLocalStorage(setAccessToLocalStorage)

  //Get current move
  useEffect(() => {
    const allMoves = getLocalStorageGlobal[lsUserLearning](accessToLocalStorage)
    const selectedMove = allMoves.find((obj) => obj.moveId === moveId)
    setMove(selectedMove || null)
  }, [accessToLocalStorage, moveId])

  /**
   * Update the group of current moves to be ready to send to localstorage
   */
  useEffect(() => {
    // const updatedMoves = currentMoves.map(currentMove => {
    //   if (currentMove.moveId == moveId) Object.assign(currentMove, move)
    //   return currentMove
    // })
    // setCurrentMoves([...updatedMoves])
  }, [move, currentMoves, moveId])

  //---------------  HANDLERS / ONCLICK -------------------

  /**
   *
   * Add a new position to the move.
   * @param index=number
   * @returns onClickHandler function
   */
  const onClickAdd = (index: number) => () => {
    const currentPositions: Position[] = move?.positions || []
    setMove(
      move && {
        ...move,
        //structure of a base position
        positions: currentPositions.toSpliced(index, 0, {
          positionId: makePositionId(),
          displayName: `new-position`,
          imgUrl: null,
          slowRating: 0,
          normal: false,
          fast: false,
        }),
      },
    )
  }

  /**
   *
   * Updates Editing for current move
   * @param index=number
   * @returns onClickHandler function
   */
  const onClickEdit = (index: number) => () => {
    //flip the setting
    setEditing({ [index]: !editing[index] })
  }

  /**
   *
   * Deletes a move
   * @param index=number
   * @returns onClickHandler function
   */
  const onClickDelete = (index: number) => () => {
    if (move) {
      const updatedPositions: Position[] =
        move.positions?.toSpliced(index, 1) || []
      setMove({ ...move, positions: updatedPositions })
    }
  }

  //--------------------- render -----------------------------

  return (
    <section className="body-font text-gray-600">
      <div className="container mx-auto px-5 py-24">
        <div className="mb-10 text-center">
          <h1 className="title-font mb-4 text-center text-2xl font-medium text-gray-900 sm:text-3xl dark:text-white">
            Edit Positions
          </h1>
          <p className="mx-auto text-base leading-relaxed lg:w-3/4 xl:w-2/4">
            Add, Remove, and Edit the name of Positions
          </p>
        </div>
        <div className="flex max-w-se flex-wrap">
          <div className="w-full p-4 sm:w-1/4 lg:w-3/4">
            <h2 className="title-font mb-4 text-center text-sm font-medium uppercase tracking-widest text-gray-900 sm:text-left dark:text-white">
              {move?.displayName}
            </h2>
            <nav className="-mb-1 flex flex-col items-center space-y-2.5 text-center sm:items-start sm:text-left">
              {
                //if positions exist show positions
                move?.positions &&
                  move?.positions.map((a, index) => {
                    return (
                      <a key={a.positionId}>
                        {
                          // if editing, hide move display name and show input
                          !editing[index] ? (
                            a.displayName
                          ) : (
                            <input
                              value={a.displayName}
                              onChange={
                                //onChange, update displayName inside Position
                                (e) => {
                                  if (move) {
                                    const updatedPositions: Position[] =
                                      move.positions?.toSpliced(index, 1, {
                                        ...move.positions[index],
                                        displayName: e.target.value,
                                      }) || []
                                    setMove({
                                      ...move,
                                      positions: updatedPositions,
                                    })
                                  }
                                }
                              }
                              type="text"
                            />
                          )
                        }
                        {
                          // disable ability to delete or add moves when currently editing.
                          !editing[index] && (
                            <div className="flex">
                              <RenderAddButton
                                onClick={onClickAdd(index + 1)}
                              />
                              <RenderEditButton onClick={onClickEdit(index)} />
                              <RenderRedDeleteButton
                                onClick={onClickDelete(index)}
                              />
                            </div>
                          )
                        }
                        {editing[index] && (
                          <RenderEditButton onClick={onClickEdit(index)} />
                        )}
                      </a>
                    )
                  })
              }
              {
                //if there are no moves, add new move
                !move?.positions?.length && (
                  <a>
                    There are no positions. Please add one.
                    <RenderAddButton onClick={onClickAdd(0)} />
                  </a>
                )
              }
            </nav>
          </div>
        </div>
        {move && (
          <Link
            onClick={() => {
              const updatedMoves = currentMoves.map((a) => {
                if (a.moveId === moveId) {
                  return move
                }
                return a
              })
              updateLocalStorageGlobal[lsUserLearning](
                updatedMoves,
                accessToLocalStorage,
              )
            }}
            href={{
              pathname: '/learnmoves/move',
              query: { moveId: move.moveId },
            }}
          >
            <button className="mx-auto mt-16 flex rounded border-0 bg-indigo-500 px-8 py-2 text-lg text-white hover:bg-indigo-600 focus:outline-none">
              Save and Exit
            </button>
          </Link>
        )}
      </div>
    </section>
  )
}
//--------------------------------------------------------------------------------------------------------

/**
 *
 * Render the move/editpositions page
 */
export default function RenderPage() {
  return (
    <div>
      <Suspense fallback={<LoadingFallback />}>
        <RenderPositions />
      </Suspense>
    </div>
  )
}
