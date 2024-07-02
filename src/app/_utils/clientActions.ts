'use client'
import { zustandLocalStorage } from './zustandLocalStorage'

export const UPLOAD_USER = 'UPLOAD_USER'
export const DOWNLOAD_USER = 'DOWNLOAD_USER'

export const updateUserDataClient = async () => {
  const zustandLocalStorageRef = localStorage[zustandLocalStorage]
  if (!zustandLocalStorageRef) {
    return console.error('cannot find breakdancedb data in your local storage.')
  }
  const response = await fetch('/api/user', {
    method: 'PUT',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: zustandLocalStorageRef,
  })
  if (!response.ok) {
    throw new Error('Network response was not ok')
  }
  return response
}

export const downloadUserData = async () => {
  const user = await fetch('/api/user')
  return await user.json()
}
