'use client'

import Image from "next/image"

const Move = ({move}: {move: string}) => {
  return (
    <>
      {move && (
        <div className="bg-slate-300 dark:bg-gray-900 w-full py-3 flex flex-col items-center">
          <Image
      width="600"
      height="400"
            className="w-full w-5/6"
            alt="move name"
            src={'https://dummyimage.com/600x400/000/fff'}
          />
          <div className="capitalize text-black dark:text-white">{move}</div>
        </div>
      )}
    </>
  )
}
export default Move
