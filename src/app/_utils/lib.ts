import { Dispatch, SetStateAction, useEffect, useState } from 'react'

//---------------JS HELPERS-------------------
/**
 *
 * This function is responsible for handling parsing errors. If an error occurs during parsing, it will return undefined. Otherwise, it will return the parsed JSON value along with its corresponding data type.
 * @param toJsonParse requires a JSON string
 * @returns parsed JSON
 */
export const safeJsonParse = <T, F>(
  toJsonParse: string | null,
  fallback: F,
) => {
  //handling if toJsonParse is null
  if (!toJsonParse) return fallback as F
  try {
    const jsonValue: T = JSON.parse(toJsonParse)
    return jsonValue
  } catch {
    return fallback as F
  }
}

// -------------REACT CUSTOM HOOKS--------------------------
/**
 *
 * Helper Hook that checks if can access local storage
 */
export const useLocalStorage = (
  setAccessToLocalStorage: Dispatch<SetStateAction<boolean>>,
) => {
  useEffect(() => {
    setAccessToLocalStorage(typeof window !== 'undefined')
  }, [setAccessToLocalStorage])
}
