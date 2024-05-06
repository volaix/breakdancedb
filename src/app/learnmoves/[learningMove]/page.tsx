'use client'
import Header from '@/app/Header'
import {useState, useEffect} from 'react'
import {lsUserLearning} from '@/app/lib'
import Link from 'next/link'

const LearnMove = () => {
  const [accessToLocalStorage, setAccessToLocalStorage] = useState(false)
  const [learning, setLearning] = useState([])

  const StaticImage = () => {
    return <div>One position at a time</div>
  }

  const existingMoves = [] //TODO get this using localStorage

  useEffect(() => {
    setAccessToLocalStorage(typeof window !== 'undefined')
  }, [])

  //get learning moves
  useEffect(() => {
    if (accessToLocalStorage) {
      setLearning(JSON.parse(localStorage.getItem(lsUserLearning)))
    }
  }, [accessToLocalStorage])

  const moveName = 'getmefromURL?'

  return (
    <div className="mt-20">
      <div></div>
      <h1>{moveName}</h1>
      <p>
        Remember Assign Name ALl positions in move so dont need to check what it
        is when learning
      </p>
      <h1>static poses</h1>
      <h1>list of poses</h1>
      <h1>5 stars</h1>
      <h1>SLOW</h1>
      <p>
        Slow defined as > 60mpm (moves per minute) or no faster than 1 move per
        second{' '}
      </p>
      <p>Feel 4/5 stars comforatble before moving on</p>
      <h1>static poses and dance</h1>
      <h1>list of poses</h1>
      <h1>5 stars</h1>
      <StaticImage/>
    </div>
  )
}

const Page = () => {
  return (
    <div>
      <Header />
      <LearnMove />
    </div>
  )
}

export default Page
