import Header from '@/app/Header'
import fundamentals from '@/db/fundamentals.json'

type Fundamentals = typeof fundamentals
type FundamentalKeys = keyof Fundamentals

const DbEntry = ({move}: {move: keyof Fundamentals}) => {
  //green overlay for moves you have, grey for ones you dont have
  return (
   <div className="overflow-hidden w-2/6 p-1 justify-center	items-center flex">
      <h1 className="absolute z-10 font-bold text-white">{move}</h1>
      <div className="bg-gray-900 opacity-80 blur-sm">
        <img
          className="w-full p-1"
          alt="move name"
          src={fundamentals[move]['cover_img']}
        />
      </div>
    </div>
  )
}

export default function Page() {
  const moveKeys = Object.keys(fundamentals) as FundamentalKeys[]
  return (
    <>
      <Header />
      <div className="mt-20 bg-gray-200	flex flex-wrap p-1 justify-start">
        {moveKeys.map(move => {
          return <DbEntry key={move} move={move} />
        })}
      </div>
      <div className="mt-10">
        <a
          // onClick={onClickYes}
          className="px-6 py-2  text-center text-white bg-violet-600 border border-violet-600 rounded active:text-violet-500 hover:bg-transparent hover:text-violet-600 focus:outline-none focus:ring"
          // href="/" 
         >
          Add Move
        </a>
      </div>
    </>
  )
}
