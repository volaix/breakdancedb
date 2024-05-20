'use client'
//@format
import RenderHeader from '@/app/_components/Header'
import { lsUserMoves } from '../_utils/localStorageTypes'
import { getLocalStorageGlobal } from '../_utils/accessLocalStorage'
import { useState, useEffect } from 'react'
import { useZustandStore } from '../_utils/zustandLocalStorage'

//---------------------------utils---------------------------------
const convertMoveString = (moveString: string): string[] => {
  return moveString.split('\n')
}
const convertMoveArray = (moveArray: string[]): string => {
  return moveArray.join('\r\n')
}
//-----------------------------------------------------------------

/**
 * Component that allows user to put in their moves into the database
 * one line per move in a text file.
 * @returns jsx
 */
const YourMoves = () => {
  //-----------------------------state---------------------------
  const [userMoves, setUserMoves] = useState<string>('')
  const [saveText, setSaveText] = useState('Save')
  const [accessToLocalStorage, setAccessToLocalStorage] = useState(false)
  const setLsUserMoves = useZustandStore((state) => state.setLsUserMoves)

  //-----------------------------hooks------------------------------
  useEffect(() => {
    setAccessToLocalStorage(typeof window !== 'undefined')
  }, [])

  //Populate existing moves
  useEffect(() => {
    setUserMoves(
      convertMoveArray(
        getLocalStorageGlobal[lsUserMoves](accessToLocalStorage),
      ),
    )
  }, [accessToLocalStorage])

  //---------------------------handlers-----------------------------
  const onClickSave = () => {
    setLsUserMoves(convertMoveString(userMoves) as string[])
    setSaveText('Saved')
    //TODO show modal saved to localstorage
  }
  const onClickExport = () => {
    //TODO Export localstorage so user can download
    //TODO Change text to exported
  }
  const inDevelopment = true
  //-------------------------render---------------------------------
  return (
    <div>
      <section className=" body-font relative text-gray-600 dark:text-gray-600">
        <div className="container mx-auto px-5 py-24">
          <div className="mb-6 flex w-full flex-col text-center">
            <h1 className="title-font mb-4 text-2xl font-medium text-gray-900 sm:text-3xl dark:text-white">
              Your Footworks
            </h1>
            <p className="mx-auto text-base leading-relaxed lg:w-2/3 dark:text-gray-400">
              Add and view everything here. One per line.
            </p>
          </div>
          <div className="mx-auto md:w-2/3 lg:w-1/2">
            <div className="-m-2 flex flex-wrap">
              <div className="w-full p-2">
                <div className="relative">
                  <label className="text-sm leading-7 text-gray-600 dark:text-gray-400">
                    Your Moves
                  </label>
                  {/*TODO use react-hook-form to optimise and avoid rerenders */}
                  <textarea
                    id="moves"
                    name="message"
                    defaultValue={userMoves}
                    onChange={(e) => setUserMoves(e.target.value)}
                    className="h-32 w-full resize-none rounded border border-gray-300 bg-gray-100 bg-opacity-50 px-3 py-1 text-base leading-6 text-gray-700 outline-none transition-colors duration-200 ease-in-out focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-200 
                    dark:border-gray-700 dark:bg-gray-800 dark:bg-opacity-40 dark:text-gray-100 dark:focus:bg-gray-900 dark:focus:ring-indigo-900"
                  ></textarea>
                  <div className="text-xs">
                    {convertMoveString(userMoves).length + 1} moves. New move
                    created each line. No spaces please.
                  </div>
                </div>
              </div>
              <div className="flex w-full p-2">
                <button
                  onClick={onClickSave}
                  className="mx-auto flex rounded border-0 bg-indigo-500 px-8 py-2 text-lg text-white hover:bg-indigo-600 focus:outline-none"
                >
                  {saveText}
                </button>
                {inDevelopment || (
                  <button
                    onClick={onClickExport}
                    className="mx-auto flex rounded border-0 bg-indigo-500 px-8 py-2 text-lg text-white hover:bg-indigo-600 focus:outline-none"
                  >
                    Export
                  </button>
                )}
              </div>
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
export default function RenderPage() {
  return (
    <div>
      <RenderHeader />
      <YourMoves />
    </div>
  )
}
