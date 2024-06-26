import router from 'next/router'
import { useEffect, useState } from 'react'
import { z } from 'zod'

import RenderThunder from '../_components/RenderChilli'
import { comboIdKey } from '../_utils/lib'
import { comboValSchema } from '../_utils/lsSchemas'
import { ComboId } from '../_utils/lsTypes'
import { useZustandStore } from '../_utils/zustandLocalStorage'
import MoveTag from './MoveTag'
import { ComboIdContext } from './page'

type ComboVal = z.infer<typeof comboValSchema>

export default function RenderCombo({
  comboId,
  comboIndex,
  comboVal,
}: {
  comboVal: ComboVal
  comboId: ComboId
  comboIndex: number
}) {
  const getComboSequence = useZustandStore((state) => state.getComboSequence)
  const deleteLsCombo = useZustandStore((state) => state.deleteLsCombo)

  const { displayName, notes, execution } = comboVal

  return (
    <tbody
      key={comboId}
      className="divide-gray-100 border-t border-gray-100  dark:border-gray-800"
    >
      <tr className="hover:bg-gray-50 dark:hover:bg-gray-800/20">
        {/* ------------COMBO NUMBER---------- */}
        <td className="flex gap-3 px-6 py-4 font-normal text-gray-900">
          <div className="text-sm">
            <div className="font-medium text-gray-700">
              Combo {comboIndex + 1}
            </div>
            <div className="text-gray-400">{displayName}</div>
          </div>
        </td>
        {/* ---------------MOVES------------ */}
        <td className="min-w-72 px-6 py-4 text-2xs ">
          {getComboSequence(comboId) &&
            getComboSequence(comboId).map(({ moves }, moveIndex) => {
              return (
                <ComboIdContext.Provider
                  value={{ comboId, moveIndex }}
                  key={moveIndex}
                >
                  <MoveTag moves={moves} />
                </ComboIdContext.Provider>
              )
            })}
        </td>
        {/* ----------------USABILITY------------- */}
        <td className="px-6 py-4">
          <div className="mt-2 inline-flex flex-row-reverse items-center justify-center gap-1 rounded-full bg-blue-50 px-2 py-1 text-xs font-semibold text-blue-600">
            {Array.from(Array(5)).map((_, i) => {
              return (
                <RenderThunder
                  onChange={() => {}}
                  key={i}
                  checked={i === 5 - execution}
                />
              )
            })}
          </div>
          {/* <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-semibold text-green-600 rounded-full bg-green-50">
                        <span className="h-1.5 w-1.5 rounded-full bg-green-600"></span>
                        Active
                      </span> */}
        </td>
        {/* -----------------ROLES------------- */}
        {/* <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-2">
                        <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-semibold text-blue-600 rounded-full bg-blue-50">
                          Design
                        </span>
                        <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-semibold text-indigo-600 rounded-full bg-indigo-50">
                          Product
                        </span>
                        <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-semibold rounded-full bg-violet-50 text-violet-600">
                          Develop
                        </span>
                      </div>
                    </td> */}
        {/* ----------------ACTIONS------------ */}
        <td className="px-6 py-4">
          <div className="flex justify-end gap-4">
            {/* delete button */}
            <a x-data="{ tooltip: 'Delete' }" href="#">
              <svg
                onClick={() => {
                  deleteLsCombo(comboId as ComboId)
                  updateCombos()
                }}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                className="h-6 w-6"
                x-tooltip="tooltip"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                />
              </svg>
            </a>
            {/* edit button */}
            <a x-data="{ tooltip: 'Edite' }" href="#">
              <svg
                onClick={(_) => {
                  console.log('move user to edit combo page')
                  router.push(`/combos/make?${comboIdKey}=${comboId}`)
                }}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                className="h-6 w-6"
                x-tooltip="tooltip"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125"
                />
              </svg>
            </a>
          </div>
        </td>
        {/* -------------------NOTES---------------- */}
        {/* <td className="px-6 py-4 min-w-60">
                      <div className="flex justify-end gap-4 text-xs">
                        {notes}
                      </div>
                    </td> */}
      </tr>
    </tbody>
  )
}
