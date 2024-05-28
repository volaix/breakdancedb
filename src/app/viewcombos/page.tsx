'use client'
//@format
import Link from 'next/link'
import { useEffect, useState } from 'react'
import RenderThunder from '../_components/RenderChilli'
import { FlowDictionary } from '../_utils/localStorageTypes'
import { useZustandStore } from '../_utils/zustandLocalStorage'

/**
 * Renders all the completed flows the user has done. In future this will essentially be
 * a "history page"
 * @returns jsx
 */
export default function RenderViewCombos() {
  //------------------------------state---------------------------------
  const [flows, setFlows] = useState<FlowDictionary | null>(null)
  const getLsFlows = useZustandStore((state) => state.getLsFlows)

  //-----------------------------hooks-------------------------------

  //updates flows using localstorage
  useEffect(() => {
    setFlows(getLsFlows())
  }, [getLsFlows])

  //-----------------------------render---------------------------------

  return (
    <div className="w-full dark:bg-gray-900">
      <div className="mt-20">
        <div className="mb-10 flex w-full flex-col text-center dark:text-gray-400">
          {/* ------------title------------- */}
          <h1 className="title-font mb-2 text-3xl font-medium sm:text-4xl dark:text-white">
            View Combos
          </h1>
          {/* ---------------subtitle---------- */}
          <p className="mx-auto px-2 text-base leading-relaxed lg:w-2/3">
            Review combos for practice and comfortability.
          </p>
        </div>
        <div className="flex flex-wrap pt-10">
          {/* ---------render flow boxes ------------ */}
          {flows &&
            Object.entries(flows).map(
              ([key, { entryMove, exitMove, keyMove, rating, notes }], i) => {
                return (
                  <div className="w-1/3 p-1" key={key}>
                    <div
                      className="relative flex h-full flex-col overflow-hidden rounded-lg 
     bg-gray-100 bg-opacity-75 
      px-3 pb-6 pt-5 text-center dark:bg-gray-800 dark:bg-opacity-40"
                    >
                      <div className="flex flex-row-reverse">
                        {Array.from(Array(5)).map((_, i) => {
                          return (
                            <RenderThunder key={i} checked={i === 5 - rating} />
                          )
                        })}
                      </div>

                      <h1 className="title-font mb-1 text-[9px] font-medium text-black dark:text-white">
                        {[
                          {
                            category: entryMove.category,
                            displayText: entryMove.displayName,
                          },
                          {
                            category: keyMove.category,
                            displayText: keyMove.displayName,
                          },
                          {
                            category: exitMove.category,
                            displayText: exitMove.displayName,
                          },
                        ].map(({ category, displayText }) => {
                          return (
                            <div
                              key={displayText}
                              className="flex flex-col items-start overflow-hidden	text-ellipsis whitespace-nowrap"
                            >
                              <div className="text-[6px] text-gray-400 dark:text-gray-500">{`${category}: `}</div>
                              <div>{displayText}</div>
                            </div>
                          )
                        })}
                      </h1>
                      <p className="text-[6px]  leading-relaxed">{notes}</p>
                    </div>
                  </div>
                )
              },
            )}
        </div>
        <button className="ml-10 mt-10 inline-flex rounded border-0 bg-indigo-500 px-6 py-2 text-xs text-white hover:bg-indigo-600 focus:outline-none">
          <Link href="/combos">Add Combo</Link>
        </button>
      </div>
    </div>
  )
}
