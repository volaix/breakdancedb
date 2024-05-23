'use client'
//@format
import RenderHeader from '@/app/_components/Header'
import { useState, useEffect, MouseEventHandler } from 'react'
import { useZustandStore } from '../_utils/zustandLocalStorage'
import { isValidUserMoveKey } from '../_utils/lsValidation'
import {
  lsFootwork,
  lsPower,
  lsFreezes,
  lsFloorwork,
  lsSuicides,
  lsDrops,
  lsTransitions,
  lsBlowups,
  lsMisc,
  lsToprock,
} from '../_utils/localStorageTypes'
import { useForm, SubmitHandler } from 'react-hook-form'

//---------------------------utils---------------------------------
const convertMoveString = (moveString: string): string[] => {
  return moveString.split('\n')
}
const convertMoveArray = (moveArray: string[]): string => {
  return moveArray.join('\r\n')
}

//---------------------------types---------------------------------
type TypeBreakCategories = {
  [lsToprock]?: boolean
  [lsFootwork]?: boolean
  [lsPower]?: boolean
  [lsFreezes]?: boolean
  [lsFloorwork]?: boolean
  [lsSuicides]?: boolean
  [lsDrops]?: boolean
  [lsTransitions]?: boolean
  [lsBlowups]?: boolean
  [lsMisc]?: boolean
}

type Inputs = {
  categoryMoves: string
  firstName: string
}

//----------------------components-----------------------------

const categories: { label: string; key: keyof TypeBreakCategories }[] = [
  { label: 'Toprocks', key: lsToprock },
  { label: 'Footwork', key: lsFootwork },
  { label: 'Power', key: lsPower },
  { label: 'Freezes', key: lsFreezes },
  { label: 'Floorwork', key: lsFloorwork },
  { label: 'Suicides', key: lsSuicides },
  { label: 'Drops', key: lsDrops },
  { label: 'Transitions', key: lsTransitions },
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
  const [saveText, setSaveText] = useState('Save')
  const [selectedKey, setSelectedKey] = useState<TypeBreakCategories>({
    [lsToprock]: true,
  })
  //todo refactor this component so selectedKeyString doesn't have to exist
  const [selectedKeyString, setSelectedKeyString] =
    useState<keyof TypeBreakCategories>(lsToprock)
  const [selectedMoves, setSelectedMoves] = useState<string>('')
  const setLsUserMovesByKey = useZustandStore(
    (state) => state.setLsUserMovesByKey,
  )
  const getLsUserMovesByKey = useZustandStore(
    (state) => state.getLsUserMovesByKey,
  )
  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<Inputs>()
  //-----------------------------hooks------------------------------

  //Populate Existing Moves
  useEffect(() => {
    console.log('the selectedkeystring should be running')
    //Defaults key to toprock
    let userMoveKey: keyof TypeBreakCategories = lsToprock
    console.log('userMoveKey: 1', userMoveKey);
    //reassign usermovekey using selected
    for (const key in selectedKey) {
      if (selectedKey[key as keyof TypeBreakCategories]) {
        userMoveKey = key as keyof TypeBreakCategories
      }
    }
    console.log('userMoveKey: 2', userMoveKey);
    setSelectedKeyString(userMoveKey)
    reset({
      categoryMoves: convertMoveArray(getLsUserMovesByKey(userMoveKey)),
    })
  }, [selectedKey, reset, getLsUserMovesByKey])

  //Populate existing moves
  // useEffect(() => {
  //   setUserMoves(convertMoveArray(getLsUserMoves()))
  // }, [accessToLocalStorage, getLsUserMoves])

  //---------------------------handlers-----------------------------
  // const onClickSave = () => {
  //   setLsUserMoves(convertMoveString(userMoves) as string[])
  //   setSaveText('Saved')
  // }

  const handleChangeCategory = (category: keyof TypeBreakCategories) => {
    console.log('category: ', category);
    console.log('has been clicked')
    // return () => {
    //   console.log('')
      setSelectedKey({ [category]: true })
    // }
  }

  //
  const onSaveCategory: SubmitHandler<Inputs> = (data) => {
    console.log('onsavecategory running')
    //save in global state depending on what is selected
    if (selectedKey) {
      const movesArr = convertMoveString(data.categoryMoves)
      if (isValidUserMoveKey(selectedKeyString)) {
        setLsUserMovesByKey(selectedKeyString, movesArr)
      }
    }
  }

  //-------------------------render---------------------------------
  return (
    //--------------------------container--------------------------
    <div>
      <section className=" body-font relative text-gray-600 dark:text-gray-600 ">
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
                <nav className=" body-font flex flex-wrap items-center justify-center text-base text-gray-300 md:ml-4 md:mr-auto md:border-l md:py-1 md:pl-4 dark:md:border-gray-700">
                  {/* <div className='flex flex-col'> */}
                    {
                      //------category select------------
                      categories.map((category) => (
                        <label
                          key={category.key}
                          className="mr-5 hover:text-gray-900 dark:hover:text-white"
                        >
                          <input
                            type="radio"
                            className="hidden"
                            name="categories"
                            value={category.label}
                            checked={selectedKeyString === category.key}
                            onChange={() => handleChangeCategory(category.key)}
                          />
                          {category.label}
                        </label>
                      ))
                    }
                  {/* </div> */}
                </nav>
                {/* ---------------selected button------------------------ */}
                <button className="mt-4 inline-flex items-center rounded border-0 bg-gray-800 px-3 py-1 text-base hover:bg-gray-700 focus:outline-none md:mt-0">
                  {`${selectedKey ? Object.keys(selectedKey)[0] + ' selected' : 'none selected'}`}
                </button>
              </div>
              {/* --------------------text area form--------------------------- */}
              <form
                onSubmit={handleSubmit(onSaveCategory)}
                className="-m-2 flex flex-wrap"
              >
                <div className="w-full p-2">
                  <div className="relative">
                    <label className="text-sm capitalize leading-7 text-gray-600 dark:text-gray-400">
                      {`Your ${selectedKey ? Object.keys(selectedKey)[0] + 's' : 'moves'}`}
                    </label>
                    <div className="flex max-w-xs space-x-4 p-4">
                      <textarea
                        {...register('categoryMoves')}
                        className="h-32 w-full resize-none rounded border border-gray-300 bg-gray-100 bg-opacity-50 px-3 py-1 text-xs text-gray-700 outline-none transition-colors duration-200 ease-in-out focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-200 dark:border-gray-700 dark:bg-gray-800 dark:bg-opacity-40 dark:text-gray-100 dark:focus:bg-gray-900 dark:focus:ring-indigo-900"
                      />
                      <pre className="w-1/2 overflow-hidden	 rounded-lg bg-gray-100 p-4 text-xs">
                        {JSON.stringify(['movea', 'moveb'], null, 2)}
                      </pre>
                    </div>
                    <div className="text-xs">
                      {convertMoveString(selectedMoves).length + 1} moves. New
                      move created each line.
                    </div>
                  </div>
                </div>
                <div className="flex w-full p-2">
                  <button
                    type="submit"
                    className="mx-auto flex rounded border-0 bg-indigo-500 px-8 py-2 text-lg text-white hover:bg-indigo-600 focus:outline-none"
                  >
                    {saveText}
                  </button>
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
