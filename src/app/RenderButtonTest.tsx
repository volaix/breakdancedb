'use client'

import { useCallback, useEffect, useState } from 'react'
import { PrimaryButton } from './_components/Button'
import { GET } from './api/movies/route'

export type NextUser = {
  id: string
  name: string
  payload: string
}

export default function RenderButtonTest() {
  const [movies, setMovies] = useState()

  const readMovies = async () => {
    const itemListRes = await fetch('/api/movies')
    const data = await itemListRes.json()
    setMovies(data.data)
  }
  const createMovies = async () => {
    fetch('/api/movies', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id: 'uniqueId',
        name: 'initial name',
        payload: 'initial payload',
      } as NextUser),
    })
  }
  const updateMovies = async () => {
    fetch('/api/movies', {
      method: 'PUT',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id: 'uniqueId',
        name: 'third name',
        payload: 'third payload',
      } as NextUser),
    })
  }
  const deleteMovie = async () => {
    fetch('/api/movies', {
      method: 'DELETE',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id: 'uniqueId' }),
    })
  }

  return (
    <>
      <button onClick={createMovies}>CREATE</button>
      <button onClick={readMovies}>READ</button>
      <button onClick={updateMovies}>UPDATE</button>
      <button onClick={deleteMovie}>DELETE</button>
    </>
  )
}
