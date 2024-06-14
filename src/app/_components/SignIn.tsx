'use server'
import { useEffect } from 'react'
import { signInAction, signOutAction } from '../_utils/actions'
import { auth } from '../../../auth'

export const SignIn = async () => {
  const session = await auth()
  console.log('session: ', session)
  return (
    <>
      {!session ? (
        <form action={signInAction}>
          <button className="border" type="submit">
            Sign in
          </button>
        </form>
      ) : (
        <div> you are signed in</div>
      )}
      <form action={signOutAction}>
        <button type="submit">Sign Out</button>
      </form>
    </>
  )
}
