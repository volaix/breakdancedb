'use client'
import { zustandLocalStorage } from './zustandLocalStorage'

export const updateUserDataClient = async () => {
  const zustandLocalStorageRef = localStorage[zustandLocalStorage]
  if (!zustandLocalStorageRef) {
    return console.error('cannot find breakdancedb data in your local storage.')
  }
  try {
    await fetch('/api/user', {
      method: 'PUT',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: zustandLocalStorageRef,
    })
      .then((response) => {
        if (response.status === 200) {
          console.log('user data updated successfully.')
          return
        } else {
          throw new Error('user data update failed.')
        }
      })
      .catch((error) => {
        throw error
      })
  } catch (error) {
    console.error(error)
  }
}
