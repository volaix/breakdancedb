'use server'

import { auth, signIn, signOut } from 'auth'
import dbClientPromise from '../../db/mongodb'

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

export const connectedToMongo = async () => {
  try {
    await dbClientPromise.connect()
    return {
      props: { isConnected: true },
    }
  } catch (e) {
    console.error(e)
    return {
      props: { isConnected: false },
    }
  }
}
