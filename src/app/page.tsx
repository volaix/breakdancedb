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
import Image from 'next/image'
import React from 'react'


export default function RenderHome () {
  return (<div>hello world</div>)
}