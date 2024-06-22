'use server'

import RenderCloudButtons from './RenderCloudButtons'
import RenderHero from './RenderHero'
import { auth } from '../../auth'
import { GET } from './api/user/route'

async function fetchLastEdited(): Promise<string> {
  try {
    const response = await GET()
    const user = await response?.json()
    return user?.editedAt || ''
  } catch (error) {
    console.error('Error fetching user date:', error)
    return ''
  }
}

const RenderHome = async () => {
  const session = await auth()
  const userLoggedIn: boolean = !!session?.expires
  const userDate: string = userLoggedIn ? await fetchLastEdited() : ''

  return (
    <div className="flex flex-col items-center">
      <RenderHero />
      <RenderCloudButtons
        userDate={userDate}
        userLoggedIn={!!session?.expires}
      />
    </div>
  )
}

export default RenderHome
