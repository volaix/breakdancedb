'use client'
// @format
import RenderHeader from '@/app/_components/Header'
import { useState, useEffect } from 'react'
import { useLocalStorage } from '../_utils/lib'
import { Flow } from '../_utils/localStorageTypes'
import Image from 'next/image'
import { useZustandStore } from '../_utils/zustandLocalStorage'

//------------------------local utils------------------------------
const getRandomItem = (items: string[]) =>
  items[Math.floor(Math.random() * items.length)]

//------------------------localtypes-------------------------------
type Learning = Flow | null
//------------------------components-------------------------------
/**
 * Renders an Image with some text below for each one of the flows
 * @param
 * @returns
 */
const RenderMove = ({ move }: { move: string }) => {
  //----------------------------render-----------------------------
  return (
    <>
      {move && (
        <div className="flex w-full flex-col items-center bg-slate-300 py-3 dark:bg-gray-900">
          <Image
            width="600"
            height="400"
            className="w-5/6 w-full"
            alt="move name"
            src={'https://dummyimage.com/600x400/000/fff'}
          />
          <div className="capitalize text-black dark:text-white">{move}</div>
        </div>
      )}
    </>
  )
}

//----------------------------mainrender--------------------------
/*
 * Renders 3 moves with 3 buttons at the bottom.
 */
export default function RenderFlows() {
  //-----------------------------state-----------------------------
  const getLsUserMoves = useZustandStore((state) => state.getLsUserMoves)
  const [accessToLocalStorage, setAccessToLocalStorage] = useState(false)
  const [userMoves, setUserMoves] = useState<string[]>([])
  //learning refers to "what will be displayed" and is RNG set
  const [learning, setLearning] = useState<Learning>(null)
  const displayMoves = learning && userMoves.length > 0
  const setLsFlows = useZustandStore((state) => state.setLsFlows)
  const getLsFlows = useZustandStore((state) => state.getLsFlows)

  //---------------------------hooks---------------------------------
  //checks if has access to localstorage
  useLocalStorage(setAccessToLocalStorage)

  //Populate existing moves
  useEffect(() => {
    setUserMoves(getLsUserMoves())
  }, [accessToLocalStorage, getLsUserMoves])

  //sets learning to random
  const setLearningToRandom = (moves: string[]) => {
    setLearning({
      entryMove: getRandomItem(moves),
      keyMove: getRandomItem(moves),
      exitMove: getRandomItem(moves),
    })
  }

  //on mount setLearning
  useEffect(() => {
    setLearningToRandom(userMoves)
  }, [userMoves])

  //-------------------------handlers--------------------------------

  //update local storage when user clicks yes
  const onClickYes = () => {
    //validation for if there is a flow displayed
    if (learning) {
      //updates localstorage with the added flow
      setLsFlows([...getLsFlows(), learning])
    } else {
      console.log('cannot find move currently being learned')
    }

    setLearningToRandom(userMoves)
    //FEATURE: celebration UI element.
    //FEATURE:  popup on 5 star rating for each move multi select
    //FEATURE: have refresh UI feeling
  }
  const onClickSkip = () => {
    //FEATURE: have refresh UI feeling
    setLearningToRandom(userMoves)
  }
  const onClickNo = () => {
    setLearningToRandom(userMoves)
    //FEATURE: have refresh UI feeling
    //FEATURE: Have multiselect appear on where user could not complete. If none are selected then never show the flow combination again.
    //FEATURE: Delete entry if you have it in flows
  }

  //FEATURE Filters for categories (not yet built)
  //FEATURE Categories
  return (
    <main>
      <RenderHeader />
      <div
        className="z-10 
   mt-20 flex w-full max-w-xs flex-col items-center items-center justify-between font-mono text-sm dark:text-gray-600 "
      >
        <div className="mt-10">
          {displayMoves && (
            <>
              <RenderMove move={learning['entryMove']} />
              <RenderMove move={learning['keyMove']} />
              <RenderMove move={learning['exitMove']} />
            </>
          )}
          {displayMoves || (
            <div>please add your moves or import move db here</div>
          )}
        </div>
        <div className="flex justify-evenly px-2 py-5">
          {/* FEATURE on click yes, pop up some celebration. also a rating system on how good it was overall
          how good each move was
          and how good each transition was
          i.e. overall + ea move + ea trans = 7 ratings total 
          */}
          <a
            onClick={onClickYes}
            className="rounded border border-violet-600 bg-violet-600 px-6 py-2 text-center text-white "
          >
            Yes
          </a>

          <a
            onClick={onClickSkip}
            className="rounded border border-violet-600 px-6 py-2 text-center text-violet-600"
          >
            Skip
          </a>
          <a
            onClick={onClickNo}
            className="rounded border border-violet-600 bg-violet-600 px-6 py-2 text-center text-white"
          >
            No
          </a>
        </div>
      </div>
    </main>
  )
}
