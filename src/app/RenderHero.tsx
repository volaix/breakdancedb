'use server'

export default async function RenderHero() {
  // ---------------------------render---------------------------
  return (
    <section className="body-font container mx-auto flex max-w-xs flex-col items-center px-5 pt-24 text-gray-600">
      <hgroup className="flex flex-col items-center text-center">
        <h1 className="title-font mb-4 text-3xl font-medium text-gray-900 sm:text-4xl dark:text-white">
          BreakdanceDB
        </h1>
        <br className="hidden lg:inline-block" />
        <p className="mb-8 text-xs leading-relaxed">
          Practice systematically. Connect all moves. Remember combos.
        </p>
      </hgroup>
    </section>
  )
}
