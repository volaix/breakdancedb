'use client'
//@format
import { useRouter } from 'next/navigation'
import { useCallback, useEffect, useState } from 'react'
import RenderThunder from '../_components/RenderChilli'
import { comboIdKey, extractComboIds } from '../_utils/lib'
import { ComboDictionary, ComboId } from '../_utils/lsTypes'
import { useZustandStore } from '../_utils/zustandLocalStorage'

import MoveTag from './MoveTag'
import { isComboId } from '../_utils/lsValidation'
import Link from 'next/link'
import {
  RenderAddButtonSVG,
  RenderDownArrow,
  RenderPenSvg,
  RenderTrashButtonSvg,
  RenderUpArrow,
} from '../_components/Svgs'
import AutoComplete from './AutoComplete'
import { ComboIdContext } from './util'

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
  const [hasAddMoveInput, setHasAddMoveInput] = useState<boolean[]>([])
  const getLsCombos = useZustandStore((state) => state.getLsCombos)
  const getLsBattle = useZustandStore((state) => state.getLsBattle)
  const deleteLsCombo = useZustandStore((state) => state.deleteLsCombo)
  const moveCombo = useZustandStore((state) => state.upDownMoveComboPosition)
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

  //initialises add move inputs
  useEffect(() => {
    setHasAddMoveInput(
      (combos && Object.keys(combos).map((comboKeys) => false)) ?? [],
    )
  }, [combos])

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
      <section className="flex justify-center">
        <button className="mt-5 inline-flex rounded border-0 bg-indigo-500 px-6 py-2 text-xs text-white hover:bg-indigo-600 focus:outline-none">
          <Link href="/combos/make">Add Combo</Link>
        </button>
      </section>
      {/* -----------------advanced options---------------- */}
      {/* //battle does not exist right now */}
      {false && (
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
      )}
      {/* ------------------end of advanced options------------- */}
      {/* -----------------TABLE--------------- */}
      <section className="scroll mx-0 my-5 overflow-hidden overflow-x-auto rounded-lg border border-gray-200 shadow-md md:mx-5 dark:border-gray-700">
        <table className="w-full border-collapse bg-white text-left text-sm text-gray-500 dark:bg-gray-900">
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
              {/* <th scope="col" className="px-6 py-4 font-medium text-gray-900 dark:text-white">
                Role
              </th> */}
              <th
                scope="col"
                className="px-6 py-4 font-medium text-gray-900 dark:text-white"
              >
                Actions
              </th>
              {/* <th
                scope="col"
                className="px-6 py-4 font-medium text-gray-900 dark:text-white"
              >
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
                  className="divide-gray-100 border-t border-gray-100 dark:border-gray-800"
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
                    <td className="min-w-72 px-6 py-4 text-2xs">
                      <section className="flex max-w-72 flex-wrap">
                        {sequence &&
                          sequence.map(({ moves }, moveIndex) => {
                            return (
                              <ComboIdContext.Provider
                                value={{ comboId, moveIndex, updateCombos }}
                                key={moveIndex}
                              >
                                <MoveTag moves={moves} />
                              </ComboIdContext.Provider>
                            )
                          })}
                        {!hasAddMoveInput[comboIndex] && (
                          <RenderAddButtonSVG
                            className="my-0.5 flex size-7 items-center gap-1 text-ellipsis rounded-sm bg-blue-50 fill-blue-600 px-2 py-0.5 text-xs font-semibold text-blue-600 dark:bg-blue-600/20 dark:hover:bg-blue-900/70"
                            onClick={() => {
                              setHasAddMoveInput((prev) =>
                                prev.toSpliced(comboIndex, 0, true),
                              )
                            }}
                          />
                        )}
                        {hasAddMoveInput[comboIndex] && (
                          <ComboIdContext.Provider
                            value={{
                              comboId,
                              moveIndex: sequence.length,
                              updateCombos,
                            }}
                          >
                            <AutoComplete
                              closeInput={() => {
                                setHasAddMoveInput((prev) =>
                                  prev.toSpliced(comboIndex, 0, false),
                                )
                              }}
                            />
                          </ComboIdContext.Provider>
                        )}
                      </section>
                    </td>
                    {/* ----------------USABILITY------------- */}
                    <td className="px-6 py-4">
                      <div className="mt-2 inline-flex cursor-default flex-row-reverse items-center justify-center gap-1 rounded-full bg-blue-50 px-2 py-1 text-xs font-semibold text-blue-600 dark:bg-gray-800">
                        {Array.from(Array(5)).map((_, i) => {
                          return (
                            <RenderThunder
                              key={i}
                              checked={i === 5 - execution}
                              readOnly
                            />
                          )
                        })}
                      </div>
                      {/* <span className="inline-flex items-center px-2 py-1 text-xs font-semibold text-green-600 rounded-full gap-1 bg-green-50">
                        <span className="h-1.5 w-1.5 rounded-full bg-green-600"></span>
                        Active
                      </span> */}
                    </td>
                    {/* -----------------ROLES------------- */}
                    {/* <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-2">
                        <span className="inline-flex items-center px-2 py-1 text-xs font-semibold text-blue-600 rounded-full gap-1 bg-blue-50">
                          Design
                        </span>
                        <span className="inline-flex items-center px-2 py-1 text-xs font-semibold text-indigo-600 rounded-full gap-1 bg-indigo-50">
                          Product
                        </span>
                        <span className="inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full gap-1 bg-violet-50 text-violet-600">
                          Develop
                        </span>
                      </div>
                    </td> */}
                    {/* ----------------ACTIONS------------ */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <section>
                          <RenderUpArrow
                            onClick={() => {
                              moveCombo(comboIndex, 'up')
                              updateCombos()
                            }}
                            className="size-6 cursor-pointer fill-gray-500 p-1 pb-0 hover:rounded-lg hover:bg-gray-500/20"
                          />
                          <RenderDownArrow
                            onClick={() => {
                              moveCombo(comboIndex, 'down')
                              updateCombos()
                            }}
                            className="size-6 cursor-pointer fill-gray-500 p-1 pt-0  hover:rounded-lg hover:bg-gray-500/20"
                          />
                        </section>
                        {/* delete button */}
                        <RenderTrashButtonSvg
                          className="size-6 cursor-pointer"
                          onClick={() => {
                            deleteLsCombo(comboId as ComboId)
                            updateCombos()
                          }}
                        />
                        {/* edit button */}
                        <RenderPenSvg
                          className="size-6 cursor-pointer"
                          onClick={() => {
                            console.log('move user to edit combo page')
                            router.push(`/combos/make?${comboIdKey}=${comboId}`)
                          }}
                        />
                      </div>
                    </td>
                    {/* -------------------NOTES---------------- */}
                    {/* <td className="px-6 py-4">
                      <div className="flex gap-4 text-xs">{notes}</div>
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
