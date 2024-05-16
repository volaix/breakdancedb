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
import { useForm, SubmitHandler, Form } from 'react-hook-form'
import {
  makeDefaultMovementGroupArr,
  makeDefaultPosition,
  makeDefaultTransition,
  makeMovementId,
  makePositionId,
  makeTransitionId,
} from '@/app/_utils/lsMakers'
import { create } from 'zustand'
import { MovementType, MovementKeys } from './pagetypes'

// ----------------------Page Store-----------------------------
export interface DataLearnState {
  //note key for isEditing is actually a number from an index array fnc. however in js all keys are strings.
  isEditing: ({ [key: string]: boolean }) | null
  setIsEditing: (val: { [key: string]: boolean }) => void
}

export const useDataLearnStore = create<DataLearnState>()((set) => ({
  isEditing: null,
  setIsEditing: (val) => set(() => ({ isEditing: val })),
}))


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


/**
 * Renders the heading text, and all the moves
 */
const RenderMoveLearn = () => {
  //-------------------------------state--------------------------------

  //zustand
  const setIsEditing = useDataLearnStore((state) => state.setIsEditing)
  const isEditing = useDataLearnStore((state) => state.isEditing)

  //react
  const [localMovements, setLocalMovements] = useState<MovementGroup[]>([])
  const [accessToLocalStorage, setAccessToLocalStorage] = useState(false)
  const [move, setMove] = useState<Move | null>(null)
  const [hasOppositeSide, setHasOppositeSide] = useState<boolean>(false)

  const searchParams = useSearchParams()
  const moveId: string | null = searchParams?.get('moveId') || null
  const router = useRouter()

  // -------------------------------------USE EFFECT---------------------------

  //makes sure has access to local storage
  useLocalStorage(setAccessToLocalStorage)

  //Hook to update after localstorage has been set
  // useEffect(() => { }, [setIsEditing])

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
              //---------------------------------------------------------------
              return <RenderMovementGroup
                key={movement.displayName}
                movement={movement}
                indexNumber={i}
                localMovements={localMovements}
                setMove={setMove}
                move={move}
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
