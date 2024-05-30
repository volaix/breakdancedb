'use client'
//@format
import Link from 'next/link'
import { useEffect, useState } from 'react'
import RenderThunder from '../_components/RenderChilli'
import { ComboDictionary, FlowDictionary } from '../_utils/localStorageTypes'
import { useZustandStore } from '../_utils/zustandLocalStorage'

/**
 * Renders all the completed flows the user has done. In future this will essentially be
 * a "history page"
 * @returns jsx
 */
export default function RenderViewCombos() {
  //------------------------------state---------------------------------
  const [combos, setCombos] = useState<ComboDictionary | null>(null)
  const getLsCombos = useZustandStore((state) => state.getLsCombos)

  //-----------------------------hooks-------------------------------

  //updates flows using localstorage
  useEffect(() => {
    setCombos(getLsCombos() || null)
  }, [getLsCombos])

  //-----------------------------render---------------------------------

  return (
    <div className="w-full dark:bg-gray-900">
      <div className="mt-20">
        <div className="mb-5 flex w-full flex-col text-center dark:text-gray-400">
          {/* ------------title------------- */}
          <h1 className="title-font mb-2 text-3xl font-medium sm:text-4xl dark:text-white">
            View Combos
          </h1>
          {/* ---------------subtitle---------- */}
          <p className="mx-auto px-2 text-base leading-relaxed lg:w-2/3">
            Drill this list. Review your combos for practice and comfortability.
          </p>
        </div>
        <div className="flex flex-wrap pt-5">
          {/* ---------render combo boxes ------------ */}
          {combos &&
            Object.entries(combos).map(
              ([comboId, { displayName, notes, execution, sequence }], i) => {
                return (
                  <div className="h-fit w-1/3 p-1" key={comboId}>
                    <div className="relative flex h-full flex-col overflow-hidden rounded-lg bg-gray-100 bg-opacity-75 px-3 pb-3 pt-5 text-center dark:bg-gray-800 dark:bg-opacity-40">
                      <h2 className="bold text-xs dark:text-white">
                        {displayName}
                      </h2>
                      <div className="mt-2 flex flex-row-reverse justify-center">
                        {Array.from(Array(5)).map((_, i) => {
                          return (
                            <RenderThunder
                              key={i}
                              checked={i === 5 - execution}
                            />
                          )
                        })}
                      </div>
                      <label className="text-[9px]">Execution</label>

                      <h1 className="title-font mb-1 text-[9px] font-medium text-black dark:text-white">
                        {sequence.map(({ moves }, index) => {
                          return (
                            <div
                              key={moves.toString()}
                              className="flex flex-col items-start text-ellipsis"
                            >
                              <div className="text-[6px] text-gray-400 dark:text-gray-500">
                                {index + 1}
                              </div>
                              <div>{moves.join(' -> ')}</div>
                            </div>
                          )
                        })}
                      </h1>
                      <label className="text-[9px]">Notes</label>
                      <p className="text-[6px]  leading-relaxed">{notes}</p>
                    </div>
                  </div>
                )
              },
            )}
        </div>
        <button className="ml-10 mt-10 inline-flex rounded border-0 bg-indigo-500 px-6 py-2 text-xs text-white hover:bg-indigo-600 focus:outline-none">
          <Link href="/combos/make">Add Combo</Link>
        </button>
      </div>
    </div>
  )
}
