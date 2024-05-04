'use client'
// @format
import Header from './Header'
import Move from './Move'
import {useState, useEffect} from 'react'
import {localStorageKeys} from './lib'

const getRandomItem = (items: string[]) =>
  items[Math.floor(Math.random() * items.length)]

const Home = () => {
  const [accessToLocalStorage, setAccessToLocalStorage] = useState(false)
  const [userMoves, setUserMoves] = useState([])
  //learning refers to "what will be displayed"
  const [learning, setLearning] = useState(null)

  useEffect(() => {
    setAccessToLocalStorage(typeof window !== 'undefined')
  }, [])

  //Populate existing moves
  useEffect(() => {
    if (
      accessToLocalStorage &&
      !!localStorage.getItem(localStorageKeys.USERMOVES)
    ) {
      setUserMoves(JSON.parse(localStorage.getItem(localStorageKeys.USERMOVES)))
    }
  }, [accessToLocalStorage])

  const setLearningToRandom = () => {
    setLearning({
      entryMove: getRandomItem(userMoves),
      keyMove: getRandomItem(userMoves),
      exitMove: getRandomItem(userMoves),
    })
  }

  //on mount setLearning
  useEffect(() => {
    console.log('moves', userMoves)
    //TODO: Learn moves according to algorithm
    setLearningToRandom()
  }, [userMoves])

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
    //TODO: FUTURE have a celebration UI element
    saveToLocalStorage()
    setLearningToRandom()
    //TODO: FUTURE have refresh UI feeling
  }
  const onClickSkip = () => {
    setLearningToRandom()
  }
  const onClickNo = () => {
    setLearningToRandom()
    //TODO: Have multiselect appear on where user could not complete. If none are selected then never show the flow combination again.
    //TODO: FUTURE have refresh UI feeling
    //TODO: Delete entry if you have it in flows
  }

  const displayMoves = learning && userMoves.length > 0
  return (
    <main>
      <Header />
      <div
        className="z-10 
   w-full max-w-5xl items-center justify-between font-mono text-sm lg:flex">
        <div className="mt-10">
          {displayMoves && (
            <>
              <Move move={learning['entryMove']} />
              <Move move={learning['keyMove']} />
              <Move move={learning['exitMove']} />
            </>
          )}
          {displayMoves || (
            <div>please add your moves or import move db here</div>
          )}
        </div>
        <div className="py-5 px-2 flex justify-evenly">
          <a
            onClick={onClickYes}
            className="px-6 py-2 text-center text-white bg-violet-600 border border-violet-600 rounded ">
            Yes
          </a>

          <a
            onClick={onClickSkip}
            className="px-6 py-2 text-center text-violet-600 border border-violet-600 rounded">
            Skip
          </a>
          <a
            onClick={onClickNo}
            className="px-6 py-2 text-center text-white bg-violet-600 border border-violet-600 rounded">
            No
          </a>
        </div>
      </div>
    </main>
  )
}

export default Home
