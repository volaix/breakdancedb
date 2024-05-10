import Header from '@/app/Header'
import moveListExample from '@/db/moveListExample.json'
import Image from 'next/image'

const DbEntry = ({ move }: { move: string }) => {
  //green overlay for moves you have, grey for ones you dont have
  return (
    <div className="flex w-2/6 items-center justify-center	overflow-hidden p-1">
      <h1 className="absolute z-10 font-bold text-white">{move}</h1>
      <div className="bg-gray-900 opacity-80 blur-sm">
        <Image
          width="600"
          height="400"
          className="w-full p-1"
          alt="move name"
          src={'https://dummyimage.com/600x400/000/fff'}
        />
      </div>
    </div>
  )
}

export default function Page() {
  //TODO use localstorage
  return (
    <>
      <Header />
      <div className="mt-20 flex	flex-wrap justify-start bg-gray-200 p-1">
        {moveListExample.map((move) => {
          return <DbEntry key={move} move={move} />
        })}
      </div>
      <div className="mt-10">
        <a
          // onClick={onClickYes}
          className="rounded border  border-violet-600 bg-violet-600 px-6 py-2 text-center text-white hover:bg-transparent hover:text-violet-600 focus:outline-none focus:ring active:text-violet-500"
          // href="/"
        >
          Add Move
        </a>
      </div>
    </>
  )
}
