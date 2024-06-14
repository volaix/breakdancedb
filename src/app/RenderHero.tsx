import Link from 'next/link'

export default function RenderHero() {
  return (
    <section className="body-font text-gray-600">
      <div className="container mx-auto flex max-w-xs flex-col items-center px-5 pt-24">
        <div className="flex flex-col items-center text-center">
          <h1 className="title-font mb-4 text-3xl font-medium text-gray-900 sm:text-4xl dark:text-white">
            BreakdanceDB
          </h1>
          <br className="hidden lg:inline-block" />
          <p className="mb-8 text-xs leading-relaxed">
            Ditch the scrapbook. Practice systematically. Connect every move, to
            every other move. Remember your combos.
          </p>
          <div className="flex justify-center">
            <Link href={{ pathname: '/learnmoves' }}>
              <button className="inline-flex rounded border-0 bg-indigo-500 px-6 py-2 text-xs text-white hover:bg-indigo-600 focus:outline-none">
                Add Moves
              </button>
            </Link>
            <Link href={{ pathname: '/learnflows' }}>
              <button
                className="ml-4 inline-flex rounded border-0 bg-gray-100 px-6 py-2 text-xs text-gray-700 
  hover:bg-gray-200 focus:outline-none"
              >
                RNG Flows
              </button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
