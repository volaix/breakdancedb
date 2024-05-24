'use client'
//@format
import { useEffect, useState } from 'react'
import { BasicFlow } from '../_utils/localStorageTypes'
import { useZustandStore } from '../_utils/zustandLocalStorage'
import Link from 'next/link'

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
          {
            //render 10 hearts
            Array.from(Array(5)).map((a, i) => {
              return (
                <>
                  <input
                    //When heart is clicked, the input will update local state and localstorage
                    onChange={(e) => {
                      console.log('onchange')
                    }}
                    // checked={i === 10 - rating}
                    type="radio"
                    className="peer -ms-5 size-4 cursor-pointer
                     appearance-none border-0 bg-transparent
                      text-transparent checked:bg-none focus:bg-none focus:ring-0 focus:ring-offset-0"
                    // id={'' + (10 - i)}
                  />
                  <label
                    className="pointer-events-none text-gray-300 
            peer-checked:text-yellow-400"
                  >
                    <svg
                      className="size-4 flex-shrink-0"
                      fill="currentColor"
                      version="1.1"
                      viewBox="0 0 560.317 560.316"
                    >
                      <g>
                        <g>
                          <path d="M207.523,560.316c0,0,194.42-421.925,194.444-421.986l10.79-23.997c-41.824,12.02-135.271,34.902-135.57,35.833    C286.96,122.816,329.017,0,330.829,0c-39.976,0-79.952,0-119.927,0l-12.167,57.938l-51.176,209.995l135.191-36.806    L207.523,560.316z" />
                        </g>
                      </g>
                    </svg>
                  </label>
                </>
              )
            })
          }
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
          <Link href="/addflow">Add Flow</Link>
        </button>
      </div>
    </div>
  )
}
