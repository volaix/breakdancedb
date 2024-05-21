'use client'

import { ChangeEvent, useEffect, useState } from 'react'
import { useZustandStore } from '../_utils/zustandLocalStorage'

export default function RenderPageWarmup() {
  //------------------------state------------------------
  const [list, setList] = useState<string[]>([])
  const [saveText, setSaveText] = useState<string>('Save')
  const setDanceList = useZustandStore((state) => state.setDanceList)
  const getDanceList = useZustandStore((state) => state.getDanceList)

  const handleChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    const value = event.target.value
    const items = value.split('\n').filter((item) => item.trim() !== '')
    setList(items)
  }

  //----------------------hooks-----------------------
  useEffect(() => {
    const danceList = getDanceList()
    if (danceList.length > 0) {
      setList(danceList)
    }
  }, [getDanceList])

  //----------------------handlers------------------------
  const handleSave = () => {
    setDanceList(list)
    setSaveText('Saved')
  }

  //-----------------------render------------------------
  return (
    <div className="mt-24">
      <h1 className="title-font mb-4 text-center text-2xl font-medium text-gray-900 sm:text-3xl dark:text-white">
        Warmup
      </h1>
      <div className="flex flex-col items-center justify-center text-xs">
        <div className="mb-10 px-5 text-center">
          I personally like: <br />
          <div className="my-5">
            <h5 className="text-left font-bold text-black dark:text-white">
              3min: overall body warmup
            </h5>
            <div> literally increase body temperature. jogs. shakes. </div>
          </div>
          <div className="my-5">
            <h5 className="text-left font-bold text-black dark:text-white">
              5min: specialised warmup
            </h5>
            <div>
              mobility for things that get injured or dont want to get injured
              wrist, toes, ankles, knees, fingers, elbows, shoulders, neck,
              hips, torso
            </div>
          </div>
          <div className="my-5">
            <h5
              className=" text-left
            font-bold text-black dark:text-white"
            >
              5min: load slowly the activity
            </h5>
            <div>slowly increase load to the activity</div>
          </div>
        </div>
        {/* -----------spacer-------------- */}
        <div className="mb-4 mt-2 flex w-10 justify-center">
          <div className="inline-flex h-1 w-16 rounded-full bg-indigo-500"></div>
        </div>
        <h1 className="text-lg text-gray-800 dark:text-gray-200">
          Warmup List
        </h1>
        <p className="ml-5">
          Your list of things to warmup. Gets reused in learnmove/study to learn
          moves
        </p>
        <div className="flex max-w-xs space-x-4 p-4">
          <textarea
            className="w-1/2 rounded-lg border border-gray-300 p-4
    shadow-sm focus:border-transparent focus:outline-none
    focus:ring-2 focus:ring-blue-400"
            rows={10}
            cols={30}
            onChange={handleChange}
            defaultValue={list.join('\n')}
          ></textarea>
          <pre className="w-1/2 rounded-lg bg-gray-100 p-4">
            {JSON.stringify(list, null, 2)}
          </pre>
        </div>

        <button
          className="disabled:bg-grey-400 disabled:text-grey m-2 w-2/3 rounded border-0 bg-indigo-500 px-6 py-2 text-center text-white focus:outline-none disabled:opacity-75"
          onClick={handleSave}
        >
          {saveText}
        </button>
      </div>
    </div>
  )
}
