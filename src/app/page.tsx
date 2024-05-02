'use client'
// @format
import fundamentals from '@/db/fundamentals.json'
import Header from './Header'
import Move from './Move'
import {useState} from 'react'

//use state to get which view flow - transitions - move

const localStorageKeys = {
  FLOWS: 'flows',
}

const getRandomInt = (max: number) => {
  return Math.floor(Math.random() * max)
}

const displayMoves = () => {
  //gets random moves
  let randomMoves = [] as number[]
  while (randomMoves.length < 3) {
    let r = getRandomInt(Object.keys(fundamentals).length)
    if (randomMoves.indexOf(r) === -1) randomMoves.push(r)
  }
  const keys = Object.keys(fundamentals)
  const displayMoveObj = {
    entryMove: fundamentals[keys[randomMoves[0]]],
    keyMove: fundamentals[keys[randomMoves[1]]],
    exitMove: fundamentals[keys[randomMoves[2]]],
  }

  return displayMoveObj
}

const Home = () => {
  const [moves, setMoves] = useState(displayMoves())

  // When user submits the form, save the favorite number to the local storage
  const saveToLocalStorage = () => {
    localStorage.setItem(localStorageKeys.FLOWS, JSON.stringify(moves))
  }

  const refreshMoves = () => {
    setMoves(displayMoves())
  }
  const onClickYes = () => {
    console.log('update DB')
    //wait for setmoves to complete before saving
    saveToLocalStorage()
    refreshMoves()
  }
  const onClickSkip = () => {
    refreshMoves()
  }
  const onClickNo = () => {
    console.log('popup for "entrance or exit"')
    console.log('update DB')
    refreshMoves()
  }

  return (
    <main>
      <Header />
      <div
        className="z-10 
   w-full max-w-5xl items-center justify-between font-mono text-sm lg:flex">
        <div className="mt-10">
          <Move move={moves['entryMove']} />
          <Move move={moves['keyMove']} />
          <Move move={moves['exitMove']} />
        </div>
        <div className="py-5 px-2 flex justify-evenly">
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
