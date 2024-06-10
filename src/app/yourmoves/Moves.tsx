import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { Notification } from '../_components/Notification'
import {
  GlobalStateProperties,
  lsToprock,
  lsUserMoves,
} from '../_utils/lsTypes'
import { isValidKey } from '../_utils/lsValidation'
import { useZustandStore } from '../_utils/zustandLocalStorage'

//---------------------------utils---------------------------------
const makeArray = (moveString: string): string[] =>
  moveString.split('\n').map((str) => str.trim())

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
  const [categories, setCategories] = useState<string[]>()

  const getLsUserMoves = useZustandStore((state) => state.getLsUserMoves)
  const setLsUserMovesByKey = useZustandStore(
    (state) => state.setLsUserMovesByKey,
  )
  const getLsUserMovesByKey = useZustandStore(
    (state) => state.getLsUserMovesByKey,
  )
  //key of category selected
  const [selectedKey, setSelectedKey] =
    useState<keyof GlobalStateProperties[typeof lsUserMoves]>(lsToprock)

  //category string with n\ from zustand global state
  const [lsMoves, setLsMoves] = useState<string>('')

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<Inputs>()

  //value of categoryMoves textarea
  const unsavedMoveList = watch('categoryMoves', '')
  //-----------------------------hooks------------------------------
  //sets categories
  useEffect(() => {
    setCategories(Object.keys(getLsUserMoves()))
  }, [getLsUserMoves])

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
    setLsMoves(makeString(getLsUserMovesByKey(selectedKey)))
    setSaveButtonActive(false)
  }, [getLsUserMovesByKey, selectedKey])

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
      setLsMoves(makeString(getLsUserMovesByKey(category)))
    }
  }

  return (
    <article className="body-font mx-auto text-gray-400 md:w-2/3 lg:w-1/2">
      <section className="container mx-auto flex flex-col flex-wrap items-center p-5 md:flex-row">
        <nav className="body-font flex flex-wrap items-center justify-center text-base text-gray-300 md:ml-4 md:mr-auto md:border-l md:py-1 md:pl-4 dark:md:border-gray-700">
          {
            //------category select------------
            categories &&
              categories.map((key) => {
                const selected = selectedKey === key
                return (
                  <label
                    key={key}
                    className={`mr-5  capitalize
                        dark:${selected && 'text-white'}
                        ${selected && `text-gray-900`}
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
            // setLsMoves(makeString(movesArr.sort()))
            return
          } else if (isValidKey(selectedKey)) {
            setLsUserMovesByKey(selectedKey, movesArr)
            setLsMoves(makeString(getLsUserMovesByKey(selectedKey)))
            setSaveText('Saved')
            setSaveButtonActive(false)
            setNotification({ message: 'Saved', visible: true })
          }
        })}
        className="relative -m-2 flex w-full flex-wrap p-2"
      >
        {/* --------------------text area form--------------------------- */}
        {/* ---------------loaded text------------------------ */}
        <label className="absolute ml-1 mt-5 text-[9px]">
          {`${hasLoaded ? selectedKey + ' loaded' : 'Not loaded'}`}
        </label>
        <h2 className="text-sm capitalize leading-7 text-gray-600 dark:text-gray-400">
          {`Your ${selectedKey ? selectedKey + 's' : 'moves'}`}
        </h2>
        {/* ---------------text area------------------------ */}
        <section className="flex max-w-xs space-x-4 p-4">
          {/* -----------------left textarea------------------- */}
          <textarea
            {...register('categoryMoves')}
            className="h-32 w-8/12 max-w-fit resize-none rounded border border-gray-300 bg-gray-100 bg-opacity-50 px-3 py-1 text-xs text-gray-700 outline-none transition-colors duration-200 ease-in-out focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-200 dark:border-gray-700 dark:bg-gray-800 dark:bg-opacity-40 dark:text-gray-100 dark:focus:bg-gray-900 dark:focus:ring-indigo-900"
          />
          {/* --------------------right json view-------------------- */}
          <pre className="h-32 w-4/12 max-w-28 overflow-y-auto rounded-lg bg-gray-100 p-4 text-[10px] text-xs">
            {JSON.stringify(unsavedMoveList.split(/\r\n|\r|\n/), null, 1)}
          </pre>
        </section>
        <p className="text-xs">
          {`above ${unsavedMoveList.split(/\r\n|\r|\n/).length} moves. Saved ${lsMoves.split(/\r\n|\r|\n/).length} moves. New move created each line. `}
        </p>
        <Notification
          visible={!!notification?.visible}
          message={notification?.message || ''}
        />
        {/* -------------Buttons-------------- */}
        <section className="mt-5 flex w-full justify-center">
          {/* ----------sort button------- */}
          <button
            className="flex items-center justify-center rounded border border-indigo-500 px-8 py-2 text-center text-indigo-500 
 "
            onClick={(e) => {
              //prevents form submit
              e.preventDefault()
              sortMovesInTextArea()
            }}
          >
            <label className="text-lg leading-none">Sort</label>
          </button>
          {/* -------------Save Button------------------ */}
          <button
            disabled={!saveButtonActive}
            type="submit"
            className="flex rounded border-0 bg-indigo-500 px-8 py-2 text-lg text-white 
  hover:bg-indigo-600 focus:outline-none disabled:opacity-50"
          >
            {saveText}
          </button>
        </section>
        <p className="text-[7px]">
          sort button cannot be undone. Sorts current moves in alphabetical
          order
        </p>
        {/* ---------end of buttons--------- */}
      </form>
      {/* ------------end of form----------- */}
    </article>
  )
}
