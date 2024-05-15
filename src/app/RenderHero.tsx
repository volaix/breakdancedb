import Image from 'next/image'
import Link from 'next/link'

export default function RenderHero() {
  return (
    <section className="body-font text-gray-600">
      <div className="container mx-auto flex flex-col items-center px-5 pt-24 md:flex-row">
        <div className="mb-16 flex flex-col items-center text-center md:mb-0 md:w-1/2 md:items-start md:pr-16 md:text-left lg:flex-grow lg:pr-24">
          <h1 className="title-font mb-4 text-3xl font-medium text-gray-900 sm:text-4xl dark:text-white">
            BreakdanceDB
          </h1>
          <br className="hidden lg:inline-block" />
          <p className="mb-8 leading-relaxed text-xs">
            Ditch the scrapbook. Record your footworks. Practice systematically.
            Flow in the cypher. Remember sets. Welcome to your new breakdance
            database for footwork.
          </p>
          <div className="flex justify-center">
            <Link href={{ pathname: '/learnmoves' }}>
              <button className="inline-flex rounded border-0 bg-indigo-500 px-6 py-2 text-lg text-xs text-white hover:bg-indigo-600 focus:outline-none">
                Add Footworks
              </button>
            </Link>
            <Link href={{ pathname: '/learnflows' }}>
              <button className="ml-4 inline-flex rounded border-0 bg-gray-100 px-6 py-2 text-lg text-xs text-gray-700 hover:bg-gray-200 focus:outline-none">
                RNG Flows
              </button>
            </Link>
          </div>
        </div>
        <div className="w-5/6 md:w-1/2 lg:w-full lg:max-w-lg">
          <Image
            className="rounded object-cover object-center"
            alt="hero"
            width={720}
            height={600}
            src="https://dummyimage.com/720x600"
          />
        </div>
      </div>
    </section>
  )
}
