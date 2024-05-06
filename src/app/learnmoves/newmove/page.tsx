'use client'
import Header from '@/app/Header'
import {LocalStorageStructureKeys} from '@/app/lib'
import {SaveButton} from './SaveButton'
import {PositionsRange} from './PositionsRange'
import {NameInput} from './NameInput'

const GoBack = () => (
  <a href="/learnmoves" className="text-indigo-400 inline-flex items-center">
    <svg
      className="w-4 h-4 ml-2 rotate-180"
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
)

const NewMove = () => {
  //  display: flex;
  // flex-direction: column;
  // align-items: center;
  return (
    <div className="mt-20 dark:text-gray-600 flex items-center">
      <GoBack />

      <NameInput />
      <SaveButton />
      <PositionsRange />

      <div className="mt-10">
        {`In future, we'll have`}
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
