import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { Notification } from '../_components/Notification'
import { useZustandStore } from '../_utils/zustandLocalStorage'

type Inputs = {
  concepts: string
}

export default function Concepts() {
  // -------------state------------
  const [saveText, setSaveText] = useState('Save')
  const [notification, setNotification] = useState<null | {
    visible?: boolean
    message?: string
    timeShown?: number
  }>(null)
  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<Inputs>()
  const getLsConcepts = useZustandStore((state) => state.getLsConcepts)
  const setLsConcepts = useZustandStore((state) => state.setLsConcepts)

  // --------hooks-----------------
  //onload getsLsConcepts
  useEffect(() => {
    const lsConcepts = getLsConcepts()
    if (lsConcepts) {
      reset({ concepts: lsConcepts.join('\n') })
    }
  }, [getLsConcepts, reset])

  //Show Notifcation for 2 seconds
  useEffect(() => {
    const fadeOutTimer = setTimeout(
      () => setNotification({ visible: false }),
      notification?.timeShown || 2000,
    )
    return () => clearTimeout(fadeOutTimer)
  }, [notification?.timeShown, notification?.visible])

  //value of categoryMoves textarea
  const unsavedConcepts = watch('concepts', '')
  const sort = () => {
    reset({ concepts: unsavedConcepts.split('\n').sort().join('\n') })
  }

  //-------------render-----------
  return (
    <form
      onSubmit={handleSubmit((data) => {
        setLsConcepts(data.concepts.split(/\r\n|\r|\n/))
        setNotification({ message: 'Saved', visible: true })
        setSaveText('Saved!')
      })}
    >
      <article>
        <h2 className="text-sm capitalize leading-7 text-gray-600 dark:text-gray-400">
          {`Concepts`}
        </h2>
        {/* ---------------text area------------------------ */}
        <section className="flex max-w-xs space-x-4 p-4">
          {/* -----------------left textarea------------------- */}
          <textarea
            {...register('concepts')}
            className="h-32 w-8/12 max-w-fit resize-none rounded border border-gray-300 bg-gray-100 bg-opacity-50 px-3 py-1 text-xs text-gray-700 outline-none transition-colors duration-200 ease-in-out focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-200 dark:border-gray-700 dark:bg-gray-800 dark:bg-opacity-40 dark:text-gray-100 dark:focus:bg-gray-900 dark:focus:ring-indigo-900"
          />
          {/* --------------------right json view-------------------- */}
          <pre className="h-32 w-4/12 max-w-28 overflow-y-auto rounded-lg bg-gray-100 p-4 text-[10px] text-xs">
            {JSON.stringify(unsavedConcepts.split(/\r\n|\r|\n/), null, 1)}
          </pre>
        </section>
      </article>
      <Notification
        visible={!!notification?.visible}
        message={notification?.message || ''}
      />
      {/* -------------Buttons-------------- */}
      <section className="mt-5 flex w-full justify-center">
        {/* ----------sort button------- */}
        <button
          className="flex items-center justify-center rounded border border-indigo-500 px-8 py-2 text-center text-indigo-500 
 "
          onClick={(e) => {
            //prevents form submit
            e.preventDefault()
            sort()
          }}
        >
          <label className="text-lg leading-none">Sort</label>
        </button>
        {/* -------------Save Button------------------ */}
        <button
          // disabled={!saveButtonActive}
          type="submit"
          className="flex rounded border-0 bg-indigo-500 px-8 py-2 text-lg text-white hover:bg-indigo-600 focus:outline-none disabled:opacity-50"
        >
          {saveText}
        </button>
      </section>
      <p className="text-[7px]">
        sort button cannot be undone. Sorts current moves in alphabetical order
      </p>
      {/* ---------end of buttons--------- */}
    </form>
  )
}
