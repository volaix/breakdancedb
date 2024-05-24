'use client'
// @format
import RenderHero from './RenderHero'
import RenderStep from './RenderSteps'

export default function RenderHome() {
  return (
    <div className="flex flex-col items-center">
      <RenderHero />
      <RenderStep />
    </div>
  )
}
