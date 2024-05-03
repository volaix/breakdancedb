'use client'
// @format
import moveListExample from '@/db/moveListExample.json'
import Header from './Header'
import Move from './Move'
import {useState, useEffect} from 'react'

const localStorageKeys = {
  FLOWS: 'flows', //ds array of objects
  ALLMOVES: 'allMoves', //ds array of strings
}

const getRandomItem = (items: string[]) =>
  items[Math.floor(Math.random() * items.length)]

const Home = () => {
  let accessToLocalStorage: boolean = typeof window !== 'undefined'

  //check access to localStorage.FLOWS
  let hasLocalStorageMoves: boolean = false
  if (accessToLocalStorage) {
    hasLocalStorageMoves = !!localStorage.getItem(localStorageKeys.ALLMOVES)
  }

  //moves refer to "all the moves"
  const [moves, setMoves] = useState(
    hasLocalStorageMoves
      ? localStorage.getItem(localStorageKeys.ALLMOVES)
      : moveListExample,
  )

  //learning refers to "what will be displayed"
  const [learning, setLearning] = useState(null)

  const setLearningToRandom = () => {
    setLearning({
      entryMove: getRandomItem(moves),
      keyMove: getRandomItem(moves),
      exitMove: getRandomItem(moves),
    })
  }

  //on mount setLearning
  useEffect(
    () => {
      console.log('moves', moves)
      //TODO: Learn moves according to algorithm
      setLearningToRandom()
    },
    [moves],
  )

  const saveToLocalStorage = () => {
    console.log('updating localStorage')
    if (
      accessToLocalStorage &&
      !!localStorage.getItem(localStorageKeys.FLOWS)
    ) {
      const currentFlows: string[] = JSON.parse(
        localStorage.getItem(localStorageKeys.FLOWS),
      )
      const newFlows: string[] = [...currentFlows, learning]
      localStorage.setItem(localStorageKeys.FLOWS, JSON.stringify(newFlows))
    } else {
      localStorage.setItem(localStorageKeys.FLOWS, JSON.stringify([learning]))
    }
  }

  const onClickYes = () => {
    saveToLocalStorage()
    setLearningToRandom()
  }
  const onClickSkip = () => {
    setLearningToRandom()
  }
  const onClickNo = () => {
    setLearningToRandom()
    //TODO: Have multiselect appear on where user could not complete. If none are selected then never show the flow combination again.
  }

  return (
    <main>
      <Header />
      <div
        className="z-10 
   w-full max-w-5xl items-center justify-between font-mono text-sm lg:flex">
        <div className="mt-10">
          {learning && (
            <>
              <Move move={learning['entryMove']} />
              <Move move={learning['keyMove']} />
              <Move move={learning['exitMove']} />
            </>
          )}
        </div>
        <div className="py-5 px-2 flex justify-evenly">
          {/* TODO: clicking buttons feels weird */}
          <a
            onClick={onClickYes}
            className="px-6 py-2  text-center text-white bg-violet-600 border border-violet-600 rounded active:text-violet-500 hover:bg-transparent hover:text-violet-600 focus:outline-none focus:ring">
            Yes
          </a>

          <a
            onClick={onClickSkip}
            className="px-6 py-2  text-center text-violet-600 border border-violet-600 rounded hover:bg-violet-600 hover:text-white active:bg-indigo-500 focus:outline-none focus:ring">
            Skip
          </a>
          <a
            onClick={onClickNo}
            className="px-6 py-2  text-center text-white bg-violet-600 border border-violet-600 rounded active:text-violet-500 hover:bg-transparent hover:text-violet-600 focus:outline-none focus:ring">
            No
          </a>
        </div>
      </div>
    </main>
  )
}

export default Home
