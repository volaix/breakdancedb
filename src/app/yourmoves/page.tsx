'use client'
//@format
import RenderHeader from '@/app/_components/Header'
import { useEffect, useState } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import {
  GlobalStateProperties,
  lsBlowups,
  lsDrops,
  lsFloorwork,
  lsFootwork,
  lsFreezes,
  lsMisc,
  lsPower,
  lsSuicides,
  lsToprock,
  lsUserMoves,
} from '../_utils/localStorageTypes'
import { isValidUserMoveKey } from '../_utils/lsValidation'
import { useZustandStore } from '../_utils/zustandLocalStorage'

//---------------------------utils---------------------------------
const convertMoveString = (moveString: string): string[] => {
  return moveString.split('\n')
}
const convertMoveArray = (moveArray: string[]): string => {
  return moveArray.join('\r\n')
}

//---------------------------types---------------------------------

type Inputs = {
  categoryMoves: string
}

//----------------------components-----------------------------

const categories: {
  label: string
  key: keyof GlobalStateProperties[typeof lsUserMoves]
}[] = [
  { label: 'Toprocks', key: lsToprock },
  { label: 'Footwork', key: lsFootwork },
  { label: 'Power', key: lsPower },
  { label: 'Freezes', key: lsFreezes },
  { label: 'Floorwork', key: lsFloorwork },
  { label: 'Suicides', key: lsSuicides },
  { label: 'Drops', key: lsDrops },
  { label: 'Blow Ups', key: lsBlowups },
  { label: 'Misc', key: lsMisc },
]
/**
 * Component that allows user to put in their moves into the database
 * one line per move in a text file.
 * @returns jsx
 */
const RenderYourMoves = () => {
  //-----------------------------state---------------------------
  //text displays
  const [saveText, setSaveText] = useState('Save')
  const [hasLoaded, setHasLoaded] = useState<boolean>(false)
  const [saveButtonActive, setSaveButtonActive] = useState<boolean>(false)
  //

  //key of category selected
  const [selectedKey, setSelectedKey] =
    useState<keyof GlobalStateProperties[typeof lsUserMoves]>(lsToprock)

  //category string with n\ from zustand global state
  const [movesFromGlobalState, setMovesFromGlobalState] = useState<string>('')

  //Set new moves in Global State
  const setLsUserMovesByKey = useZustandStore(
    (state) => state.setLsUserMovesByKey,
  )

  //gets moves in global state
  const getLsUserMovesByKey = useZustandStore(
    (state) => state.getLsUserMovesByKey,
  )

  //react-hook-form
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

  //Populate existing moves to textarea: categoryMoves
  useEffect(() => {
    reset({
      categoryMoves: movesFromGlobalState,
    })
    setHasLoaded(true)
    setSaveButtonActive(false)
  }, [movesFromGlobalState, reset, setHasLoaded])

  //onload get moves from global state
  useEffect(() => {
    setMovesFromGlobalState(convertMoveArray(getLsUserMovesByKey(selectedKey)))
    setSaveButtonActive(false)
  }, [getLsUserMovesByKey, selectedKey])

  //if textarea has changed, enable save button
  useEffect(() => {
    if (unsavedMoveList !== movesFromGlobalState) {
      setSaveButtonActive(true)
    } else {
      setSaveButtonActive(false)
    }
  }, [movesFromGlobalState, unsavedMoveList])

  //---------------------------handlers-----------------------------

  const handleChangeCategory = (
    category: keyof GlobalStateProperties[typeof lsUserMoves],
  ) => {
    setSelectedKey(category)
    setMovesFromGlobalState(convertMoveArray(getLsUserMovesByKey(category)))
  }

  const onSaveCategory: SubmitHandler<Inputs> = (data) => {
    //save in global state depending on what is selected
    const movesArr = convertMoveString(data.categoryMoves)
    if (isValidUserMoveKey(selectedKey)) {
      setLsUserMovesByKey(selectedKey, movesArr)
      //does this need to be async?
      setMovesFromGlobalState(
        convertMoveArray(getLsUserMovesByKey(selectedKey)),
      )
      setSaveText('Saved')
      setSaveButtonActive(false)
    }
  }

  //-------------------------render---------------------------------
  return (
    //--------------------------container--------------------------
    <div>
      <section className="body-font relative text-gray-600 dark:text-gray-600">
        <div className="container mx-auto px-5 py-24">
          {/* -----------------header------------------- */}
          <div className="mb-6 flex w-full flex-col text-center">
            <h1 className="title-font mb-4 text-2xl font-medium text-gray-900 sm:text-3xl dark:text-white">
              Your Moves
            </h1>
            <p className="mx-auto text-base leading-relaxed lg:w-2/3 dark:text-gray-400">
              Add and view everything here. One per line.
            </p>
          </div>
          <div className="mx-auto md:w-2/3 lg:w-1/2">
            <div className="body-font text-gray-400">
              <div className="container mx-auto flex flex-col flex-wrap items-center p-5 md:flex-row">
                <nav className="body-font flex flex-wrap items-center justify-center text-base text-gray-300 md:ml-4 md:mr-auto md:border-l md:py-1 md:pl-4 dark:md:border-gray-700">
                  {
                    //------category select------------
                    categories.map((category) => {
                      const selected = selectedKey === category.key
                      return (
                        <label
                          key={category.key}
                          className={`mr-5 
                        dark:${selected && 'text-white'}
                        ${selected && `text-gray-900`}
                        `}
                        >
                          <input
                            type="radio"
                            className="hidden"
                            name="categories"
                            value={category.label}
                            checked={selected}
                            onChange={() => handleChangeCategory(category.key)}
                          />
                          {category.label}
                        </label>
                      )
                    })
                  }
                </nav>
              </div>
              <form
                onSubmit={handleSubmit(onSaveCategory)}
                className="-m-2 flex flex-wrap"
              >
                {/* --------------------text area form--------------------------- */}
                <div className="w-full p-2">
                  <div className="relative">
                    {/* ---------------loaded text------------------------ */}
                    <div className="absolute ml-1 mt-5 text-[9px]">
                      {`${hasLoaded ? selectedKey + ' loaded' : 'Not loaded'}`}
                    </div>
                    <label className="text-sm capitalize leading-7 text-gray-600 dark:text-gray-400">
                      {`Your ${selectedKey ? selectedKey + 's' : 'moves'}`}
                    </label>
                    <div className="flex max-w-xs space-x-4 p-4">
                      {/* -----------------left textarea------------------- */}
                      <textarea
                        {...register('categoryMoves')}
                        className="h-32 w-full resize-none rounded border border-gray-300 bg-gray-100 bg-opacity-50 px-3 py-1 text-xs text-gray-700 outline-none transition-colors duration-200 ease-in-out focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-200 dark:border-gray-700 dark:bg-gray-800 dark:bg-opacity-40 dark:text-gray-100 dark:focus:bg-gray-900 dark:focus:ring-indigo-900"
                      />
                      {/* --------------------right json view-------------------- */}
                      <pre className="h-32 w-1/2 overflow-y-auto rounded-lg bg-gray-100 p-4 text-[10px] text-xs">
                        {JSON.stringify(
                          unsavedMoveList.split(/\r\n|\r|\n/),
                          null,
                          1,
                        )}
                      </pre>
                    </div>
                    <div className="text-xs">
                      {`calculated ${unsavedMoveList.split(/\r\n|\r|\n/).length} moves from above. New move created each line. Saved is ${movesFromGlobalState.split(/\r\n|\r|\n/).length} moves.`}
                    </div>
                    {/* -------------Save Button------------------ */}
                    <button
                      disabled={!saveButtonActive}
                      type="submit"
                      className="mx-auto mt-5 flex rounded border-0 bg-indigo-500 px-8 py-2 text-lg text-white hover:bg-indigo-600 focus:outline-none disabled:opacity-50"
                    >
                      {saveText}
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
        {/* -------------------container--------------------- */}
      </section>
    </div>
  )
}
//----------------------------end of react component------------------------

/**
 * Renders the /yourmoves page.
 * @returns jsx
 */
export default function RenderPageYourMoves() {
  return (
    <div>
      <RenderHeader />
      <RenderYourMoves />
    </div>
  )
}
