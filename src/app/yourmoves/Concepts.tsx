import { useState } from 'react'

export default function Concepts() {
  const [saveText, setSaveText] = useState('Save')
  return (
    <section>
      <article>
        <h2 className="text-sm capitalize leading-7 text-gray-600 dark:text-gray-400">
          {`Concepts`}
        </h2>
        <textarea
          // {...register('categoryMoves')}
          className="h-32 w-8/12 max-w-fit resize-none rounded border border-gray-300 bg-gray-100 bg-opacity-50 px-3 py-1 text-xs text-gray-700 outline-none transition-colors duration-200 ease-in-out focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-200 dark:border-gray-700 dark:bg-gray-800 dark:bg-opacity-40 dark:text-gray-100 dark:focus:bg-gray-900 dark:focus:ring-indigo-900"
        />
      </article>
      {/* -------------Buttons-------------- */}
      <section className="mt-5 flex w-full justify-center">
        {/* ----------sort button------- */}
        <button
          className="flex items-center justify-center rounded border 
              border-indigo-500 px-8 py-2 text-center  
              text-indigo-500"
          onClick={(e) => {
            //prevents form submit
            e.preventDefault()
            // sortMovesInTextArea()
          }}
        >
          <label className="text-lg leading-none">Sort</label>
        </button>
        {/* -------------Save Button------------------ */}
        <button
          // disabled={!saveButtonActive}
          type="submit"
          className="flex rounded border-0 bg-indigo-500 
              px-8 py-2 text-lg text-white hover:bg-indigo-600 
              focus:outline-none disabled:opacity-50"
        >
          {saveText}
        </button>
      </section>
      <p className="text-[7px]">
        sort button cannot be undone. Sorts current moves in alphabetical order
      </p>
      {/* ---------end of buttons--------- */}
    </section>
  )
}
