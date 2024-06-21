'use server'

import { auth, signIn, signOut } from 'auth'

export const signInAction = async () => {
  await signIn()
}

export const signOutAction = async () => {
  console.log('trying to sign out')
  await signOut()
}

export const saveUser = async (userId: string, localStorage: {}) => {
  console.log('running saveuser')
  const session = await auth()
  try {
    const response = await fetch('https://api.example.com/data')
    if (!response.ok) {
      throw new Error('Failed to fetch data')
    }

    const data = await response.json()
    console.log(data)
  } catch (error) {
    console.error(error)
  }
}
