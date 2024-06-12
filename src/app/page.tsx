'use client'
import { useEffect, useState } from 'react'
// @format
import RenderHero from './RenderHero'
import RenderStep from './RenderSteps'

export default function RenderHome() {
  // const [data, setData] = useState(null)

  return (
    <div className="mt-20 flex flex-col items-center">
      {false && (
        <>
          <h1>Data from Backend:</h1>
          <button
            className="border stroke-black"
            onClick={() => {
              console.log('FE Running fetch')
              // fetch('/api/hey')
              fetch('/api/mongodb')
                .then((response) => {
                  if (!response.ok) {
                    throw new Error('Network response was not ok')
                  }
                  return response.json()
                })
                .then((data) => {
                  console.log('data after json()', data)
                  // setData(data)
                })
                .catch((error) => console.error('Error fetching data:', error))
            }}
          >
            get data
          </button>
          {/* <pre>{JSON.stringify(data, null, 2)}</pre> */}
        </>
      )}
      <RenderHero />
      <RenderStep />
    </div>
  )
}
