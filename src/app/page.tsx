'use client'
// @format
import Header from './Header'
import Move from './Move'
import {useState, useEffect} from 'react'
import { Flow, lsFlows, lsUserMoves} from './lib'

const getRandomItem = (items: string[]) =>
  items[Math.floor(Math.random() * items.length)]

type Learning = Flow | null

const Home = () => {
  const [accessToLocalStorage, setAccessToLocalStorage] = useState(false)

  const [userMoves, setUserMoves] = useState<string[]>([])
  //learning refers to "what will be displayed"
  const [learning, setLearning] = useState<Learning>(null)

  useEffect(() => {
    setAccessToLocalStorage(typeof window !== 'undefined')
  }, [])

  //Populate existing moves
  useEffect(() => {
    if (
      accessToLocalStorage &&
      !!localStorage.getItem(lsUserMoves)
    ) {
      setUserMoves(JSON.parse(localStorage.getItem(lsUserMoves) || ''))
    }
  }, [accessToLocalStorage])

  const setLearningToRandom = (moves: string[]) => {
    setLearning({
      entryMove: getRandomItem(moves),
      keyMove: getRandomItem(moves),
      exitMove: getRandomItem(moves),
    })
  }

  //on mount setLearning
  useEffect(() => {
    console.log('moves', userMoves)
    //TODO: Learn moves according to algorithm
    setLearningToRandom(userMoves)
  }, [userMoves])

  const saveToLocalStorage = () => {
    console.log('saving to localStorage new flow')
    if (
      accessToLocalStorage &&
      !!localStorage.getItem(lsFlows) &&
      !!learning
    ) {
      const currentFlows: Flow[] = JSON.parse(
        localStorage.getItem(lsFlows) || '')
      const newFlows: Flow[] = currentFlows &&[...currentFlows, learning]
      localStorage.setItem(lsFlows, JSON.stringify(newFlows))
    } else {
      localStorage.setItem(lsFlows, JSON.stringify([learning]))
    }
  }

  const onClickYes = () => {
    //TODO: FUTURE have a celebration UI element
    saveToLocalStorage()
    setLearningToRandom(userMoves)
    //TODO: FUTURE popup on 5 star rating for each move multi select
    //TODO: FUTURE have refresh UI feeling
  }
  const onClickSkip = () => {
    setLearningToRandom(userMoves)
  }
  const onClickNo = () => {
    setLearningToRandom(userMoves)
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
