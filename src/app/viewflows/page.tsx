'use client'
//@format
import { useEffect, useState } from 'react'
import { BasicFlow } from '../_utils/localStorageTypes'
import { useZustandStore } from '../_utils/zustandLocalStorage'
import Link from 'next/link'
import RenderChilli from '../_components/RenderChilli'

/**
 * renders the flow box that displays 3 lines of text (the flow learned) and a lightning rating
 * @param param0 Flow
 * @returns jsx
 */
const FlowBox = ({ flow }: { flow: BasicFlow }) => {
  //-----------------------------render-----------------------------------
  return (
    <div className="w-1/3 p-1">
      <div
        className="relative flex h-full flex-col overflow-hidden rounded-lg 
     bg-gray-100 bg-opacity-75 
      px-3 pb-6 pt-5 text-center dark:bg-gray-800 dark:bg-opacity-40"
      >
        <div className="flex flex-row-reverse">
          {Array.from(Array(5)).map((a, i) => {
            return <RenderChilli key={i} />
          })}
        </div>

        <h1 className="title-font mb-1 text-[9px] font-medium text-black dark:text-white">
          {[
            { category: 'Footwork', displayText: '1 step' },
            { category: 'Footwork', displayText: '3 step but circular' },
            { category: 'Footwork', displayText: '6 step' },
          ].map(({ category, displayText }) => {
            return (
              <div
                key={displayText}
                className="flex flex-col items-start overflow-hidden	text-ellipsis whitespace-nowrap"
              >
                <div className="text-[6px] text-gray-400 dark:text-gray-500">{`Footwork: `}</div>
                <div>3 step but circular</div>
              </div>
            )
          })}
        </h1>
        <p className="text-[6px]  leading-relaxed">
          Addon notes about this flow. Hands are nice.
        </p>
      </div>
    </div>
  )
}

/**
 * Renders all the completed flows the user has done. In future this will essentially be
 * a "history page"
 * @returns jsx
 */
export default function RenderCompletedMoves() {
  //------------------------------state---------------------------------
  const [flows, setFlows] = useState<BasicFlow[] | null>(null)
  const getLsFlows = useZustandStore((state) => state.getLsFlows)

  //-----------------------------hooks-------------------------------

  //updates flows using localstorage
  useEffect(() => {
    setFlows([
      { entryMove: 'test', keyMove: 'test', exitMove: 'test' },
      { entryMove: 'test', keyMove: 'test', exitMove: 'test' },
      { entryMove: 'test', keyMove: 'test', exitMove: 'test' },
      { entryMove: 'test', keyMove: 'test', exitMove: 'test' },
    ])
  }, [])

  //-----------------------------render---------------------------------
  return (
    <div className="w-full dark:bg-gray-900">
      <div className="mt-20">
        <div className="mb-10 flex w-full flex-col text-center dark:text-gray-400">
          <h1 className="title-font mb-2 text-3xl font-medium sm:text-4xl dark:text-white">
            Learn Flows
          </h1>
          <p className="mx-auto px-2 text-base leading-relaxed lg:w-2/3">
            Manage your flows here.
          </p>
        </div>
        <div className="flex flex-wrap pt-10">
          {flows &&
            flows.map((flow) => {
              return (
                <FlowBox
                  key={flow.entryMove + flow.keyMove + flow.exitMove}
                  flow={flow}
                />
              )
            })}
        </div>
        <button className="ml-10 mt-10 inline-flex rounded border-0 bg-indigo-500 px-6 py-2 text-xs text-white hover:bg-indigo-600 focus:outline-none">
          <Link href="/learnflows/addflow">Add Flow</Link>
        </button>
      </div>
    </div>
  )
}
