'use server'

import { signIn, signOut } from 'auth'

export const signInAction = async () => {
  await signIn()
}

export const signOutAction = async () => {
  await signOut()
}
