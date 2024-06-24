'use server'

import { signIn, signOut } from 'auth'

export const signInAction = async () => {
  console.log('signinaction, signing in')
  await signIn()
}

export const signOutAction = async () => {
  console.log('trying to sign out')
  await signOut()
}
