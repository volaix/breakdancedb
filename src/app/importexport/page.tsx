'use client'

import { useState } from 'react'
import {
  useZustandStore,
  zustandLocalStorage,
} from '../_utils/zustandLocalStorage'

export default function RenderImportExport() {
  //------------------------state------------------------
  const [successMessage, setSuccessMessage] = useState<string>('')
  const [importActive, setImportActive] = useState<boolean>(false)
  const [file, setFile] = useState<FileReader | null>(null)
  const replaceGlobalState = useZustandStore(
    (state) => state.replaceGlobalState,
  )
  const resetGlobalState = useZustandStore((state) => state.resetGlobalState)

  //----------------------handlers------------------------

  /**
   * Imports file to local storage
   * @param event
   * @returns
   */
  const handleImport: React.MouseEventHandler<HTMLButtonElement> = (event) => {
    if (file && file.result) {
      //error handling
      if (file.result instanceof ArrayBuffer)
        return console.error('ArrayBuffer is not supported')

      //sets in zustand global
      replaceGlobalState(JSON.parse(JSON.parse(file.result))) //intentionally json.parse x2
      setSuccessMessage('successfully loaded')
    }
  }

  const finishedLoading = (event: ProgressEvent<FileReader>) => {
    console.log('file finished loading')
    setImportActive(true)
  }

  /**
   * Check if file has changed. If so, enables the import button
   * @param
   */
  const handleFileLoaded = (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      const files = event.target.files
      console.log('File Loaded', files)
      if (files?.length) {
        const fileReader = new FileReader()
        fileReader.readAsText(files[0])
        fileReader.onloadend = finishedLoading
        setFile(fileReader)
      }
    } catch (error) {
      console.error('Error handling input change:', error)
    }
  }

  //creates an anchor element, uses the download property, then removes itself
  const handleDownload = () => {
    if (!localStorage[zustandLocalStorage])
      return console.error(
        'cannot find breakdancedb data in your local storage.',
      )

    const localStorageContent = JSON.stringify(
      localStorage[zustandLocalStorage],
    )
    const blob = new Blob([localStorageContent], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'breakdancedb-data.json'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  //clears localstorage
  const handleClear = () => {
    localStorage.clear()
    resetGlobalState()

    alert('Local Storage Cleared')
  }
  //-----------------------render------------------------
  return (
    <div className="mt-24">
      <h1 className="title-font mb-4 text-center text-2xl font-medium text-gray-900 sm:text-3xl dark:text-white">
        Import & Export Data
      </h1>
      <div className="flex flex-col items-center justify-center text-xs">
        <div className="mb-10 px-5 text-center">
          Import and Export your data for offline storage, saving, or
          transferring from one device to another.
        </div>
        {/* -----------spacer-------------- */}
        <div className="mb-4 mt-2 flex w-10 justify-center">
          <div className="inline-flex h-1 w-16 rounded-full bg-indigo-500"></div>
        </div>
        <div className="text-base text-black dark:text-white">Import</div>
        <div className="mt-4 flex flex-col items-center justify-center">
          <input type="file" accept=".json" onChange={handleFileLoaded} />
          {successMessage && <pre>{successMessage}</pre>}
        </div>
        <button
          disabled={!importActive}
          className="disabled:bg-grey-400 disabled:text-grey m-2 w-2/3 rounded border-0 bg-indigo-500 px-6 py-2 text-center text-white focus:outline-none disabled:opacity-75"
          onClick={handleImport}
        >
          Replace localStorage
        </button>
        {/* -----------spacer-------------- */}
        <div className="mb-4 mt-2 flex w-10 justify-center">
          <div className="inline-flex h-1 w-16 rounded-full bg-indigo-500"></div>
        </div>
        <div className="text-base text-black dark:text-white">Export</div>
        <button
          className=" m-2 w-2/3 rounded border-0 bg-indigo-500 px-6 py-2 text-center text-white hover:bg-indigo-600 focus:outline-none"
          onClick={handleDownload}
        >
          Export localStorage
        </button>
        {/* -----------spacer-------------- */}
        <div className="mb-4 mt-2 flex w-10 justify-center">
          <div className="inline-flex h-1 w-16 rounded-full bg-indigo-500"></div>
        </div>
        <button
          className=" m-2 w-2/3 rounded border-0 bg-red-500 px-6 py-2 text-center text-white focus:outline-none"
          onClick={handleClear}
        >
          Clear localStorage
        </button>
      </div>
    </div>
  )
}
