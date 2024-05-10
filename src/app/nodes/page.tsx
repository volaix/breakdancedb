'use client'
import Header from '@/app/Header'
import { useState, useEffect } from 'react'

const Page = () => {
  // Set the value received from the local storage to a local state
  const [favoriteNumber, setFavoriteNumber] = useState('')

  useEffect(() => {
    let value
    // Get the value from local storage if it exists
    value = localStorage.getItem('favoriteNumber') || ''
    setFavoriteNumber(value)
  }, [])

  return (
    <>
      <Header />
      <div className="mt-20">
        <ul>6 step | 24 ways in | 12 ways out</ul>
        <ul>1 step | 24 ways in | 12 ways out</ul>
        <ul>6 step | 24 ways in | 12 ways out</ul>
        <ul>6 step | 24 ways in | 12 ways out</ul>
        <ul>6 step | 24 ways in | 12 ways out</ul>
        <ul>6 step | 24 ways in | 12 ways out</ul>
        <ul>6 step | 24 ways in | 12 ways out</ul>
        <ul>6 step | 24 ways in | 12 ways out</ul>
        <ul>6 step | 24 ways in | 12 ways out</ul>
        <ul>6 step | 24 ways in | 12 ways out</ul>
        <ul>6 step | 24 ways in | 12 ways out</ul>
      </div>
      <div className="mt-5">
        <a>view as nodes</a>
      </div>
      <div></div>
    </>
  )
}
export default Page
