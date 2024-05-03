'use client'
const Move = ({move}: {move: string}) => {
  return (
    <>
      {move && (
        <div className="bg-slate-300 w-full py-3 flex flex-col items-center">
          <img
            className="w-full w-5/6"
            alt="move name"
            src={'https://dummyimage.com/600x400/000/fff'}
          />
          <div className="capitalize text-black">{move}</div>
        </div>
      )}
    </>
  )
}
export default Move
