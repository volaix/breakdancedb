'use client'
// @format
import fundamentals from '@/db/fundamentals.json'
import Header from './Header'
import Move from './Move'
import {useState, useEffect} from 'react'

const localStorageKeys = {
  FLOWS: 'flows',
  ALLMOVES: 'allMoves',
}

const Home = () => {
  //TODO: check local storage for allmoves
  const hasLocalStorageMoves = false

  //moves refer to "all the moves"
  const [moves, setMoves] = useState(
    hasLocalStorageMoves
      ? localStorage.getItem(localStorageKeys.ALLMOVES)
      : fundamentals,
  )

  //learning refers to "what will be displayed"
  const [learning, setLearning] = useState(null)

  //on mount setLearning
  useEffect(
    () => {
      const moveKeys = Object.keys(moves)
      if (moveKeys) {
        setLearning({
          entryMove: moves[moveKeys[0]],
          keyMove: moves[moveKeys[1]],
          exitMove: moves[moveKeys[2]],
        })
      }
    },
    [moves],
  )

  const saveToLocalStorage = () => {
    console.log('updating localStorage')
    //TODO: add to localStorage.flows rather than replace it
    localStorage.setItem(localStorageKeys.FLOWS, JSON.stringify(learning))
  }

  const onClickYes = () => {
    saveToLocalStorage()
    //TODO: Shuffle learning
  }
  const onClickSkip = () => {
    //TODO: Shuffle learning
  }
  const onClickNo = () => {
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
