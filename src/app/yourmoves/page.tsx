'use client'
import { useState } from 'react'
import Concepts from './Concepts'
import Moves from './Moves'

//@format

//----------------------components-----------------------------

/**
 * Component that allows user to put in their moves into the database
 * one line per move in a text file.
 * @returns jsx
 */
export default function RenderPageYourMoves() {
  // ------------------------state------------
  const [movesOrConcepts, setMovesOrConcepts] = useState<boolean>(true)
  //-------------------------render---------------------------------
  return (
    //--------------------------container--------------------------
    <main className="body-font container relative mx-auto px-5 py-24 text-gray-600 dark:text-gray-600">
      {/* -----------------header------------------- */}
      <hgroup className="mb-6 flex w-full flex-col text-center">
        <h1 className="title-font mb-4 text-2xl font-medium text-gray-900 sm:text-3xl dark:text-white">
          Your Moves
        </h1>
        <p className="mx-auto text-base leading-relaxed lg:w-2/3 dark:text-gray-400">
          Add and view everything here. One per line.
        </p>
      </hgroup>
      {/* ---------------------------BUTTON SWITCH------------------------ */}
      <section className="mt-6 flex w-full justify-center">
        {/* -------Button Container----- */}
        <article className="flex w-fit overflow-hidden rounded border-2 border-indigo-500">
          <button
            disabled={movesOrConcepts}
            onClick={() => setMovesOrConcepts(true)}
            className="px-4 py-1 focus:outline-none disabled:bg-indigo-500 disabled:text-white dark:enabled:text-gray-300"
          >
            Moves
          </button>
          <button
            disabled={!movesOrConcepts}
            onClick={() => setMovesOrConcepts(false)}
            className="px-4 py-1 focus:outline-none disabled:bg-indigo-500 disabled:text-white dark:enabled:text-gray-300"
          >
            Concepts
          </button>
        </article>
      </section>
      {/* ------------MOVES----------- */}
      {movesOrConcepts && <Moves />}
      {/* ------------CONCEPTS----------- */}
      {!movesOrConcepts && <Concepts />}
    </main>
  )
}
//----------------------------end of react component------------------------
