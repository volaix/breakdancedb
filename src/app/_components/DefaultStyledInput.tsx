import { ChangeEvent } from 'react'
import { FieldValues, Path, UseFormRegister } from 'react-hook-form'

export default function DefaultStyledInput<T extends FieldValues>({
  defaultValue,
  register,
  registerName,
}: {
  defaultValue: string
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void
  registerName: string
  register: UseFormRegister<T>
}) {
  return (
    <input
      className="
            w-full rounded
            border
            border-gray-300
            bg-gray-100
            bg-opacity-50 px-3 py-1
            text-base leading-8 text-gray-700 outline-none
            transition-colors duration-200 ease-in-out
            focus:border-indigo-500 focus:bg-transparent focus:ring-2 focus:ring-indigo-200 dark:border-gray-700 
                dark:bg-gray-800 dark:bg-opacity-40 dark:text-gray-100 dark:focus:ring-indigo-900"
      type="text"
      defaultValue={defaultValue}
      {...register(`${registerName}` as Path<T>)}
    />
  )
}
