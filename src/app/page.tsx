'use client'
// @format
import RenderHeader from './_components/Header'
import { useState, useEffect } from 'react'
import { safeJsonParse, useLocalStorage } from './_utils/lib'
import { lsFlows, lsUserMoves } from './_utils/localStorageTypes'
import { Flow } from './_utils/localStorageTypes'
import {
  getLocalStorageGlobal,
  setLocalStorageGlobal,
} from './_utils/accessLocalStorage'
import React from 'react'
import RenderHero from './RenderHero'
import RenderStep from './RenderSteps'

export default function RenderHome() {
  return (
    <div>
      <RenderHero />
      <RenderStep />
    </div>
  )
}
