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
/**
 * Component that allows user to put in their moves into the database
 * one line per move in a text file.
 * @returns jsx
 */
const RenderYourMoves = () => {
  //-----------------------------state---------------------------
  const [userMoves, setUserMoves] = useState<string>('')
  const [saveText, setSaveText] = useState('Save')
  const [selected, setSelected] = useState<TypeBreakCategories>({})
  const [textAreaDefault, setTextAreaDefault] = useState<string>('')
  const setLsUserMoves = useZustandStore((state) => state.setLsUserMoves)
  const getLsUserMoves = useZustandStore((state) => state.getLsUserMoves)
  const setLsUserMovesByKey = useZustandStore((state) => state.setLsUserMovesByKey)
  const getLsUserMovesByKey = useZustandStore((state) => state.getLsUserMovesByKey)


  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<Inputs>({
    defaultValues: {
      categoryMoves: textAreaDefault,
    },
  })
  //-----------------------------hooks------------------------------

  //Populate Existing Moves
  useEffect(() => {
    //Defaults key to toprock
    let userMoveKey: keyof TypeBreakCategories = lsToprock
    //reassign usermovekey using selected
    for (const key in selected) {
      if (selected[key as keyof TypeBreakCategories]) {
        userMoveKey = key as keyof TypeBreakCategories
      }
    }
    reset({
      categoryMoves: convertMoveArray(getLsUserMovesByKey(userMoveKey)),
    })
  }, [selected, reset, getLsUserMovesByKey])


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
    return () => {
      setSelected({ [category]: [category] })
    }
  }



  const onSaveCategory: SubmitHandler<Inputs> = (data) => {
    console.log('onsavecategory running')
    //save in global state depending on what is selected
    if (selected) {
      const selectedKey = convertMoveArray(Object.keys(selected).filter((a) => selected[(a as keyof TypeBreakCategories)]))
      const movesArr = convertMoveString(data.categoryMoves)
      if (isValidUserMoveKey(selectedKey)) {
        console.log('setting in global state, check app')
        console.log('selectedKey: ', selectedKey)
        console.log('movesArr: ', movesArr)
        setLsUserMovesByKey(selectedKey, movesArr)
      }
    }
  }

  //-------------------------render---------------------------------
  return (
    <div>
      <section className=" body-font relative text-gray-600 dark:text-gray-600 ">
        <div className="container mx-auto px-5 py-24">
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
                  <a
                    className="mr-5 hover:text-gray-900 dark:hover:text-white"
                    onClick={handleChangeCategory(lsToprock)}
                  >
                    Toprocks
                  </a>
                  <a
                    className="mr-5 hover:text-gray-900 dark:hover:text-white"
                    onClick={handleChangeCategory(lsFootwork)}
                  >
                    Footwork
                  </a>
                  <a
                    className="mr-5 hover:text-gray-900 dark:hover:text-white"
                    onClick={handleChangeCategory(lsPower)}
                  >
                    Power
                  </a>
                  <a
                    className="mr-5 hover:text-gray-900 dark:hover:text-white"
                    onClick={handleChangeCategory(lsFreezes)}
                  >
                    Freezes
                  </a>
                  <a
                    className="mr-5 hover:text-gray-900 dark:hover:text-white"
                    onClick={handleChangeCategory(lsFloorwork)}
                  >
                    Floorwork
                  </a>
                  <a
                    className="mr-5 hover:text-gray-900 dark:hover:text-white"
                    onClick={handleChangeCategory(lsSuicides)}
                  >
                    Suicides
                  </a>
                  <a
                    className="mr-5 hover:text-gray-900 dark:hover:text-white"
                    onClick={handleChangeCategory(lsDrops)}
                  >
                    Drops
                  </a>
                  <a
                    className="mr-5 hover:text-gray-900 dark:hover:text-white"
                    onClick={handleChangeCategory(lsTransitions)}
                  >
                    Transitions
                  </a>
                  <a
                    className="mr-5 hover:text-gray-900 dark:hover:text-white"
                    onClick={handleChangeCategory(lsBlowups)}
                  >
                    Blow Ups
                  </a>
                  <a
                    className="mr-5 hover:text-gray-900 dark:hover:text-white"
                    onClick={handleChangeCategory(lsMisc)}
                  >
                    Misc
                  </a>
                </nav>
                <button className="mt-4 inline-flex items-center rounded border-0 bg-gray-800 px-3 py-1 text-base hover:bg-gray-700 focus:outline-none md:mt-0">
                  {`${selected ? Object.keys(selected)[0] + ' selected' : 'none selected'}`}
                </button>
              </div>
              <form
                onSubmit={handleSubmit(onSaveCategory)}
                className="-m-2 flex flex-wrap"
              >
                <div className="w-full p-2">
                  <div className="relative">
                    <label className="text-sm capitalize leading-7 text-gray-600 dark:text-gray-400">
                      {`Your ${selected ? Object.keys(selected)[0] + 's' : 'moves'}`}
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
                      {convertMoveString(userMoves).length + 1} moves. New move
                      created each line.
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
      </section>
    </div>
  )
}

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
