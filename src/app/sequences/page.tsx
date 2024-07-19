'use client'
//@format
import { useCallback, useEffect, useState } from 'react'
import { useZustandStore } from '../_utils/zustandLocalStorage'
import { ComboDictionary, Round } from '../_utils/zustandTypes'

import { RenderTrashButtonSvg } from '../_components/Svgs'
import { makeRoundId } from '../_utils/lsGenerators'
import { comboIdSchema } from '../_utils/zodSchemas'
import ComboPicker from './ComboPicker'

/**
 * Shows combo transitions
 * @returns jsx
 */
export default function RenderViewCombos() {
  //------------------------------state---------------------------------
  const [{ roundName }] = useState<{
    show: boolean
    hideUsedCombos: boolean
    roundName: string
  }>({ hideUsedCombos: true, roundName: 'Round', show: false })

  const [yourRounds, setYourSequences] = useState<Round[]>([
    {
      displayName: roundName + ' 1',
      rating: 1,
      id: makeRoundId(),
    },
  ])
  const [combos, setCombos] = useState<ComboDictionary | null>(null)
  const getLsCombos = useZustandStore((state) => state.getLsCombos)
  const addRound = useZustandStore((state) => state.addRound)
  const getLsBattle = useZustandStore((state) => state.getLsBattle)
  const deleteRound = useZustandStore((state) => state.deleteRound)

  //-----------------------------hooks-------------------------------
  //updates combos
  const updateCombos = useCallback(() => {
    setCombos(getLsCombos() || null)
  }, [getLsCombos])

  //on mount get combos
  useEffect(() => {
    updateCombos()
  }, [updateCombos])

  const updateSequences = useCallback(() => {
    const data = getLsBattle()
    if (!data) return
    setYourSequences(data.rounds)
  }, [getLsBattle])

  //onMount get rounds
  useEffect(() => {
    updateSequences()
  }, [updateSequences])

  //-----------------------------render---------------------------------
  return (
    <main className="mt-20 w-full dark:bg-gray-900">
      {/* ------------header------------- */}
      <header className="mb-5 flex w-full flex-col text-center dark:text-gray-400">
        <h1 className="title-font mb-2 text-3xl font-medium sm:text-4xl dark:text-white">
          Sequences
        </h1>
        {/* ---------------subtitle---------- */}
        <p className="mx-auto px-2 text-base leading-relaxed lg:w-2/3">
          Organise your combos
        </p>
      </header>
      {/* ------------ADD SEQUENCE------------- */}
      <section className="flex justify-center">
        <button
          onClick={() => {
            addRound()
            updateSequences()
          }}
          className="mt-5 inline-flex rounded border-0 bg-indigo-500 px-6 py-2 text-xs text-white hover:bg-indigo-600 focus:outline-none"
        >
          Add New Sequence
        </button>
      </section>
      {/* -----------------TABLE--------------- */}
      <section className="scroll mx-0 my-5 overflow-hidden overflow-x-auto rounded-lg border border-gray-200 shadow-md md:mx-5 dark:border-gray-700">
        <table className="w-full border-collapse bg-white text-left text-sm text-gray-500 dark:bg-gray-900">
          <thead className="bg-gray-50 font-medium text-gray-900 dark:bg-slate-900">
            <tr>
              <th
                scope="col"
                className="py-4 pl-1 font-medium text-gray-900 dark:text-white"
              >
                #
              </th>
              <th
                scope="col"
                className="px-6 py-4 font-medium text-gray-900 dark:text-white"
              >
                Starters
              </th>
              <th
                scope="col"
                className="px-6 py-4 font-medium text-gray-900 dark:text-white"
              >
                Mids
              </th>
              <th
                scope="col"
                className="px-6 py-4 font-medium text-gray-900 dark:text-white"
              >
                Finishers
              </th>
              <th
                scope="col"
                className="px-6 py-4 font-medium text-gray-900 dark:text-white"
              >
                Actions
              </th>
            </tr>
          </thead>
          {yourRounds.map(
            (
              { id, displayName, rating: comboRating, comboList, sequenceList },
              roundIndex,
            ) => {
              return (
                <tbody
                  key={roundIndex}
                  className="divide-gray-100 border-t border-gray-100 dark:border-gray-800"
                >
                  <tr className="text-2xs font-normal text-gray-900 hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-gray-800/20">
                    {/* ------------NUMBER---------- */}
                    <td className="flex py-4 pl-1">
                      <div className="text-xs">
                        <div className="text-gray-400 dark:font-medium dark:text-gray-700">
                          {roundIndex + 1}
                        </div>
                      </div>
                    </td>
                    {/* ---------------STARTERS------------ */}
                    <td className="px-2">
                      <ComboPicker
                        value={comboIdSchema
                          .nullable()
                          .parse(sequenceList?.starter?.[0] || null)}
                        refreshBattle={updateSequences}
                        roundId={id}
                        type="starter"
                        position={0}
                      />
                    </td>

                    {/* ----------------MIDS------------- */}
                    <td className="px-2">
                      <ComboPicker
                        value={comboIdSchema
                          .nullable()
                          .parse(sequenceList?.mids?.[0] || null)}
                        refreshBattle={updateSequences}
                        roundId={id}
                        type="mids"
                        position={0}
                      />
                    </td>
                    {/* --------------FINISHERS-------------- */}
                    <td className="px-2">
                      <ComboPicker
                        value={comboIdSchema
                          .nullable()
                          .parse(sequenceList?.finishers?.[0] || null)}
                        refreshBattle={updateSequences}
                        roundId={id}
                        type="finishers"
                        position={0}
                      />
                    </td>
                    {/* -----------ACTIONS------------- */}
                    <td>
                      <div className="flex items-center">
                        {/* delete button */}
                        <RenderTrashButtonSvg
                          className="size-6 cursor-pointer stroke-gray-500 p-1 hover:rounded-lg hover:bg-gray-500/20"
                          onClick={() => {
                            deleteRound(id)
                            updateSequences()
                          }}
                        />
                      </div>
                    </td>
                  </tr>
                </tbody>
              )
            },
          )}
          {!combos && (
            <tbody>
              <tr>
                <td className="text-center">No combos to load</td>
              </tr>
            </tbody>
          )}
        </table>
      </section>
    </main>
  )
}
