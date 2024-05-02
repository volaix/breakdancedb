import HamburgerMenu from './HamburgerMenu'

const Profile = () => {
  return (
    <img
      className="w-5 h-5 rounded-full"
      src="https://dummyimage.com/64x64/000/fff"
      alt="Rounded avatar"
    />
  )
}
export default function Header() {
  return (
    <div
      className="
   fixed left-0 top-0 flex w-full justify-center
   border-b border-slate-300 bg-gradient-to-b
   from-slate-200 pb-2 pt-4 backdrop-blur-2xl
   dark:border-neutral-800 dark:bg-slate-800/30
   dark:from-inherit lg:static lg:w-auto  lg:rounded-xl
   lg:border lg:bg-slate-200 lg:p-4 lg:dark:bg-slate-800/30">
      <a className="font-mono font-bold" href="/">
        breakdanceDB
      </a>

      <div className="fixed left-2 top-3">
        <HamburgerMenu />
      </div>
      <div className="fixed right-2 top-3">
        <Profile />
      </div>
    </div>
  )
}
