'use client'
import Header from '@/app/Header'
import {useState, useEffect} from 'react'
import {lsUserLearning} from '@/app/lib'
import Link from 'next/link'

const MoveBox = ({move}: {move: string}) => {
 const noSpacesMove = move.replace(/[^A-Z0-9]+/ig, "_")
  return (
   <Link href={`/learnmoves/${noSpacesMove}`}>
      <div className="p-2 w-1/3">
        <div className="h-full bg-gray-800 bg-opacity-40 px-3 pt-5 pb-6 rounded-lg overflow-hidden text-center relative flex flex-col">
          <h2 className="tracking-widest title-font font-medium text-gray-500 mb-1 text-[7px]">
            Learning
          </h2>
          <h1 className="title-font sm:text-2xl text-[9px] font-medium text-white mb-1">
            <div className="whitespace-nowrap	overflow-hidden text-ellipsis">
              {move}
            </div>
          </h1>
          <div className="flex justify-center mt-1">
            <a className="text-indigo-400 items-center  text-[6px]">
              Edit
              <svg
                className="w-2 h-2 ml-1 inline-flex "
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round">
                <path d="M5 12h14"></path>
                <path d="M12 5l7 7-7 7"></path>
              </svg>
            </a>
          </div>

          <div className="text-center mt-2 leading-none flex justify-center absolute bottom-0 left-0 w-full py-1">
            <span className="text-gray-500 mr-1 inline-flex items-center leading-none text-[7px] pr-1 py-1 border-r-2 border-gray-700 border-opacity-50">
              <svg
                fill="currentColor"
                className="w-3 h-3 mr-1"
                viewBox="0 0 26 26"
                strokeLinecap="round"
                strokeLinejoin="round"
                enableBackground="new 0 0 26 26">
                <path d="M 17 0 C 13.1 0 9.7 2.5 8.5 6 L 9 6 C 9.6 6 10.09375 6.09375 10.59375 6.09375 C 11.69375 3.69375 14.2 2 17 2 C 20.9 2 24 5.1 24 9 C 24 11.8 22.30625 14.30625 19.90625 15.40625 C 20.00625 15.90625 20 16.5 20 17 L 20 17.5 C 23.5 16.3 26 12.9 26 9 C 26 4 22 0 17 0 z M 20.5 5.5 L 15.09375 6.3125 L 16.6875 7.875 L 9.28125 15.28125 L 10.71875 16.71875 L 18.125 9.3125 L 19.6875 10.90625 L 20.5 5.5 z M 9 8 C 4 8 0 12 0 17 C 0 22 4 26 9 26 C 14 26 18 22 18 17 C 18 15.4 17.60625 13.9875 16.90625 12.6875 L 15.40625 14.1875 C 15.80625 14.9875 16 16 16 17 C 16 20.9 12.9 24 9 24 C 5.1 24 2 20.9 2 17 C 2 13.1 5.1 10 9 10 C 10 10 11.0125 10.19375 11.8125 10.59375 L 13.3125 9.09375 C 12.0125 8.39375 10.6 8 9 8 z" />
              </svg>
              33
            </span>
            <span className="text-gray-500 inline-flex items-center leading-none text-[7px]">
              <svg
                x="0px"
                y="0px"
                fill="currentColor"
                viewBox="0 0 100 100"
                className="w-4 h-4 mr-1"
                strokeLinecap="round"
                strokeLinejoin="round"
                enableBackground="new 0 0 100 100">
                <path d="M83.306,47.054c-0.033,9.689-1.334,10.65-8.745,10.65c-0.631,0-34.135,0.004-37.172,0.004  c-4.957,0-10.961-0.004-10.961-0.004V50.06l-7.72,5.346l-7.724,5.346l7.724,5.345l7.72,5.346v-7.644c0,0,5.808,0.003,10.714,0.003  c3.157,0,36.8-0.003,37.419-0.003c9.3,0,17.926-1.288,15.525-21.438L83.306,47.054z"></path>
                <path d="M16.694,52.947c0.033-9.689,1.334-10.65,8.745-10.65c0.631,0,34.135-0.004,37.172-0.004c4.957,0,10.961,0.004,10.961,0.004  v7.645l7.72-5.346l7.724-5.346l-7.724-5.345l-7.72-5.347v7.645c0,0-5.808-0.003-10.714-0.003c-3.158,0-36.8,0.003-37.419,0.003  c-9.3,0-17.926,1.288-15.525,21.437L16.694,52.947z"></path>
              </svg>
              6
            </span>
          </div>
        </div>
      </div>
    </Link>
  )
}

const LearnMoves = () => {
  const [accessToLocalStorage, setAccessToLocalStorage] = useState(false)
  const [learning, setLearning] = useState([])

  console.log('learning', learning)

  const existingMoves = [] //TODO get this using localStorage

  useEffect(() => {
    setAccessToLocalStorage(typeof window !== 'undefined')
  }, [])

  //get learning moves
  useEffect(() => {
    if (accessToLocalStorage) {
      setLearning(JSON.parse(localStorage.getItem(lsUserLearning)))
    }
  }, [accessToLocalStorage])

  return (
    <div className="mt-20">
      <div>
        <a
          href="/learnmoves/newmove"
          className="text-indigo-400 inline-flex items-center">
          add new move
          <svg
            className="w-4 h-4 ml-2"
            viewBox="0 0 24 24"
            stroke="currentColor"
            stroke-width="2"
            fill="none"
            stroke-linecap="round"
            stroke-linejoin="round">
            <path d="M5 12h14"></path>
            <path d="M12 5l7 7-7 7"></path>
          </svg>
        </a>
      </div>
      <h1>Moves Learning</h1>
      {learning &&
        learning.map(move => {
          return <MoveBox move={move} />
        })}
    </div>
  )
}

const Page = () => {
  return (
    <div>
      <Header />
      <LearnMoves />
    </div>
  )
}

export default Page
