'use client'
//@format
import { produce } from 'immer'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { Notification } from '../_components/Notification'
import RenderThunder from '../_components/RenderChilli'
import {
  RenderAddButtonSVG,
  RenderBrainSvg,
  RenderEditButton,
  RenderInfoSVG,
  RenderRedXSVG,
} from '../_components/Svgs'
import { comboIdKey, extractComboIds } from '../_utils/lib'
import { makeRoundId } from '../_utils/lsGenerators'
import { ComboDictionary, ComboId, Round } from '../_utils/zustandTypes'
import { useZustandStore } from '../_utils/zustandLocalStorage'

const battleRankings = new Map([
  [1, 'I tried'],
  [2, 'memorised sequence'],
  [3, 'can do slow'],
  [4, 'can do fast'],
  [5, 'can dance while doing it'],
])

type Inputs = {
  tempText: string //displayName
  categoryName: string
}

const Counter: React.FC = () => {
  const [count, setCount] = useState(0)
  return (
    <section className="ml-1 flex items-center text-[9px]">
      <button
        className="flex h-fit items-center justify-center rounded border border-indigo-500
          p-0.5 text-center  text-indigo-500"
        onClick={() => setCount(count + 1)}
      >
        {count}
      </button>
      <button
        // className="px-4 py-2 text-white bg-red-500 rounded hover:bg-red-700"
        onClick={() => setCount(0)}
      >
        X
      </button>
    </section>
  )
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
  const [{ hideUsedCombos, roundName, show }, setAdvancedOptions] = useState<{
    show: boolean
    hideUsedCombos: boolean
    roundName: string
  }>({ hideUsedCombos: true, roundName: 'Round', show: false })
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
      id: makeRoundId(),
    },
  ])
  const { register, handleSubmit, reset } = useForm<Inputs>()
  const getLsCombos = useZustandStore((state) => state.getLsCombos)
  const getLsBattle = useZustandStore((state) => state.getLsBattle)
  const setLsBattle = useZustandStore((state) => state.setLsBattle)
  const router = useRouter()

  //-----------------------------hooks-------------------------------
  //Set usedComboIds
  useEffect(() => {
    if (!hideUsedCombos) return
    const everyComboIdUsed: Set<ComboId> = new Set(extractComboIds(yourRounds))
    setUsedComboIds(everyComboIdUsed)
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
      <hgroup className="mb-5 flex w-full flex-col text-center dark:text-gray-400">
        <h1 className="title-font mb-2 text-3xl font-medium sm:text-4xl dark:text-white">
          Battle
        </h1>
        <p className="mx-auto px-2 text-base leading-relaxed lg:w-2/3">
          {` Organise combos with categories. Whether that's round based, time based, or situation based.  `}
        </p>
      </hgroup>
      {/* ---------render battle rounds ------------ */}
      <article className="flex flex-wrap pt-5">
        {yourRounds.map(
          ({ id, displayName, rating: comboRating, comboList }, roundIndex) => {
            return (
              // --------------single battle round------------
              <article
                className="relative mb-5 flex h-full w-full flex-col overflow-hidden rounded-lg bg-gray-100 bg-opacity-75 p-1 px-3 pb-6 pt-2 dark:bg-gray-800 dark:bg-opacity-40"
                key={id}
              >
                <RenderRedXSVG
                  className="size-4 self-end"
                  onClick={(_) =>
                    setYourRounds((prevRounds) =>
                      prevRounds.filter((_, i) => i !== roundIndex),
                    )
                  }
                />
                {/* --------------Round Title----------------- */}
                <section className="flex items-center">
                  {
                    // display displayName by default
                    openEdit?.[roundIndex] || (
                      <>
                        <h2 className="bold text-xs dark:text-white">
                          {displayName}
                        </h2>
                        <RenderEditButton
                          onClick={() => {
                            setOpenEdit({ [roundIndex]: true })
                          }}
                          className="ml-1 size-2 fill-gray-600 dark:fill-gray-500"
                        />
                      </>
                    )
                  }
                  {
                    // if editing displayName
                    openEdit && openEdit[roundIndex] && (
                      <form
                        onSubmit={handleSubmit((data) => {
                          setOpenEdit({})
                          setYourRounds((prevRounds) =>
                            produce(prevRounds, (newRounds) => {
                              newRounds[roundIndex].displayName = data.tempText
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
                <article className="w-auto text-center">
                  <section className="mt-2 flex flex-row-reverse justify-end">
                    {Array.from(Array(5)).map((_, brainIndex) => {
                      return (
                        <article key={brainIndex}>
                          <span className="relative inline-block">
                            <input
                              onChange={(e) => {
                                setYourRounds((rounds) =>
                                  produce(rounds, (newRounds) => {
                                    newRounds[roundIndex].rating = Number(
                                      e.target.id,
                                    )
                                  }),
                                )
                              }}
                              checked={brainIndex === 5 - comboRating}
                              type="radio"
                              id={(5 - brainIndex).toString()}
                              className={`peer absolute inset-0 h-full w-full cursor-pointer appearance-none border-0
                bg-transparent text-transparent checked:bg-none focus:bg-none 
                focus:ring-0 focus:ring-offset-0`}
                            />
                            <label className="text-gray-300 peer-checked:text-pink-400">
                              <RenderBrainSvg
                                className="size-8"
                                fill="currentcolor"
                              />
                            </label>
                          </span>
                        </article>
                      )
                    })}
                  </section>
                  <p className="text-4xs">{battleRankings.get(comboRating)}</p>
                </article>

                {/* ===================COMBO LIST=========================== */}
                <article className="title-font mb-1 mt-2 text-3xs font-medium text-black dark:text-white">
                  <h2 className="text-xs">Combo List</h2>

                  {comboList &&
                    comboList.length > 0 &&
                    comboList.map(
                      ({ type, id: comboId, value }, comboIndex) => {
                        return (
                          // ----------------------SINGLE LIST-----------------------
                          <section
                            key={comboIndex}
                            className="mt-2 flex w-full items-center"
                          >
                            {/* ----------number-------- */}
                            <section>
                              <label>{comboIndex + 1}</label>
                            </section>
                            {/* -------COMBO SELECTION-------- */}
                            <article className="w-2/5">
                              {/* -----CUSTOM COMBO INPUT------- */}
                              {type === 'customCombo' && (
                                <section>
                                  <input
                                    className="ml-1 w-full rounded border border-gray-300 bg-gray-100 bg-opacity-50 px-1 text-gray-700 outline-none transition-colors duration-200 ease-in-out focus:border-indigo-500 focus:bg-transparent focus:ring-2 focus:ring-indigo-200 dark:border-gray-700 dark:bg-gray-800 dark:bg-opacity-40 dark:text-gray-100 dark:focus:ring-indigo-900"
                                    type="text"
                                    value={value}
                                    placeholder="Super Combo 9000"
                                    onChange={(e) => {
                                      setYourRounds((prevRound) =>
                                        produce(prevRound, (newRound) => {
                                          newRound[roundIndex].comboList![
                                            comboIndex
                                          ].value = e.target.value
                                        }),
                                      )
                                    }}
                                  />
                                </section>
                              )}
                              {/* ----------normal combo----------- */}
                              {type === 'combo' && (
                                <section>
                                  {/* ------select-------- */}
                                  <select
                                    className="ml-1 w-full rounded-md border dark:border-indigo-500 dark:bg-transparent dark:placeholder-gray-400 dark:placeholder-opacity-50"
                                    value={comboId}
                                    onChange={(e) =>
                                      setYourRounds((prevRounds) =>
                                        produce(prevRounds, (newRounds) => {
                                          if (!lsCombos) return
                                          const optionVal = e.target.value as
                                            | ComboId
                                            | ''

                                          if (optionVal === '') {
                                            newRounds[roundIndex].comboList![
                                              comboIndex
                                            ] = { type: 'combo' }
                                          } else {
                                            newRounds[roundIndex].comboList![
                                              comboIndex
                                            ] = { type: 'combo', id: optionVal }
                                          }
                                        }),
                                      )
                                    }
                                  >
                                    {/* -------------select options----------------- */}
                                    <option value={''}>Choose Combo</option>
                                    {lsCombos &&
                                      Object.entries(lsCombos).map(
                                        ([lsComboId, comboDetails], i) => {
                                          if (
                                            hideUsedCombos &&
                                            comboId !== lsComboId &&
                                            usedComboIds?.has(
                                              lsComboId as ComboId,
                                            )
                                          ) {
                                            return null
                                          } else {
                                            return (
                                              <option
                                                className="dark:text-white"
                                                value={lsComboId}
                                                key={i}
                                              >
                                                {comboDetails?.displayName}
                                              </option>
                                            )
                                          }
                                        },
                                      )}
                                  </select>
                                </section>
                              )}
                              {/* // -------END OF NORMAL COMBO------------ */}
                            </article>
                            {/* -------END OF COMBO SELECTION-------- */}

                            {/* ------Info Button------ */}
                            <section className="ml-1 size-3">
                              {
                                //don't display info if user hasn't chosen a combo yet
                                comboId && (
                                  <RenderInfoSVG
                                    onClick={(_) => {
                                      setOpenInfo({
                                        [comboId as ComboId]: true,
                                      })
                                    }}
                                    className="size-3 text-gray-600"
                                  />
                                )
                              }
                              {
                                //user wants to view info
                                openInfo?.[comboId as ComboId] && (
                                  <button onClick={() => setOpenInfo({})}>
                                    {/* -----translucent help window---- */}
                                    <section className="absolute left-0 top-0 h-full w-full content-center bg-gray-100 bg-opacity-75 dark:bg-gray-800 dark:bg-opacity-90">
                                      {lsCombos &&
                                        (() => {
                                          const { displayName, sequence } =
                                            lsCombos[comboId as ComboId] || {}
                                          return (
                                            //------title-----
                                            <section>
                                              <h3 className="text-xs">{`Combo Name: ${displayName}`}</h3>
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
                            {/* -------------DELETE------------ */}
                            <section className="ml-1">
                              <RenderRedXSVG
                                className="size-4 self-end fill-slate-500 text-slate-600"
                                onClick={(_) =>
                                  setYourRounds((prevRounds) =>
                                    produce(prevRounds, (newRounds) => {
                                      newRounds[roundIndex].comboList?.splice(
                                        comboIndex,
                                        1,
                                      )
                                    }),
                                  )
                                }
                              />
                            </section>
                            {/* ---------EXECUTION------------ */}
                            <section>
                              {/* display the execution for each comboID */}
                              {comboId &&
                                lsCombos &&
                                lsCombos[comboId as ComboId] && (
                                  <article className="flex flex-row-reverse place-content-center pt-1">
                                    {Array.from(Array(5)).map((_, i) => {
                                      const combo = lsCombos[comboId as ComboId]
                                      if (!combo) return null
                                      const { execution } = combo
                                      return (
                                        <RenderThunder
                                          id={5 - i + ''}
                                          checked={i === 5 - execution}
                                          onChange={(e) => {
                                            //onclick setLsCombos
                                            // setRating(Number(e.target.id))
                                          }}
                                          color="peer-checked:text-indigo-500"
                                          key={i}
                                          size="size-3"
                                        />
                                      )
                                    })}
                                  </article>
                                )}
                            </section>
                            {/* ---------END OF EXECUTION------------ */}
                            {/* ---------EDIT COMBO------------ */}
                            <section>
                              {comboId && (
                                <button
                                  onClick={(_) => {
                                    console.log('move user to edit combo page')
                                    router.push(
                                      `/combos/make?${comboIdKey}=${comboId}`,
                                    )
                                  }}
                                  className="ml-1 inline-flex h-fit rounded border-0 
                                bg-indigo-500 p-0.5 text-[7px] 
                                text-white hover:bg-indigo-600 focus:outline-none"
                                >
                                  EDIT COMBO
                                </button>
                              )}
                            </section>
                            {/* --------COUNTER------- */}
                            <section>
                              <Counter />
                            </section>
                            {/* --------END OF COUNTER------- */}
                          </section>
                        )
                      },
                    )}
                </article>
                {/* -------------------END OF COMBO LIST------------------- */}

                {/* --------------add new entry------------ */}
                <article className="flex text-[9px]">
                  {/* {-------------------add new combo ---------------- */}
                  <section className="flex items-center ">
                    <label>Add Combo</label>
                    <RenderAddButtonSVG
                      className="ml-1 size-2 fill-slate-500"
                      onClick={() =>
                        setYourRounds((prevRounds) =>
                          produce(prevRounds, (newRounds) => {
                            if (newRounds[roundIndex].comboList) {
                              newRounds[roundIndex].comboList?.push({
                                type: 'combo',
                              })
                            } else {
                              newRounds[roundIndex].comboList = [
                                { type: 'combo' },
                              ]
                            }
                          }),
                        )
                      }
                    />
                  </section>
                  {/* ------------------add custom-------------------- */}
                  <section className="ml-3 flex items-center">
                    <label>Add Custom</label>
                    <RenderAddButtonSVG
                      className="ml-1 size-2 fill-slate-500"
                      onClick={() =>
                        //add customCombo to rounds
                        setYourRounds((prevRounds) =>
                          produce(prevRounds, (newRounds) => {
                            const comboListRef = newRounds[roundIndex]
                            comboListRef.comboList =
                              comboListRef.comboList ?? []
                            comboListRef.comboList.push({
                              type: 'customCombo',
                              value: '',
                            })
                          }),
                        )
                      }
                    />
                  </section>
                </article>
                {/* ------------------NOTES---------------- */}
                <article className="mt-1">
                  <section className="flex flex-col">
                    <label className="text-[9px]">Notes</label>
                    <textarea
                      onChange={(e) => setNotes(e.target.value)}
                      className="w-full rounded border border-gray-300 bg-gray-100 bg-opacity-50 px-3 py-1 text-[8px] text-xs leading-snug text-gray-700 outline-none transition-colors duration-200 ease-in-out focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-200 dark:border-gray-700 dark:bg-gray-800 dark:bg-opacity-40 dark:text-gray-100 dark:focus:bg-gray-900 dark:focus:ring-indigo-900"
                      value={notes}
                    />
                  </section>
                </article>
              </article>
              // --------------END OF SINGLE BATTLE ROUND------------
            )
          },
        )}
      </article>
      {/* --------------------END OF ROUNDS------------------- */}
      <Notification
        visible={!!notification?.visible}
        message={notification?.message || ''}
      />
      {/* ------------------BUTTONS--------------- */}
      <section className="flex justify-center">
        {/* -----------ADD ROUND------------- */}
        <button
          className="flex h-fit items-center justify-center rounded border border-indigo-500 px-3 py-2 text-center text-xs text-indigo-500 "
          onClick={() =>
            setYourRounds((prevRounds) =>
              produce(prevRounds, (newRounds) => {
                newRounds.push({
                  displayName: roundName + ' ' + (prevRounds.length + 1),
                  rating: 1,
                  // combos: null,
                  id: makeRoundId(),
                })
              }),
            )
          }
        >
          <label className="text-xs leading-none">Add {roundName}</label>
          <RenderAddButtonSVG className="ml-1 size-2 fill-slate-500" />
        </button>
        {/* --------------save--------------- */}
        <section>
          <button
            onClick={(_) => {
              setLsBattle({
                categoryName: roundName,
                rounds: yourRounds,
                notes,
              })
              setNotification({ visible: true, message: 'Battle Saved' })
              console.log('saved')
            }}
            className="inline-flex h-fit rounded border-0 bg-indigo-500 px-6 py-2 text-xs text-white hover:bg-indigo-600 focus:outline-none"
          >
            SAVE
          </button>
        </section>
      </section>
      {/* -----------ADVANCED OPTIONS---------- */}
      <article className="flex ">
        <section className="px-5 py-2 text-xs">
          <h2 className="bold mb-2">Advanced Options</h2>
          <button
            onClick={() =>
              setAdvancedOptions((prev) => ({ ...prev, show: !prev.show }))
            }
            className="text-[7px] text-indigo-500"
          >
            Show/Hide
          </button>
          {show && (
            <article>
              {/* ---------hide used combos--------- */}
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
              {/* ---------update category name--------- */}
              <section className="mt-5 bg-slate-100">
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
                    className="w-full rounded border 
                border-gray-300 bg-gray-100 
                bg-opacity-50 px-1 
                py-0.5 text-xs leading-none 
                text-gray-700 outline-none 
                transition-colors duration-200 
                ease-in-out focus:border-indigo-500 
                focus:bg-transparent focus:ring-2 focus:ring-indigo-200 dark:border-gray-700 dark:bg-gray-800 dark:bg-opacity-40 dark:text-gray-100 dark:focus:ring-indigo-900"
                    type="text"
                    defaultValue={roundName}
                    {...register('categoryName')}
                  />
                  <input
                    value={'update'}
                    type="submit"
                    className=" rounded-lg bg-indigo-500 text-[8px] text-white"
                  />
                </form>
              </section>
            </article>
          )}
        </section>
      </article>
    </main>
  )
}
