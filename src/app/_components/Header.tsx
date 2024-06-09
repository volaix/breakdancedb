'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'

/**
 * Renders the top header used on every page. Usually thrown in the template.tsx
 * Hamburger menu, top left, text mid, profile pic top right.
 * @returns
 */
export default function RenderHeader() {
  //-----------------state------------------------------------
  const [isNavOpen, setIsNavOpen] = useState(false)
  const inDevelopment = true

  //-----------------render----------------------------------------
  return (
    <header className="fixed left-0 top-0 z-10 flex w-full justify-center border-b border-slate-300 bg-gradient-to-b from-slate-200 pb-2 pt-4 backdrop-blur-2xl dark:border-neutral-800 dark:bg-slate-800/30 dark:from-inherit lg:dark:bg-slate-800/30">
      <Link className="font-mono font-bold" href={{ pathname: '/' }}>
        breakdanceDB
      </Link>

      <nav className={`fixed left-2 top-3 `}>
        <div
          className={`fixed flex w-4/5 max-w-xs items-center justify-between`}
        >
          <nav>
            <section className="flex">
              <article
                className="space-y-2"
                onClick={() => setIsNavOpen((prev) => !prev)}
              >
                <div className="grid justify-items-center gap-1.5">
                  <span className="h-0.5 w-5 rounded-full bg-slate-400 transition group-hover:translate-y-2.5 group-hover:rotate-45" />
                  <span className="h-0.5 w-5 rounded-full bg-slate-400 transition group-hover:scale-x-0" />
                  <span className="h-0.5 w-5 rounded-full bg-slate-400 group-hover:-translate-y-2.5 group-hover:-rotate-45" />
                </div>
              </article>

              <nav
                className={`${isNavOpen && 'absolute left-0 top-0 z-10 flex h-screen w-full flex-col items-center justify-evenly bg-white'} ${!isNavOpen && 'hidden'} `}
              >
                {/* ------delete button------- */}
                <article
                  className="absolute right-0 top-0 px-8 py-8"
                  onClick={() => setIsNavOpen(false)}
                >
                  <svg
                    className="h-8 w-8 text-gray-600"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </article>
                {/* ----------navigation------------ */}
                <ul className="flex	min-h-[250px] flex-col items-center justify-between text-black">
                  <li className="my-2 border-b border-gray-400 uppercase">
                    <a href="/yourmoves">📚 Your Moves 📚</a>
                  </li>
                  <li className="my-2 border-b border-gray-400 uppercase">
                    <a href="/learntransitions">🧐 Transitions 🧐</a>
                  </li>
                  <li className="my-2 border-b border-gray-400 uppercase">
                    <a href="/learnflows">💪 RNG Set 💪</a>
                  </li>
                  <li className="my-2 border-b border-gray-400 uppercase">
                    <a href="/combos">🤖 Make Set 🤖</a>
                  </li>
                  <li className="my-2 border-b border-gray-400 uppercase">
                    <a href="/battle">🥊 Battle 🥊</a>
                  </li>
                  <li className="my-2 border-b border-gray-400 text-xs uppercase">
                    <a href="/dblist">View Stats</a>
                  </li>
                  <li className="my-2 border-b border-gray-400 text-xs uppercase">
                    <a href="/importexport"> Import / Export </a>
                  </li>
                  <li className="my-2 border-b border-gray-400 text-xs uppercase">
                    <a href="/warmup">Warmup Protocol‍</a>
                  </li>
                  <li className="my-2 border-b border-gray-400 uppercase">
                    <a href="/learnmoves">🌱 Train Moves 🌱</a>
                  </li>
                  <li className="my-2 border-b border-gray-400 uppercase">
                    <a href="/create">🎨 Create Move 🎨</a>
                  </li>
                  {inDevelopment || (
                    <li className="my-2 border-b border-gray-400 uppercase">
                      <a href="/nodes">Nodeview</a>
                    </li>
                  )}
                </ul>
              </nav>
            </section>
          </nav>
        </div>
      </nav>
      <div className="fixed right-2 top-3">
        <Image
          className="h-5 w-5 rounded-full"
          width="64"
          height="64"
          src="https://dummyimage.com/64x64/000/fff"
          alt="Rounded avatar"
        />
      </div>
    </header>
  )
}
