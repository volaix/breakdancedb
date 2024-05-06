'use client'
//@format
import Header from '@/app/Header'
import {lsUserMoves} from '@/app/lib'
import {useState, useEffect} from 'react'
import {LocalStorageStructureKeys} from '@/app/lib'

const convertMoveString = (moveString: string): string[] => {
  return moveString.split('\n')
}
const convertMoveArray = (moveArray: string[]): string => {
  return moveArray.join('\r\n')
}

const YourMoves = () => {
  const [userMoves, setUserMoves] = useState('')
  const [saveText, setSaveText] = useState('Save')
  const [accessToLocalStorage, setAccessToLocalStorage] = useState(false)

  useEffect(() => {
    setAccessToLocalStorage(typeof window !== 'undefined')
  }, [])

  //Populate existing moves
  useEffect(() => {
    if (accessToLocalStorage && !!localStorage.getItem(lsUserMoves)) {
      setUserMoves(
        convertMoveArray(JSON.parse(localStorage.getItem(lsUserMoves) || '')),
      )
    }
  }, [accessToLocalStorage])

  const saveToLocalStorage = (localStorageKey: LocalStorageStructureKeys) => {
    if (accessToLocalStorage)
      localStorage.setItem(
        localStorageKey,
        JSON.stringify(convertMoveString(userMoves)),
      )
  }
  const onClickSave = () => {
    saveToLocalStorage(lsUserMoves)
    setSaveText('Saved')
    //TODO show modal saved to localstorage
  }
  const onClickExport = () => {
    //TODO Export localstorage
    //TODO Change text to exported
  }
  return (
    <div>
      <section className=" dark:text-gray-600 text-gray-600 body-font relative">
        <div className="container px-5 py-24 mx-auto">
          <div className="flex flex-col text-center w-full mb-6">
            <h1 className="sm:text-3xl text-2xl font-medium title-font mb-4 text-gray-900 dark:text-white">
              Your Moves
            </h1>
            <p className="dark:text-gray-400 lg:w-2/3 mx-auto leading-relaxed text-base">
              Add and view everything here. One per line.
            </p>
          </div>
          <div className="lg:w-1/2 md:w-2/3 mx-auto">
            <div className="flex flex-wrap -m-2">
              <div className="p-2 w-full">
                <div className="relative">
                  <label className="dark:text-gray-400 leading-7 text-sm text-gray-600">
                    Your Moves
                  </label>
                  <textarea
                    id="moves"
                    name="message"
                    defaultValue={userMoves}
                    onChange={e => setUserMoves(e.target.value)}
                    className="w-full bg-gray-100 bg-opacity-50 rounded border border-gray-300 focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-200 h-32 text-base outline-none text-gray-700 py-1 px-3 resize-none leading-6 transition-colors duration-200 ease-in-out 
                    dark:bg-gray-800 dark:bg-opacity-40 dark:border-gray-700 dark:focus:bg-gray-900 dark:focus:ring-indigo-900 dark:text-gray-100"></textarea>
                  <div className="text-xs">
                    {convertMoveString(userMoves).length + 1} moves. New move
                    created each line. No spaces please.
                  </div>
                </div>
              </div>
              <div className="p-2 w-full flex">
                <button
                  onClick={onClickSave}
                  className="flex mx-auto text-white bg-indigo-500 border-0 py-2 px-8 focus:outline-none hover:bg-indigo-600 rounded text-lg">
                  {saveText}
                </button>
                <button
                  onClick={onClickExport}
                  className="flex mx-auto text-white bg-indigo-500 border-0 py-2 px-8 focus:outline-none hover:bg-indigo-600 rounded text-lg">
                  Export
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
const Page = () => {
  return (
    <div>
      <Header />
      <YourMoves />
    </div>
  )
}
export default Page
