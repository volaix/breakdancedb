'use client'
//@format
import { useRouter } from 'next/navigation'
import { createContext, useCallback, useEffect, useState } from 'react'
import RenderThunder from '../_components/RenderChilli'
import { comboIdKey, extractComboIds } from '../_utils/lib'
import { ComboDictionary, ComboId } from '../_utils/lsTypes'
import { useZustandStore } from '../_utils/zustandLocalStorage'

// import Token from './Token'

import MoveTag from './MoveTag'
import RenderCombo from './RenderCombo'
import { isComboId } from '../_utils/lsValidation'

export const ComboIdContext = createContext<{
  updateCombos: () => void
  moveIndex: number
  comboId: string
} | null>(null)

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
  const getLsBattle = useZustandStore((state) => state.getLsBattle)
  const deleteLsCombo = useZustandStore((state) => state.deleteLsCombo)
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
      {/* ------------ADD COMBO------------- */}
      {/* {false && <section className="flex justify-center">
        <button className="mt-5 inline-flex rounded border-0 bg-indigo-500 px-6 py-2 text-xs text-white hover:bg-indigo-600 focus:outline-none">
          <Link href="/combos/make">Add Combo</Link>
        </button>
      </section>} */}
      {/* -----------------advanced options---------------- */}
      {/* {false && <section className="mt-5 text-center">
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
      </section>} */}
      {/* ------------------end of advanced options------------- */}
      {/* -----------------TABLE--------------- */}
      <section className="scroll mx-0 my-5 overflow-hidden overflow-x-auto rounded-lg border border-gray-200 shadow-md md:mx-5 dark:border-gray-700">
        <table className="w-full border-collapse bg-white  text-left text-sm text-gray-500 dark:bg-gray-900">
          <thead className="bg-gray-50 font-medium text-gray-900 dark:bg-slate-900">
            <tr>
              <th
                scope="col"
                className="px-6 py-4 font-medium text-gray-900 dark:text-white"
              >
                Combo #
              </th>
              <th
                scope="col"
                className="px-6 py-4 font-medium text-gray-900 dark:text-white"
              >
                Moves
              </th>
              <th
                scope="col"
                className="px-6 py-4 font-medium text-gray-900 dark:text-white"
              >
                Usability
              </th>
              {/* <th scope="col" className="px-6 py-4 dark:text-white font-medium text-gray-900">
                Role
              </th> */}
              <th
                scope="col"
                className="px-6 py-4 font-medium text-gray-900 dark:text-white"
              >
                Actions
              </th>
              {/* <th scope="col" className="px-6 py-4 dark:text-white font-medium text-gray-900">
                Notes
              </th> */}
            </tr>
          </thead>
          {combos &&
            Object.entries(combos).map(([comboId, comboVal], comboIndex) => {
              if (!comboVal || !isComboId(comboId)) return
              //Advanced Option
              if (
                hideMovesIfBattle &&
                combosInBattle?.includes(comboId as ComboId)
              ) {
                return
              }

              const { displayName, notes, execution, sequence } = comboVal
              return (
                <tbody
                  key={comboId}
                  className="divide-gray-100 border-t border-gray-100  dark:border-gray-800"
                >
                  <tr className="hover:bg-gray-50 dark:hover:bg-gray-800/20">
                    {/* ------------COMBO NUMBER---------- */}
                    <td className="flex gap-3 px-6 py-4 font-normal text-gray-900">
                      <div className="text-sm">
                        <div className="font-medium text-gray-700">
                          Combo {comboIndex + 1}
                        </div>
                        <div className="text-gray-400">{displayName}</div>
                      </div>
                    </td>
                    {/* ---------------MOVES------------ */}
                    <td className="min-w-72 px-6 py-4  text-2xs">
                      {sequence &&
                        sequence.map(({ moves }, moveIndex) => {
                          return (
                            <ComboIdContext.Provider
                              value={{ comboId, moveIndex, updateCombos }}
                              key={moveIndex}
                            >
                              <MoveTag
                                moves={moves}
                                deleteable={sequence.length > 1}
                              />
                            </ComboIdContext.Provider>
                          )
                        })}
                    </td>
                    {/* ----------------USABILITY------------- */}
                    <td className="px-6 py-4">
                      <div className=" mt-2 inline-flex flex-row-reverse items-center justify-center gap-1 rounded-full bg-blue-50 px-2 py-1 text-xs font-semibold text-blue-600">
                        {Array.from(Array(5)).map((_, i) => {
                          return (
                            <RenderThunder
                              onChange={() => {}}
                              key={i}
                              checked={i === 5 - execution}
                            />
                          )
                        })}
                      </div>
                      {/* <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-semibold text-green-600 rounded-full bg-green-50">
                        <span className="h-1.5 w-1.5 rounded-full bg-green-600"></span>
                        Active
                      </span> */}
                    </td>
                    {/* -----------------ROLES------------- */}
                    {/* <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-2">
                        <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-semibold text-blue-600 rounded-full bg-blue-50">
                          Design
                        </span>
                        <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-semibold text-indigo-600 rounded-full bg-indigo-50">
                          Product
                        </span>
                        <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-semibold rounded-full bg-violet-50 text-violet-600">
                          Develop
                        </span>
                      </div>
                    </td> */}
                    {/* ----------------ACTIONS------------ */}
                    <td className="px-6 py-4">
                      <div className="flex justify-end gap-4">
                        {/* delete button */}
                        <a x-data="{ tooltip: 'Delete' }" href="#">
                          <svg
                            onClick={() => {
                              deleteLsCombo(comboId as ComboId)
                              updateCombos()
                            }}
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke-width="1.5"
                            stroke="currentColor"
                            className="h-6 w-6"
                            x-tooltip="tooltip"
                          >
                            <path
                              stroke-linecap="round"
                              stroke-linejoin="round"
                              d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                            />
                          </svg>
                        </a>
                        {/* edit button */}
                        <a x-data="{ tooltip: 'Edite' }" href="#">
                          <svg
                            onClick={(_) => {
                              console.log('move user to edit combo page')
                              router.push(
                                `/combos/make?${comboIdKey}=${comboId}`,
                              )
                            }}
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke-width="1.5"
                            stroke="currentColor"
                            className="h-6 w-6"
                            x-tooltip="tooltip"
                          >
                            <path
                              stroke-linecap="round"
                              stroke-linejoin="round"
                              d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125"
                            />
                          </svg>
                        </a>
                      </div>
                    </td>
                    {/* -------------------NOTES---------------- */}
                    {/* <td className="px-6 py-4 min-w-60">
                      <div className="flex justify-end gap-4 text-xs">
                        {notes}
                      </div>
                    </td> */}
                  </tr>
                </tbody>
              )
            })}
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
