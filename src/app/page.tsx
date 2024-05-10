"use client"
// @format
import Header from "./Header"
import Move from "./Move"
import { useState, useEffect } from "react"
import {
  Flow,
  lsFlows,
  lsUserMoves,
  safeJsonParse,
  updateLocalStorageGlobal,
  useLocalStorage,
} from "./lib"

const getRandomItem = (items: string[]) =>
  items[Math.floor(Math.random() * items.length)]

type Learning = Flow | null

const Home = () => {
  const [accessToLocalStorage, setAccessToLocalStorage] = useState(false)
  const [userMoves, setUserMoves] = useState<string[]>([])
  //learning refers to "what will be displayed"
  const [learning, setLearning] = useState<Learning>(null)

  useLocalStorage(setAccessToLocalStorage)

  //Populate existing moves
  useEffect(() => {
    if (accessToLocalStorage && !!localStorage.getItem(lsUserMoves)) {
      setUserMoves(JSON.parse(localStorage.getItem(lsUserMoves) || ""))
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
    console.log("moves", userMoves)
    //TODO: Learn moves according to algorithm
    setLearningToRandom(userMoves)
  }, [userMoves])

  const updateLocalStorage = () => {
    const currentFlows: Flow[] = safeJsonParse<Flow[], []>(
      localStorage.getItem(lsFlows) || "",
      [],
    )
    if (learning) {
      const newFlows: Flow[] = currentFlows && [...currentFlows, learning]
      updateLocalStorageGlobal[lsFlows](newFlows, accessToLocalStorage)
    }
  }

  const onClickYes = () => {
    //TODO: FUTURE have a celebration UI element
    updateLocalStorage()
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
  //FEATURE Filters for categories (not yet built)
  //FEATURE Categories
  return (
    <main>
      <Header />
      <div
        className="z-10 
   mt-20 flex w-full max-w-xs flex-col items-center items-center justify-between font-mono text-sm dark:text-gray-600 "
      >
        <div className="mt-10">
          {displayMoves && (
            <>
              <Move move={learning["entryMove"]} />
              <Move move={learning["keyMove"]} />
              <Move move={learning["exitMove"]} />
            </>
          )}
          {displayMoves || (
            <div>please add your moves or import move db here</div>
          )}
        </div>
        <div className="flex justify-evenly px-2 py-5">
          {/* FEATURE on click yes, pop up some celebration. also a rating system on how good it was overall
          how good each move was
          and how good each transition was
          i.e. overall + ea move + ea trans = 7 ratings total 
          */}
          <a
            onClick={onClickYes}
            className="rounded border border-violet-600 bg-violet-600 px-6 py-2 text-center text-white "
          >
            Yes
          </a>

          <a
            onClick={onClickSkip}
            className="rounded border border-violet-600 px-6 py-2 text-center text-violet-600"
          >
            Skip
          </a>
          <a
            onClick={onClickNo}
            className="rounded border border-violet-600 bg-violet-600 px-6 py-2 text-center text-white"
          >
            No
          </a>
        </div>
      </div>
    </main>
  )
}

export default Home
