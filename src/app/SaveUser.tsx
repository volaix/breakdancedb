'use client'

import { Session } from 'next-auth'
import React, { MouseEvent } from 'react'

const RenderSaveUser = ({ session }: { session: Session | null }) => {
  const handleSave = async () => {
    const submitData = { session }
    try {
      const res = await fetch('http://localhost:3000/api/saveUser', {
        method: 'POST',
        body: JSON.stringify(submitData),
        headers: {
          'content-type': 'application/json',
        },
      })
      console.log(res)
      if (res.ok) {
        console.log('Submitted Correctly')
      } else {
        console.log('Oops! Something is wrong.')
      }
    } catch (error) {
      console.log(error)
    }
  }

  return <button onClick={() => handleSave()}>Save your Data</button>
}

export default RenderSaveUser
