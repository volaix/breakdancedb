'use client'
//@format
import RenderHeader from '@/app/_components/Header'
import { useState, useEffect } from 'react'
import { Flow, getLocalStorageGlobal, lsFlows, useLocalStorage } from '@/app/_utils/lib'

/**
 * renders the flow box that displays 3 lines of text (the flow learned)
 * @param param0 Flow
 * @returns jsx
 */
const FlowBox = ({ flow }: { flow: Flow }) => {
  //todo: only display unique flows
  //todo: make delete button functional
  //todo: make hierarchy in text
  //-----------------------------render-----------------------------------
  return (
    <div className="w-1/3 p-2">
      <div className="relative flex h-full flex-col overflow-hidden rounded-lg bg-gray-800 bg-opacity-40 px-3 pb-6 pt-5 text-center">
        <h2 className="title-font mb-1 text-[7px] font-medium tracking-widest text-gray-500">
          FLOWS
        </h2>
        <h1 className="title-font mb-1 text-[9px] font-medium text-white sm:text-2xl">
          <div className="overflow-hidden	text-ellipsis whitespace-nowrap">
            {flow.entryMove}
          </div>
          <div className="overflow-hidden	text-ellipsis whitespace-nowrap">
            {flow.keyMove}
          </div>
          <div className="overflow-hidden	text-ellipsis whitespace-nowrap">
            {flow.exitMove}
          </div>
        </h1>
        <p className="text-[6px]  leading-relaxed">
          Addon notes about this flow. Hands are nice.
        </p>
        <div className="mt-1 flex justify-center">
          <a className="items-center text-[6px]  text-indigo-400">
            Edit
            <svg
              className="ml-1 inline-flex h-2 w-2 "
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M5 12h14"></path>
              <path d="M12 5l7 7-7 7"></path>
            </svg>
          </a>
        </div>

        <div className="absolute bottom-0 left-0 mt-2 flex w-full justify-center py-1 text-center leading-none">
          <span className="mr-1 inline-flex items-center border-r-2 border-gray-700 border-opacity-50 py-1 pr-1 text-[7px] leading-none text-gray-500">
            <svg
              fill="currentColor"
              className="mr-1 h-3 w-3"
              viewBox="0 0 26 26"
              strokeLinecap="round"
              strokeLinejoin="round"
              enableBackground="new 0 0 26 26"
            >
              <path d="M 17 0 C 13.1 0 9.7 2.5 8.5 6 L 9 6 C 9.6 6 10.09375 6.09375 10.59375 6.09375 C 11.69375 3.69375 14.2 2 17 2 C 20.9 2 24 5.1 24 9 C 24 11.8 22.30625 14.30625 19.90625 15.40625 C 20.00625 15.90625 20 16.5 20 17 L 20 17.5 C 23.5 16.3 26 12.9 26 9 C 26 4 22 0 17 0 z M 20.5 5.5 L 15.09375 6.3125 L 16.6875 7.875 L 9.28125 15.28125 L 10.71875 16.71875 L 18.125 9.3125 L 19.6875 10.90625 L 20.5 5.5 z M 9 8 C 4 8 0 12 0 17 C 0 22 4 26 9 26 C 14 26 18 22 18 17 C 18 15.4 17.60625 13.9875 16.90625 12.6875 L 15.40625 14.1875 C 15.80625 14.9875 16 16 16 17 C 16 20.9 12.9 24 9 24 C 5.1 24 2 20.9 2 17 C 2 13.1 5.1 10 9 10 C 10 10 11.0125 10.19375 11.8125 10.59375 L 13.3125 9.09375 C 12.0125 8.39375 10.6 8 9 8 z" />
            </svg>
            33
          </span>
          <span className="inline-flex items-center text-[7px] leading-none text-gray-500">
            <svg
              x="0px"
              y="0px"
              fill="currentColor"
              viewBox="0 0 100 100"
              className="mr-1 h-4 w-4"
              strokeLinecap="round"
              strokeLinejoin="round"
              enableBackground="new 0 0 100 100"
            >
              <path d="M83.306,47.054c-0.033,9.689-1.334,10.65-8.745,10.65c-0.631,0-34.135,0.004-37.172,0.004  c-4.957,0-10.961-0.004-10.961-0.004V50.06l-7.72,5.346l-7.724,5.346l7.724,5.345l7.72,5.346v-7.644c0,0,5.808,0.003,10.714,0.003  c3.157,0,36.8-0.003,37.419-0.003c9.3,0,17.926-1.288,15.525-21.438L83.306,47.054z"></path>
              <path d="M16.694,52.947c0.033-9.689,1.334-10.65,8.745-10.65c0.631,0,34.135-0.004,37.172-0.004c4.957,0,10.961,0.004,10.961,0.004  v7.645l7.72-5.346l7.724-5.346l-7.724-5.345l-7.72-5.347v7.645c0,0-5.808-0.003-10.714-0.003c-3.158,0-36.8,0.003-37.419,0.003  c-9.3,0-17.926,1.288-15.525,21.437L16.694,52.947z"></path>
            </svg>
            6
          </span>
        </div>
      </div>
    </div>
  )
}

/**
 * Renders all the completed flows the user has done. In future this will essentially be
 * a "history page"
 * @returns jsx
 */
const RenderCompletedMoves = () => {
  //------------------------------state---------------------------------
  const [flows, setFlows] = useState<Flow[] | null>(null)
  const [accessToLocalStorage, setAccessToLocalStorage] = useState(false)

  //-----------------------------hooks-------------------------------
  //checks if has access to localstorage
  useLocalStorage(setAccessToLocalStorage)


  //updates flows using localstorage
  useEffect(() => {
    setFlows(getLocalStorageGlobal[lsFlows](accessToLocalStorage))
  }, [accessToLocalStorage])

  //-----------------------------render---------------------------------
  //TODO: Shows flows, transitions, moves, combos, and organises them by frequency or date accessed
  return (
    <div className="h-screen bg-white dark:bg-gray-900">
      <div className="mt-12">
        <>
          <section className="body-font bg-gray-900 text-gray-400">
            <div className="container mx-auto px-5 py-5">
              <div className="-m-4 flex flex-wrap">
                {flows &&
                  flows.map((flow) => {
                    return (
                      <FlowBox
                        key={flow.entryMove + flow.keyMove + flow.exitMove}
                        flow={flow}
                      />
                    )
                  })}
              </div>
            </div>
          </section>
        </>
      </div>
    </div>
  )
}

/**
 * Renders the /completed page. 
 * @returns jsx
 */
export default function RenderPage() {
  return (
    <div>
      <RenderHeader />
      <RenderCompletedMoves />
    </div>
  )
}
