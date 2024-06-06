'use client'
//@format
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useCallback, useEffect, useState } from 'react'
import RenderThunder from '../_components/RenderChilli'
import { RenderDeleteButtonSVG } from '../_components/Svgs'
import { comboIdKey, extractComboIds } from '../_utils/lib'
import { ComboDictionary, ComboId } from '../_utils/lsTypes'
import { useZustandStore } from '../_utils/zustandLocalStorage'

/**
 * Renders all the completed flows the user has done. In future this will essentially be
 * a "history page"
 * @returns jsx
 */
export default function RenderViewCombos() {
  //------------------------------state---------------------------------
  const [combos, setCombos] = useState<ComboDictionary | null>(null)
  const [hideMovesIfBattle, setHideMovesIfBattle] = useState<boolean>(false)
  const [combosInBattle, setCombosInBattle] = useState<ComboId[]>()
  const getLsCombos = useZustandStore((state) => state.getLsCombos)
  const deleteLsCombo = useZustandStore((state) => state.deleteLsCombo)
  const getLsBattle = useZustandStore((state) => state.getLsBattle)

  const router = useRouter()

  //-----------------------------hooks-------------------------------
  //Advanced Option: Set Combos used in Battle
  useEffect(() => {
    if (!hideMovesIfBattle) return
    const lsBattle = getLsBattle()
    if (!lsBattle) return
    setCombosInBattle(extractComboIds(lsBattle.rounds))
  }, [getLsBattle, hideMovesIfBattle])

  //updates combos
  const updateCombos = useCallback(() => {
    setCombos(getLsCombos() || null)
  }, [getLsCombos])

  //updates flows using localstorage
  useEffect(() => {
    setCombos(getLsCombos() || null)
  }, [getLsCombos])

  //-----------------------------render---------------------------------
  return (
    <main className="mt-20 w-full dark:bg-gray-900">
      {/* ------------header------------- */}
      <header className="mb-5 flex w-full flex-col text-center dark:text-gray-400">
        <h1 className="title-font mb-2 text-3xl font-medium sm:text-4xl dark:text-white">
          Combos
        </h1>
        {/* ---------------subtitle---------- */}
        <p className="mx-auto px-2 text-base leading-relaxed lg:w-2/3">
          Drill this list. Review your combos for practice and comfortability.
        </p>
      </header>
      {/* ------------save-------------- */}
      <section className="flex justify-center">
        <button className="mt-5 inline-flex rounded border-0 bg-indigo-500 px-6 py-2 text-xs text-white hover:bg-indigo-600 focus:outline-none">
          <Link href="/combos/make">Add Combo</Link>
        </button>
      </section>
      {/* -----------------advanced options---------------- */}
      <section className="mt-5 text-center">
        <details className="flex flex-col leading-snug">
          <summary className="text-xs">Advanced Options</summary>
          <section className="mt-2">
            <article>
              <label className="text-xs">
                Hide combos already used in Battle
              </label>
              <input
                className="ml-1"
                checked={hideMovesIfBattle}
                onChange={(e) => {
                  setHideMovesIfBattle(e.target.checked)
                }}
                type="checkbox"
              />
            </article>
          </section>
        </details>
        <section className="flex flex-col"></section>
      </section>
      {/* ------------------end of advanced options------------- */}
      {/* ---------render combo boxes ------------ */}
      <section className="columns-3 gap-1 space-y-2 pt-5 sm:columns-5 lg:columns-8">
        {combos &&
          Object.entries(combos).map(([comboId, comboVal], i) => {
            if (!comboVal) return
            const { displayName, notes, execution, sequence } = comboVal
            //Advanced Option
            if (
              hideMovesIfBattle &&
              combosInBattle?.includes(comboId as ComboId)
            ) {
              return
            }

            return (
              <article className="break-inside-avoid-column" key={comboId}>
                <section className="relative flex h-full flex-col overflow-hidden rounded-lg bg-gray-100 bg-opacity-75 px-3 pb-3 pt-5 text-center dark:bg-gray-800 dark:bg-opacity-40">
                  <RenderDeleteButtonSVG
                    onClick={() => {
                      deleteLsCombo(comboId as ComboId)
                      updateCombos()
                    }}
                    className="absolute right-2 top-2 size-2"
                  />
                  <h2 className="bold text-xs dark:text-white">
                    {displayName}
                  </h2>
                  <div className="mt-2 flex flex-row-reverse justify-center">
                    {Array.from(Array(5)).map((_, i) => {
                      return (
                        <RenderThunder key={i} checked={i === 5 - execution} />
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
                  {/* ------------edit----------- */}
                  <section>
                    {comboId && (
                      <button
                        onClick={(_) => {
                          console.log('move user to edit combo page')
                          router.push(`/combos/make?${comboIdKey}=${comboId}`)
                        }}
                        className="ml-1 inline-flex h-fit rounded border-0 
                                bg-indigo-500 p-0.5 text-[7px] 
                                text-white hover:bg-indigo-600 focus:outline-none"
                      >
                        EDIT COMBO
                      </button>
                    )}
                  </section>

                  {/* --------notes--------- */}
                  <label className="text-[9px]">Notes</label>
                  <p className="text-[6px]  leading-relaxed">{notes}</p>
                </section>
              </article>
            )
          })}
      </section>
      {/* -------------------end of combos--------------------- */}
    </main>
  )
}
