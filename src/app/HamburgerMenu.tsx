'use client'
import {useState} from 'react'

const Header = () => {
  const [isNavOpen, setIsNavOpen] = useState(false)

  return (
    <div className="flex items-center justify-between fixed w-4/5">
      <nav>
        <section className="MOBILE-MENU flex lg:hidden">
          <div
           className="space-y-2"
            onClick={() => setIsNavOpen(prev => !prev)}>

            <div className="grid justify-items-center gap-1.5">
              <span className="h-0.5 w-5 rounded-full bg-slate-400 transition group-hover:rotate-45 group-hover:translate-y-2.5" />
              <span className="h-0.5 w-5 rounded-full bg-slate-400 group-hover:scale-x-0 transition" />
              <span className="h-0.5 w-5 rounded-full bg-slate-400 group-hover:-rotate-45 group-hover:-translate-y-2.5" />
            </div>
          </div>

          <div className={isNavOpen ? 'showMenuNav' : 'hideMenuNav'}>
            <div
              className="absolute top-0 right-0 px-8 py-8"
              onClick={() => setIsNavOpen(false)}>
              <svg
                className="h-8 w-8 text-gray-600"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </div>
            <ul className="text-black	flex flex-col items-center justify-between min-h-[250px]">
              <li className="border-b border-gray-400 my-2 uppercase">
                <a href="/">Learn Flow</a>
              </li>
              <li className="border-b border-gray-400 my-2 uppercase">
                <a href="/">Learn Transitions</a>
              </li>
              <li className="border-b border-gray-400 my-2 uppercase">
                <a href="/vocab">Learn Moves</a>
              </li>
              <li className="border-b border-gray-400 my-2 uppercase">
                <a href="/dblist">All Moves</a>
              </li>
              <li className="border-b border-gray-400 my-2 uppercase">
                <a href="/combos">Your Combos</a>
              </li>
              <li className="border-b border-gray-400 my-2 uppercase">
                <a href="/completed">Completed</a>
              </li>
              <li className="border-b border-gray-400 my-2 uppercase">
                <a href="/nodes">View Connections</a>
              </li>
            </ul>
          </div>
        </section>

        <ul className="DESKTOP-MENU hidden space-x-8 lg:flex">
          <li>
            <a href="/faq">mobile only website</a>
          </li>
        </ul>
      </nav>
      <style>{`
      .hideMenuNav {
        display: none;
      }
      .showMenuNav {
        display: block;
        position: absolute;
        width: 100%;
        height: 100vh;
        top: 0;
        left: 0;
        background: white;
        z-index: 10;
        display: flex;
        flex-direction: column;
        justify-content: space-evenly;
        align-items: center;
      }
    `}</style>
    </div>
  )
}

export default Header
