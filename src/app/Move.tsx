'use client'
//TODO: add move type so it wont crash on production lol
const Move = ({move}) => {
  return (
    <>
      {move && (
        <div className="bg-slate-300 w-full py-3 flex flex-col items-center">
          <img className="w-full w-5/6" alt="move name" src={move.cover_img} />
          <div className="capitalize">{move.move_name}</div>
        </div>
      )}
    </>
  )
}
export default Move
