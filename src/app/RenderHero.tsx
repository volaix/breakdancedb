'use server'
import { auth } from '../../auth'
import RenderSaveUser from './SaveUser'
import { signInAction, signOutAction } from './_utils/actions'

export default async function RenderHero() {
  const session = await auth()
  const sessionExists = session?.expires

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
      <article className="flex flex-col justify-center text-center">
        <form
          className=""
          action={!sessionExists ? signInAction : signOutAction}
        >
          <button
            type="submit"
            className="focus-visible:ring-ring bg-background hover:bg-accent hover:text-accent-foreground inline-flex  h-9 items-center justify-center whitespace-nowrap rounded bg-indigo-500 px-6 py-2 text-xs text-white shadow-sm transition-colors hover:bg-indigo-600 focus:outline-none focus-visible:outline-none focus-visible:ring-1 disabled:pointer-events-none disabled:opacity-50"
          >
            {`${!sessionExists ? 'Sign in' : 'Sign out'}`}
          </button>
        </form>
        {!sessionExists && (
          <p className="text-xs leading-none">Or continue in offline mode</p>
        )}
        {sessionExists && (
          <section className="flex w-full flex-col">
            <p>All your info:</p>
            <pre className="max-w-60 overflow-auto break-words break-all bg-slate-200 text-xs  leading-none">
              {JSON.stringify(session, null, 3)}
            </pre>
          </section>
        )}
        {false && sessionExists && <RenderSaveUser session={session} />}
      </article>
    </section>
  )
}
