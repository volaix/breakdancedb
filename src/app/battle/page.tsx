'use client'
//@format
import { produce } from 'immer'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { Notification } from '../_components/Notification'
import {
  RenderAddButtonSVG,
  RenderBrainSvg,
  RenderDeleteButtonSVG,
  RenderEditButton,
  RenderInfoSVG,
} from '../_components/Svgs'
import { ComboDictionary, ComboId, Round } from '../_utils/localStorageTypes'
import { makeRoundId } from '../_utils/lsMakers'
import { useZustandStore } from '../_utils/zustandLocalStorage'

type Inputs = {
  tempText: string //displayName
  categoryName: string
}

/**
 * Battle Page
 * Shows how many rounds you have prepared. In each round, can assign combo.
 * Has a little helper to show what's in the combo.
 * @returns jsx
 */
export default function RenderBattlePage() {
  //------------------------------state---------------------------------
  const [lsCombos, setLsCombos] = useState<ComboDictionary | null>(null)
  const [{ hideUsedCombos, roundName }, setAdvancedOptions] = useState<{
    hideUsedCombos: boolean
    roundName: string
  }>({ hideUsedCombos: true, roundName: 'Round' })
  const [openEdit, setOpenEdit] = useState<{ [key: number]: true }>()
  const [openInfo, setOpenInfo] = useState<{ [key: ComboId]: true }>()
  const [usedComboIds, setUsedComboIds] = useState<Set<ComboId>>()
  const [notification, setNotification] = useState<null | {
    visible?: boolean
    message?: string
  }>(null)
  const [notes, setNotes] = useState<string>('')
  const [yourRounds, setYourRounds] = useState<Round[]>([
    {
      displayName: roundName + ' 1',
      rating: 1,
      combos: null,
      id: makeRoundId(),
    },
  ])
  const { register, handleSubmit, reset } = useForm<Inputs>()
  const getLsCombos = useZustandStore((state) => state.getLsCombos)
  const getLsBattle = useZustandStore((state) => state.getLsBattle)
  const setLsBattle = useZustandStore((state) => state.setLsBattle)

  //-----------------------------hooks-------------------------------

  //Updates usedComboIds
  useEffect(() => {
    if (!hideUsedCombos) return
    setUsedComboIds(
      new Set<ComboId>(
        yourRounds
          .map((round) => round.combos)
          .flat()
          .filter((a) => a !== '' && a !== null) as ComboId[],
      ),
    )
  }, [hideUsedCombos, yourRounds])

  //Show Notifcation for 2 seconds
  useEffect(() => {
    const fadeOutTimer = setTimeout(
      () => setNotification({ visible: false }),
      2000,
    )
    return () => clearTimeout(fadeOutTimer)
  }, [notification?.visible])

  //updates flows using localstorage
  useEffect(() => {
    setLsCombos(getLsCombos() || null)
  }, [getLsCombos])

  //onMount get data from localstorage
  useEffect(() => {
    const data = getLsBattle()
    if (!data) return

    setAdvancedOptions((prev) => ({ ...prev, roundName: data.categoryName }))
    setYourRounds(data.rounds)
    setNotes(data.notes)
  }, [getLsBattle])

  //-----------------------------render---------------------------------
  return (
    <main className="mt-20 w-full dark:bg-gray-900">
      {/* ------------title------------- */}
      <article className="mb-5 flex w-full flex-col text-center dark:text-gray-400">
        <h1 className="title-font mb-2 text-3xl font-medium sm:text-4xl dark:text-white">
          Battle
        </h1>
        <p className="mx-auto px-2 text-base leading-relaxed lg:w-2/3">
          {` Organise combos with categories. Whether that's round based, time based, or situation based.  `}
        </p>
      </article>
      {/* ---------render battle rounds ------------ */}
      <article className="flex flex-wrap pt-5">
        {yourRounds.map(({ id, displayName, combos, rating }, battleIndex) => {
          return (
            // --------------single battle round------------
            <article
              className="relative mb-5 flex h-full w-full flex-col overflow-hidden rounded-lg bg-gray-100 bg-opacity-75 p-1 px-3 pb-6 pt-2 dark:bg-gray-800 dark:bg-opacity-40"
              key={id}
            >
              <RenderDeleteButtonSVG
                className="size-4 self-end"
                onClick={(_) =>
                  setYourRounds((prevRounds) =>
                    prevRounds.filter((_, i) => i !== battleIndex),
                  )
                }
              />
              {/* --------------Round Title----------------- */}
              <section className="flex items-center">
                {
                  // display displayName by default
                  openEdit?.[battleIndex] || (
                    <>
                      <h2 className="bold text-xs dark:text-white">
                        {displayName}
                      </h2>
                      <RenderEditButton
                        onClick={() => {
                          setOpenEdit({ [battleIndex]: true })
                        }}
                        className="ml-1 size-2 fill-gray-600 dark:fill-gray-500"
                      />
                    </>
                  )
                }
                {
                  // if editing displayName
                  openEdit && openEdit[battleIndex] && (
                    <form
                      onSubmit={handleSubmit((data) => {
                        setOpenEdit({})
                        setYourRounds((prevRounds) =>
                          produce(prevRounds, (newRounds) => {
                            newRounds[battleIndex].displayName = data.tempText
                          }),
                        )
                        reset()
                      })}
                    >
                      <input
                        className="w-full rounded border border-gray-300 bg-gray-100 bg-opacity-50 px-3 py-1 text-base leading-8 text-gray-700 outline-none transition-colors duration-200 ease-in-out focus:border-indigo-500 focus:bg-transparent focus:ring-2 focus:ring-indigo-200 dark:border-gray-700 dark:bg-gray-800 dark:bg-opacity-40 dark:text-gray-100 dark:focus:ring-indigo-900"
                        type="text"
                        defaultValue={displayName}
                        {...register('tempText')}
                      />
                      <label>
                        <input type="submit" className="hidden" />
                        <RenderEditButton
                          type="submit"
                          className="ml-1 size-2 fill-gray-600 dark:fill-gray-500"
                        />
                      </label>
                    </form>
                  )
                }
              </section>
              {/* -------------- 5 brains ------------------ */}
              <article>
                <section className="mt-2 flex flex-row-reverse justify-end">
                  {Array.from(Array(5)).map((_, brainIndex) => {
                    const size = '8'
                    return (
                      <>
                        <input
                          onChange={(e) => {
                            setYourRounds((rounds) =>
                              produce(rounds, (newRounds) => {
                                newRounds[battleIndex].rating = Number(
                                  e.target.id,
                                )
                              }),
                            )
                          }}
                          checked={brainIndex === 5 - rating}
                          type="radio"
                          id={5 - brainIndex + ''}
                          className={`peer -ms-${size} size-${size} cursor-pointer appearance-none border-0 bg-transparent text-transparent checked:bg-none focus:bg-none focus:ring-0 focus:ring-offset-0`}
                        />
                        <label
                          className={` text-gray-300 peer-checked:text-pink-400`}
                        >
                          <RenderBrainSvg
                            className={`size-${size}`}
                            fill="currentcolor"
                          />
                        </label>
                      </>
                    )
                  })}
                </section>
                <label className="-mt-2 text-[9px]">Memorised</label>
              </article>

              <article className="title-font mb-1 text-[9px] font-medium text-black dark:text-white">
                {/* -----------show combos selected------------ */}
                <h2>Combo List</h2>
                {combos && combos.length > 0 ? (
                  combos.map((comboId, comboIndex) => {
                    return (
                      <article key={comboIndex}>
                        <section className="flex">
                          {/* ----------number-------- */}
                          <label>{comboIndex + 1}</label>
                          {/* ------select-------- */}
                          <select
                            value={comboId}
                            onChange={(e) =>
                              setYourRounds((prevRounds) =>
                                produce(prevRounds, (newRounds) => {
                                  if (!lsCombos) return
                                  const optionVal = e.target.value as
                                    | ComboId
                                    | ''
                                  if (newRounds[battleIndex].combos) {
                                    //TODO find a better solution than non-null assertion operator
                                    newRounds[battleIndex].combos![comboIndex] =
                                      optionVal
                                  } else {
                                    newRounds[battleIndex].combos = [optionVal]
                                  }
                                }),
                              )
                            }
                            className="w-full"
                          >
                            {/* -------------select options----------------- */}
                            <option value={''}>Choose Combo</option>
                            {lsCombos &&
                              Object.entries(lsCombos).map(
                                ([lsComboId, comboDetails], i) => {
                                  //FEATURE: Avoid setting duplicate combos
                                  if (
                                    hideUsedCombos &&
                                    comboId !== lsComboId && //always show the selected combo
                                    usedComboIds?.has(lsComboId as ComboId)
                                  ) {
                                    return null
                                  } else {
                                    return (
                                      <option value={lsComboId} key={i}>
                                        {comboDetails.displayName}
                                      </option>
                                    )
                                  }
                                },
                              )}
                          </select>
                          {/* ------Info------ */}
                          <section className="w-1/6">
                            {
                              //don't display info if user hasn't chosen a combo yet
                              comboId && (
                                <RenderInfoSVG
                                  onClick={(_) => {
                                    setOpenInfo({ [comboId as ComboId]: true })
                                  }}
                                  className="size-4 text-gray-600"
                                />
                              )
                            }
                            {
                              //user wants to view info
                              openInfo?.[comboId as ComboId] && (
                                <button onClick={() => setOpenInfo({})}>
                                  {/* -----translucent help window---- */}
                                  <section className="absolute left-0 top-0 h-full w-full content-center bg-gray-100 bg-opacity-75 dark:bg-gray-800 dark:bg-opacity-40">
                                    {lsCombos &&
                                      (() => {
                                        const { displayName, sequence } =
                                          lsCombos[comboId as ComboId] || {}
                                        return (
                                          //------title-----
                                          <section>
                                            <h3 className="text-xs">{`Combo Name: displayName`}</h3>
                                            {sequence &&
                                              sequence.map(
                                                ({ moves, type }, i) => {
                                                  //-------type--------
                                                  return (
                                                    <section
                                                      key={i}
                                                      className="mt-1"
                                                    >
                                                      <label className="bold">{`Sequence Type: ${type}`}</label>
                                                      {/* -------moves-------- */}
                                                      <ol>
                                                        {moves.map(
                                                          (move, i) => (
                                                            <li
                                                              key={i}
                                                            >{`${i + 1}. ${move}`}</li>
                                                          ),
                                                        )}
                                                      </ol>
                                                    </section>
                                                  )
                                                },
                                              )}
                                          </section>
                                        )
                                      })()}
                                  </section>
                                </button>
                              )
                            }
                          </section>
                          {/* --------end of info--------- */}
                          <section>
                            <RenderDeleteButtonSVG
                              className="size-4 self-end fill-slate-500 text-slate-600"
                              onClick={(_) =>
                                setYourRounds((prevRounds) =>
                                  produce(prevRounds, (newRounds) => {
                                    newRounds[battleIndex].combos?.splice(
                                      comboIndex,
                                      1,
                                    )
                                  }),
                                )
                              }
                            />
                          </section>
                        </section>
                      </article>
                    )
                  })
                ) : (
                  <p>{`No combos in ${roundName}`}</p>
                )}
                {/* {-------------------add new combo ---------------- */}
                <section className="mt-2 flex">
                  <label>Add New Combo</label>
                  <RenderAddButtonSVG
                    className="ml-1 size-2 fill-slate-500"
                    onClick={() =>
                      setYourRounds((prevRounds) =>
                        produce(prevRounds, (newRounds) => {
                          if (!lsCombos) return

                          const defaultComboId = Object.keys(
                            lsCombos,
                          )[0] as ComboId
                          //if combos exist
                          if (newRounds[battleIndex].combos) {
                            newRounds[battleIndex].combos?.push('')
                          } else {
                            newRounds[battleIndex].combos = ['']
                          }
                        }),
                      )
                    }
                  />
                </section>
              </article>
              {/* ------------------NOTES---------------- */}
              <article>
                <section className="flex flex-col">
                  <label className="text-[9px]">Notes</label>
                  <textarea
                    onChange={(e) => setNotes(e.target.value)}
                    className="w-full text-[8px] leading-relaxed"
                  >
                    {notes}
                  </textarea>
                </section>
              </article>
            </article>
            // --------------END OF SINGLE BATTLE ROUND------------
          )
        })}
      </article>
      {/* --------------------END OF ROUNDS------------------- */}
      <section className="mt-5 flex">
        <button
          className="flex items-center justify-center "
          onClick={() =>
            setYourRounds((prevRounds) =>
              produce(prevRounds, (newRounds) => {
                newRounds.push({
                  displayName: roundName + ' ' + (prevRounds.length + 1),
                  rating: 1,
                  combos: null,
                  id: makeRoundId(),
                })
              }),
            )
          }
        >
          <label className="text-[9px]">Add {roundName}</label>
          <RenderAddButtonSVG className="ml-1 size-2 fill-slate-500" />
        </button>
      </section>
      <article className="flex ">
        <section>
          <Notification
            visible={!!notification?.visible}
            message={notification?.message || ''}
          />
          <button
            onClick={(_) => {
              setLsBattle({
                categoryName: roundName,
                rounds: yourRounds,
                notes,
              })
              console.log('saved')
            }}
            className="mt-5 inline-flex rounded border-0
           bg-indigo-500 px-6 py-2 text-xs 
           text-white hover:bg-indigo-600 focus:outline-none"
          >
            SAVE
          </button>
        </section>
        <section className="px-5 py-2 text-xs">
          <h2 className="bold mb-2">Advanced Options</h2>
          <section>
            <label>hide used combos</label>
            <input
              checked={hideUsedCombos}
              onChange={() =>
                setAdvancedOptions((prev) => ({
                  ...prev,
                  hideUsedCombos: !hideUsedCombos,
                }))
              }
              type="checkbox"
            />
          </section>
          <section className="mt-5 ">
            <form
              onSubmit={handleSubmit((data) => {
                setAdvancedOptions((prev) => ({
                  ...prev,
                  roundName: data.categoryName,
                }))
                reset()
              })}
            >
              <label>Update Category Name</label>
              <input
                className="w-full rounded border border-gray-300 bg-gray-100 bg-opacity-50 px-3 py-1 text-base leading-8 text-gray-700 outline-none transition-colors duration-200 ease-in-out focus:border-indigo-500 focus:bg-transparent focus:ring-2 focus:ring-indigo-200 dark:border-gray-700 dark:bg-gray-800 dark:bg-opacity-40 dark:text-gray-100 dark:focus:ring-indigo-900"
                type="text"
                defaultValue={roundName}
                {...register('categoryName')}
              />
              <input type="submit" />
            </form>
          </section>
        </section>
      </article>
    </main>
  )
}
