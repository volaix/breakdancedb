'use client'
import { useState, useEffect, Suspense } from 'react'
import { useLocalStorage } from '@/app/_utils/lib'
import {
  MovementGroup,
  TypeLoopOptions,
  lsUserLearning,
} from '@/app/_utils/localStorageTypes'
import RenderMovementGroup from './MovementGroup'
import {
  getLocalStorageGlobal,
  setLocalStorageGlobal,
} from '@/app/_utils/accessLocalStorage'
import { Move } from '@/app/_utils/localStorageTypes'
import { useSearchParams } from 'next/navigation'
import LoadingFallback from '@/app/_components/LoadingFallback'
import { useRouter } from 'next/navigation'
import { useForm, SubmitHandler } from 'react-hook-form'
import { makeDefaultMovementGroupArr } from '@/app/_utils/lsMakers'
import { create } from 'zustand'
import { produce } from 'immer'


//-------------------------------Local Types---------------------------------

type RadioTypes = {
  transitionType: 'oppositeSide' | 'sameSide' | 'cannotRepeat'
}

//-----------------------------------------------

/**
 * Renders the heading text, and all the moves
 */
const RenderMoveLearn = () => {
  //-------------------------------state--------------------------------

  //react
  const [localMovements, setLocalMovements] = useState<MovementGroup[]>([])
  const [accessToLocalStorage, setAccessToLocalStorage] = useState(false)
  const [move, setMove] = useState<Move | null>(null)
  const [loopOptions, setLoopOptions] = useState<TypeLoopOptions>({
    hasOppositeSide: false,
    none: true,
    sameDirectionLoop: false,
  })

  const searchParams = useSearchParams()
  const moveId: string | null = searchParams?.get('moveId') || null
  const router = useRouter()
  const inDevelopment = true

  const { register, handleSubmit } = useForm<RadioTypes>()

  // -------------------------------------USE EFFECT---------------------------

  useEffect(() => {
    if (accessToLocalStorage) {
      //sets local loop options to what's set in localstorage
    }
  }, [accessToLocalStorage])

  //makes sure has access to local storage
  useLocalStorage(setAccessToLocalStorage)

  //Hook to update after localstorage has been set
  // useEffect(() => { }, [setIsEditing])

  //sets the order of the movements
  useEffect(() => {
    if (move) {
      if (!!move?.loopOption) {
        //sets local to whatever localstorage is
        if (move.loopOption.hasOppositeSide) {
          setLoopOptions({ hasOppositeSide: true })
        } else {
          //defaults to "none"
          setLoopOptions({ none: true })
        }
      }
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
  const onReverseDirection: SubmitHandler<RadioTypes> = (e) => {
    console.log('e: ', e)
    let loopKey: keyof TypeLoopOptions

    //--------------set locally--------------
    if (e.transitionType === 'oppositeSide') {
      setLoopOptions({ hasOppositeSide: true })
      loopKey = 'hasOppositeSide'
    } else {
      setLoopOptions({ none: true })
      loopKey = 'none'
    }

    //----------set in localstorage-----------------
    setLocalStorageGlobal.userLearning(
      produce(
        getLocalStorageGlobal.userLearning(accessToLocalStorage),
        (draft) => {
          const index = draft.findIndex((a) => a.moveId === move?.moveId)
          if (index !== undefined && index > -1) {
            draft[index].loopOption = { [loopKey]: true }
          } else {
            return
          }
        },
      ),
      accessToLocalStorage,
    )
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
          {/* Render Main MovementsGroup */}
          {move &&
            localMovements &&
            localMovements.map((movement, i) => {
              //---------------------------------------------------------------
              return (
                <RenderMovementGroup
                  key={movement.displayName}
                  movement={movement}
                  indexNumber={i}
                  localMovements={localMovements}
                  setMove={setMove}
                  move={move}
                />
              )
            })}
        </div>
        <div>
          {
            //render opposite side movement groups
            loopOptions.hasOppositeSide && move && localMovements && (
              <>
                {/* -----------SPACER--------------- */}
                <div className="mb-4 mt-2 flex justify-center">
                  <div className="inline-flex h-1 w-16 w-full rounded-full bg-indigo-500"></div>
                </div>

                {localMovements.map((movement, i) => {
                  return (
                    <RenderMovementGroup
                      key={movement.displayName}
                      movement={movement}
                      indexNumber={i}
                      localMovements={localMovements}
                      setMove={setMove}
                      move={move}
                      isOppositeSide={loopOptions.hasOppositeSide}
                    />
                  )
                })}
              </>
            )
          }
        </div>

        <div className="flex flex-col flex-wrap content-center">
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="my-5 ml-auto flex w-3/5 w-full justify-center rounded border-0 bg-indigo-500 px-6 py-2 text-xs text-white hover:bg-indigo-600 focus:outline-none"
          >
            Scroll to Top
          </button>
        </div>
        {/* -----------SPACER--------------- */}
        <div className="mb-4 flex justify-center ">
          <div className="inline-flex h-1 w-16 w-full rounded-full bg-indigo-500"></div>
        </div>
        <div className="pt-15 text-xs dark:text-white">Repeat Options</div>
        <div>
          <form
            className="flex-col pb-5 pt-2 text-xs"
            onSubmit={handleSubmit(onReverseDirection)}
          >
            <div>
              <span>
                <input
                  key={Math.random()}
                  {...register('transitionType')}
                  type="radio"
                  name="transitionType"
                  value="oppositeSide"
                  defaultChecked={loopOptions.hasOppositeSide}
                />
                Move into reverse direction?
              </span>
            </div>

            <div>
              <span>
                <input
                  {...register('transitionType')}
                  key={Math.random()}
                  type="radio"
                  name="transitionType"
                  value="none"
                  defaultChecked={loopOptions.none}
                />
                None
              </span>
            </div>

            {inDevelopment || (
              <>
                <input type="radio" />
                {' Transitions into same direction?  '}
                <input type="radio" />
                {'Cannot Transition into same move'}
              </>
            )}
            <div className="flex flex-col flex-wrap content-center">
              <button
                type="submit"
                className="ml-auto mt-5 flex w-3/5 w-full justify-center rounded border-0 bg-indigo-500 px-6 py-2 text-xs text-white hover:bg-indigo-600 focus:outline-none"
              >
                Update Loop
              </button>
            </div>
          </form>
        </div>
        <div></div>
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
