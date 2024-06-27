import { FormEvent, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { Notification } from '../_components/Notification'
import { GlobalStateProperties, lsUserMoves } from '../_utils/lsTypes'
import { isValidKey } from '../_utils/lsValidation'
import { useZustandStore } from '../_utils/zustandLocalStorage'
import {
  RenderAddButtonSVG,
  RenderDeleteButtonSVG,
  RenderTrashButtonSvg,
} from '../_components/Svgs'

const splitParam = /\r\n|\r|\n/

//---------------------------utils---------------------------------
const makeArray = (moveString: string): string[] =>
  moveString
    .split(splitParam)
    .map((str) => str.trim())
    .filter((str) => str.length > 0)

const makeString = (moveArray: string[]): string => moveArray.join('\r\n')

const hasDuplicates = (array: string[]): boolean => {
  const uniqueItems = new Set(array)
  return uniqueItems.size !== array.length
}

//---------------------------types---------------------------------

type Inputs = {
  categoryMoves: string
}

export default function Moves() {
  //-----------------------------state---------------------------
  const [saveText, setSaveText] = useState('Save')
  const [hasLoaded, setHasLoaded] = useState<boolean>(false)
  const [saveButtonActive, setSaveButtonActive] = useState<boolean>(false)
  const [notification, setNotification] = useState<null | {
    visible?: boolean
    message?: string
    timeShown?: number
  }>(null)
  const [categories, setCategories] = useState<string[] | null>(null)
  const [showInput, setInput] = useState<{ [key: string]: boolean }>()

  const getUserMoves = useZustandStore((state) => state.getLsUserMoves)
  const setCategoryValue = useZustandStore((state) => state.setLsUserMovesByKey)
  const getCategoryValueByKey = useZustandStore(
    (state) => state.getLsUserMovesByKey,
  )
  const deleteCategory = useZustandStore((state) => state.deleteUserMovesByKey)
  //key of category selected
  const [selectedKey, setSelectedKey] =
    useState<keyof GlobalStateProperties[typeof lsUserMoves]>()

  //category string with n\ from zustand global state
  const [lsMoves, setLsMoves] = useState<string>('')

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<Inputs>()

  const {
    register: registerNewCategory,
    handleSubmit: submitNewCategory,
    reset: resetNewCategory,
  } = useForm<{ newCategory: string }>()

  //value of categoryMoves textarea
  const unsavedMoveList = watch('categoryMoves', '')
  //-----------------------------hooks------------------------------
  //sets categories
  useEffect(() => {
    setCategories(Object.keys(getUserMoves()))
  }, [getUserMoves])

  //Show Notifcation for 2 seconds
  useEffect(() => {
    const fadeOutTimer = setTimeout(
      () => setNotification({ visible: false }),
      notification?.timeShown || 2000,
    )
    return () => clearTimeout(fadeOutTimer)
  }, [notification?.timeShown, notification?.visible])

  //Populate existing moves to textarea: categoryMoves
  useEffect(() => {
    reset({
      categoryMoves: lsMoves,
    })
    setHasLoaded(true)
    setSaveButtonActive(false)
  }, [lsMoves, reset, setHasLoaded])

  //onload get moves from global state
  useEffect(() => {
    if (selectedKey) {
      setLsMoves(makeString(getCategoryValueByKey(selectedKey)))
      setSaveButtonActive(false)
    } else {
      setSelectedKey(categories?.[0])
    }
  }, [categories, getCategoryValueByKey, selectedKey])

  //if textarea has changed, enable save button
  useEffect(() => {
    if (unsavedMoveList !== lsMoves) {
      setSaveButtonActive(true)
    } else {
      setSaveButtonActive(false)
    }
  }, [lsMoves, unsavedMoveList])

  //----------------functions----------
  const sortMovesInTextArea = () => {
    setLsMoves(makeString(makeArray(unsavedMoveList).sort()))
    setSaveButtonActive(true)
  }

  //---------------------------handlers-----------------------------

  const handleChangeCategory = (
    category: keyof GlobalStateProperties[typeof lsUserMoves],
  ) => {
    if (saveButtonActive) {
      alert('save before changing categories')
    } else {
      setSelectedKey(category)
      setLsMoves(makeString(getCategoryValueByKey(category)))
    }
  }

  return (
    <article className="body-font mx-auto text-gray-400 md:w-2/3 lg:w-1/2">
      <section className="container mx-auto flex flex-col flex-wrap items-center justify-center p-5 md:flex-row">
        <nav className="body-font flex flex-wrap items-center justify-center text-base text-gray-300 dark:md:border-gray-700">
          {
            //------category select------------
            categories &&
              categories.map((key, categoryIndex) => {
                const selected = selectedKey === key
                return (
                  <article
                    key={key}
                    className={`mr-5 flex dark:${selected && 'text-white'} ${selected && `text-gray-900`}`}
                  >
                    <label
                      className={`mr-1 capitalize
                        `}
                    >
                      <input
                        type="radio"
                        className="hidden"
                        name="categories"
                        value={key}
                        checked={selected}
                        onChange={() => handleChangeCategory(key)}
                      />
                      {key}
                    </label>
                    {selected && !showInput?.[key] && (
                      <section className="flex items-center">
                        <RenderAddButtonSVG
                          onClick={() => {
                            setInput({ [key]: true })
                            resetNewCategory({ newCategory: '' })
                          }}
                          className={`  ${selected ? ' fill-gray-900 dark:fill-white' : 'fill-gray-300'}  mr-0.5 size-2`}
                        />
                        <RenderTrashButtonSvg
                          onClick={() => {
                            if (categories.length > 1) {
                              deleteCategory(key)
                              setSelectedKey(categories?.[categoryIndex - 1])
                              setCategories(Object.keys(getUserMoves()))
                            }
                          }}
                          className="size-2"
                        />
                      </section>
                    )}
                    {showInput?.[key] &&
                      (() => {
                        const onSubmit = (newCategory: string) => {
                          setCategoryValue(newCategory, [])
                          setInput({ [key]: false })
                          setCategories(Object.keys(getUserMoves()))
                        }

                        return (
                          <form
                            className="flex items-center"
                            onSubmit={submitNewCategory(({ newCategory }) => {
                              onSubmit(newCategory)
                            })}
                          >
                            <input
                              autoFocus
                              className="ml-1 w-full rounded border border-gray-300 bg-gray-100 bg-opacity-50 px-1 text-gray-700 outline-none transition-colors duration-200 ease-in-out focus:border-indigo-500 focus:bg-transparent focus:ring-2 focus:ring-indigo-200 dark:border-gray-700 dark:bg-gray-800 dark:bg-opacity-40 dark:text-gray-100 dark:focus:ring-indigo-900"
                              type="text"
                              placeholder="New Category"
                              {...registerNewCategory('newCategory', {
                                required: true,
                              })}
                            />
                            <section className="flex items-center">
                              <RenderAddButtonSVG
                                onClick={submitNewCategory(
                                  ({ newCategory }) => {
                                    onSubmit(newCategory)
                                  },
                                )}
                                className={`ml-1 size-3 fill-indigo-500`}
                              />
                              <RenderDeleteButtonSVG
                                onClick={() => {
                                  setInput({ [key]: false })
                                }}
                                className="size-6"
                              />
                            </section>
                          </form>
                        )
                      })()}
                  </article>
                )
              })
          }
        </nav>
      </section>
      {/* ------------form----------- */}
      <form
        onSubmit={handleSubmit((data) => {
          const movesArr = makeArray(data.categoryMoves)
          if (hasDuplicates(movesArr)) {
            setSaveButtonActive(false)
            setNotification({
              message: 'ERROR: DUPLICATE MOVES.',
              visible: true,
            })
            sortMovesInTextArea()
            return
          } else if (
            selectedKey &&
            categories &&
            isValidKey(selectedKey, categories)
          ) {
            setCategoryValue(selectedKey, movesArr)
            setLsMoves(makeString(getCategoryValueByKey(selectedKey)))
            setSaveText('Saved')
            setSaveButtonActive(false)
            setNotification({ message: 'Saved', visible: true })
          }
        })}
        className="relative flex w-full flex-col py-2 md:p-2"
      >
        {/* --------------------text area form--------------------------- */}
        {/* ---------------loaded text------------------------ */}
        <h2 className="text-sm capitalize leading-7 text-gray-600 dark:text-gray-400">
          {`Your ${selectedKey ? selectedKey + 's' : 'moves'}`}
        </h2>
        <label className="absolute ml-1 mt-5 text-[9px]">
          {`${hasLoaded ? selectedKey + ' loaded' : 'Not loaded'}`}
        </label>
        {/* ---------------text area------------------------ */}
        <section className="flex max-w-full space-x-4 py-4 md:p-4">
          {/* -----------------left textarea------------------- */}
          <textarea
            {...register('categoryMoves')}
            className="h-32 w-8/12 max-w-fit resize-none rounded border border-gray-300 bg-gray-100 bg-opacity-50 px-3 py-1 text-xs text-gray-700 outline-none transition-colors duration-200 ease-in-out focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-200 md:w-1/2 md:max-w-full dark:border-gray-700 dark:bg-gray-800 dark:bg-opacity-40 dark:text-gray-100 dark:focus:bg-gray-900 dark:focus:ring-indigo-900"
          />
          {/* --------------------right json view-------------------- */}
          <pre className="h-32 w-4/12 max-w-28 overflow-y-auto rounded-lg bg-gray-100 px-2 py-1 text-2xs md:w-1/2 md:max-w-full">
            {JSON.stringify(makeArray(unsavedMoveList), null, 1)}
          </pre>
        </section>
        <p className="text-xs md:text-center">
          {`above ${makeArray(unsavedMoveList).length} moves. Saved ${makeArray(lsMoves).length} moves. New move created each line. `}
        </p>
        <Notification
          visible={!!notification?.visible}
          message={notification?.message || ''}
        />
        {/* -------------Buttons-------------- */}
        <section className="mt-5 flex w-full justify-center">
          {/* ----------sort button------- */}
          <button
            className="flex items-center justify-center rounded border border-indigo-500 px-8 py-2 text-center text-indigo-500 "
            onClick={(e) => {
              //prevents form submit
              e.preventDefault()
              sortMovesInTextArea()
              setSaveButtonActive(true)
            }}
          >
            <label className="text-lg leading-none">Sort</label>
          </button>
          {/* -------------Save Button------------------ */}
          <button
            disabled={!saveButtonActive}
            type="submit"
            className="flex rounded border-0 bg-indigo-500 px-8 py-2 text-lg text-white hover:bg-indigo-600 focus:outline-none disabled:opacity-50"
          >
            {saveText}
          </button>
        </section>
        <p className="text-4xs md:my-4 md:text-center ">
          sort button cannot be undone. Sorts current moves in alphabetical
          order
        </p>
        {/* ---------end of buttons--------- */}
      </form>
      {/* ------------end of form----------- */}
    </article>
  )
}
