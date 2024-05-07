"use client"
import { RenderSaveButton } from "./SaveButton"
import { PositionsRange } from "./PositionsRange"
import { RenderNameInput } from "./NameInput"

const GoBack = () => (
  <a href="/learnmoves" className="inline-flex items-center text-indigo-400">
    <svg
      className="ml-2 h-4 w-4 rotate-180"
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
    go back to learn moves
  </a>
)

const NewMove = () => {
  return (
    <div className="">
      <GoBack />
      <RenderNameInput />
      <RenderSaveButton />
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
      <NewMove />
    </div>
  )
}

export default Page
