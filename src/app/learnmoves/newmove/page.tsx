'use client'
import Header from '@/app/Header'
import rocks from '@/db/rocks.json'
import {useState, useEffect} from 'react'

const SaveButton = () => {
  return (
    <div class="p-2 w-full">
      <button class="flex mx-auto text-white bg-indigo-500 border-0 py-2 px-8 focus:outline-none hover:bg-indigo-600 rounded text-lg">
        Save
      </button>
    </div>
  )
}
const Position = ({position}) => {
  return (
    <div className="flex">
      <div className="mr-2"></div>
      <div class="relative text-xs">
        {null && (
          <label className="dark:text-gray-400 leading-7 text-sm text-gray-600">
            Move Name
          </label>
        )}
        <input
          type="text"
          id="name"
          defaultValue={`Position-${position}-${rocks[Math.floor(Math.random()*rocks.length)]}`}
          name="name"
          className="dark:text-gray-500 w-full bg-gray-100 bg-opacity-50 rounded border border-gray-300 focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 resize-none leading-6 transition-colors duration-200 ease-in-out dark:bg-gray-800 dark:bg-opacity-40 dark:border-gray-700 dark:focus:bg-gray-900 dark:focus:ring-indigo-900 dark:text-gray-100"
        />
      </div>
    </div>
  )
}

const PositionsRange = () => {
  const [positions, setPositions] = useState<string>('6')
  const updatePositions = e => {
    setPositions(e.target.value)
  }
  const max = '20'
  return (
    <div class="shadow-lg p-6 w-full max-w-md">
      <div className="flex">
        <h2 class="text-2xl font-bold mb-4">Optional</h2>
        <div>switch</div>
      </div>
      <div class="mb-4">
        <label for="price-range" class="block text-gray-700 font-bold mb-2">
          Move Positions
        </label>
        <input
          type="range"
          id="price-range"
          class="w-full accent-indigo-500"
          min="1"
          max={max}
          value={positions}
          onInput={updatePositions}
        />
        <div className="text-xs">You can always edit positions again later</div>
      </div>
      <div class="flex justify-between text-gray-500">
        <span id="minPrice">{positions}</span>
        <span id="maxPrice">{max}</span>
      </div>
      <div className="mt-5">
        {[...Array(Number(positions))].map((e, i) => (
          <span className="" key={i}>
            <Position position={i + 1} />
          </span>
        ))}
      </div>
    </div>
  )
}

const NameInput = () => {
  return (
    <div class="relative text-xs">
      <label className="dark:text-gray-400 leading-7 text-sm text-gray-600">
        Move Name
      </label>
      <input
        type="text"
        id="name"
        name="name"
        className="w-full bg-gray-100 bg-opacity-50 rounded border border-gray-300 focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 resize-none leading-6 transition-colors duration-200 ease-in-out dark:bg-gray-800 dark:bg-opacity-40 dark:border-gray-700 dark:focus:bg-gray-900 dark:focus:ring-indigo-900 dark:text-gray-100"
      />
      recommended 1-3 words
    </div>
  )
}

const NewMove = () => {
  return (
    <div className="mt-20 dark:text-gray-600">
      <a href="/learnmoves" class="text-indigo-400 inline-flex items-center">
        <svg
          class="w-4 h-4 ml-2 rotate-180"
          viewBox="0 0 24 24"
          stroke="currentColor"
          stroke-width="2"
          fill="none"
          stroke-linecap="round"
          stroke-linejoin="round">
          <path d="M5 12h14"></path>
          <path d="M12 5l7 7-7 7"></path>
        </svg>
        go back to learn moves
      </a>

      <NameInput />
      <SaveButton />
      <PositionsRange />

      <div className="mt-10">
        In future, we'll have
        <li>video example</li>
        <li>screenshots per pose</li>
        <li>self video upload</li>
        <li>self screenshot uploads to compare pose</li>
        <li>each pose correct = % of move unlocked</li>
      </div>
    </div>
  )
}

const Page = () => {
  return (
    <div>
      <Header />
      <NewMove />
    </div>
  )
}

export default Page
