'use client'
//@format
import { useCallback, useEffect, useMemo, useState } from 'react'
import { extractComboIds } from '../_utils/lib'
import { ComboDictionary, ComboId, Round } from '../_utils/zustandTypes'
import { useZustandStore } from '../_utils/zustandLocalStorage'

import {
  RenderAddButtonSVG,
  RenderDiceSvg,
  RenderDownArrow,
  RenderTrashButtonSvg,
  RenderUpArrow,
} from '../_components/Svgs'
import { makeComboId, makeRoundId } from '../_utils/lsGenerators'
import { isComboId } from '../_utils/lsValidation'
import { useForm } from 'react-hook-form'
import { produce } from 'immer'
import ComboPicker from './ComboPicker'
import { comboIdSchema } from '../_utils/zodSchemas'

/**
 * Shows combo transitions
 * @returns jsx
 */
export default function RenderViewCombos() {
  //------------------------------state---------------------------------
  const [{ hideUsedCombos, roundName, show }, setAdvancedOptions] = useState<{
    show: boolean
    hideUsedCombos: boolean
    roundName: string
  }>({ hideUsedCombos: true, roundName: 'Round', show: false })
  const [openEdit, setOpenEdit] = useState<{ [key: number]: true }>()
  const [openInfo, setOpenInfo] = useState<{ [key: ComboId]: true }>()

  const [notification, setNotification] = useState<null | {
    visible?: boolean
    message?: string
  }>(null)
  const [notes, setNotes] = useState<string>('')
  const [yourRounds, setYourSequences] = useState<Round[]>([
    {
      displayName: roundName + ' 1',
      rating: 1,
      id: makeRoundId(),
    },
  ])
  const setLsBattle = useZustandStore((state) => state.setLsBattle)
  const [combos, setCombos] = useState<ComboDictionary | null>(null)
  const [showChangeName, setShowChangeName] = useState<boolean[]>([])
  const [showRngInput, setShowRngInput] = useState<boolean[]>([])
  const [combosInBattle, setCombosInBattle] = useState<ComboId[]>()
  const [showAddMoveToCombo, setAddMoveToCombo] = useState<boolean[]>([])
  const getLsCombos = useZustandStore((state) => state.getLsCombos)
  const addRound = useZustandStore((state) => state.addRound)
  const getLsBattle = useZustandStore((state) => state.getLsBattle)
  const deleteLsCombo = useZustandStore((state) => state.deleteLsCombo)
  const moveCombo = useZustandStore((state) => state.upDownMoveComboPosition)
  const updateExecution = useZustandStore((state) => state.updateExecution)
  const setLsCombos = useZustandStore((state) => state.setLsCombos)
  const updateDisplayName = useZustandStore((state) => state.updateDisplayName)
  const addComboMove = useZustandStore((state) => state.addComboMove)
  const getUserMoves = useZustandStore((state) => state.getLsUserMoves)

  // const comboEntries = Object.entries(combos ?? {})

  //-----------------------------hooks-------------------------------
  const comboEntries = useMemo(() => Object.entries(combos ?? {}), [combos])

  const allMoves = useMemo(() => {
    if (!combos) return null

    return Object.values(getUserMoves()).flatMap((moves) => moves)
  }, [getUserMoves, combos])

  //updates combos
  const updateCombos = useCallback(() => {
    setCombos(getLsCombos() || null)
  }, [getLsCombos])

  //on mount get combos
  useEffect(() => {
    updateCombos()
  }, [updateCombos])

  //initialises inputs as false
  useEffect(() => {
    const comboBooleans = Object.keys(combos || {}).map(() => false)
    setShowRngInput(comboBooleans)
    setShowChangeName(comboBooleans)
    setAddMoveToCombo(comboBooleans)
  }, [combos])

  const updateSequences = useCallback(() => {
    const data = getLsBattle()
    if (!data) return
    setYourSequences(data.rounds)
  }, [])

  //onMount get rounds
  useEffect(() => {
    updateSequences()
  }, [])

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

                    {/* ----------------USABILITY------------- */}
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
