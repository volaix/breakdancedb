'use client'
//@format
import Link from 'next/link'
import { useCallback, useEffect, useState } from 'react'
import RenderThunder from '../_components/RenderChilli'
import { FlowDictionary, FlowId, PositionId } from '../_utils/localStorageTypes'
import { useZustandStore } from '../_utils/zustandLocalStorage'
import { RenderDeleteButtonSVG, RenderRedHoldButton } from '../_components/Svgs'
import { isFlowId, isLegacyId } from '../_utils/lsMakers'

/**
 * Renders all the completed flows the user has done. In future this will essentially be
 * a "history page"
 * @returns jsx
 */
export default function RenderCompletedMoves() {
  //------------------------------state---------------------------------
  const [flows, setFlows] = useState<FlowDictionary | null>(null)
  const getLsFlows = useZustandStore((state) => state.getLsFlows)
  const deleteLsFlow = useZustandStore((state) => state.deleteLsFlow)

  //-----------------------------hooks-------------------------------

  //updates flows
  const updateFlows = useCallback(() => {
    setFlows(getLsFlows())
  }, [getLsFlows])

  //sets flows on mount
  useEffect(() => {
    updateFlows()
  }, [updateFlows])

  //-----------------------------render---------------------------------

  return (
    <div className="w-full dark:bg-gray-900">
      <div className="mt-20">
        <div className="mb-10 flex w-full flex-col text-center dark:text-gray-400">
          {/* ------------title------------- */}
          <h1 className="title-font mb-2 text-3xl font-medium sm:text-4xl dark:text-white">
            Flows
          </h1>
          {/* ---------------subtitle---------- */}
          <p className="mx-auto px-2 text-base leading-relaxed lg:w-2/3">
            Review completed flows here.
          </p>
        </div>
        <button className="ml-10 mt-10 inline-flex rounded border-0 bg-indigo-500 px-6 py-2 text-xs text-white hover:bg-indigo-600 focus:outline-none">
          <Link href="/learnflows">Add Flow</Link>
        </button>
        <div className="columns-3 gap-1 space-y-2 pt-5 sm:columns-5 lg:columns-8">
          {/* ---------render flow boxes ------------ */}
          {flows &&
            Object.entries(flows).map(
              ([key, { entryMove, exitMove, keyMove, rating, notes }]) => {
                return (
                  <article className="break-inside-avoid-column" key={key}>
                    <section className="relative flex h-full flex-col overflow-hidden rounded-lg bg-gray-100 bg-opacity-75 px-3 pb-3 pt-5 text-center dark:bg-gray-800 dark:bg-opacity-40">
                      <RenderDeleteButtonSVG
                        onClick={() => {
                          if (isFlowId(key) || isLegacyId(key)) {
                            deleteLsFlow(key as FlowId)
                            updateFlows()
                          } else {
                            console.log('not valid ID to delete')
                          }
                        }}
                        className="absolute right-2 top-2 size-2"
                      />
                      <label className="text-[8px]">Likeability Rating</label>
                      <section className="flex flex-row-reverse justify-center">
                        {Array.from(Array(5)).map((_, i) => {
                          return (
                            <RenderThunder key={i} checked={i === 5 - rating} />
                          )
                        })}
                      </section>

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
                      {notes && (
                        <section>
                          <label className="text-[8px] leading-none">
                            Notes
                          </label>
                          <p className="text-[6px] leading-none">{notes}</p>
                        </section>
                      )}
                    </section>
                  </article>
                )
              },
            )}
        </div>
      </div>
    </div>
  )
}
