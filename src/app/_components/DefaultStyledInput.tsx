import { ChangeEvent } from "react"
import { FieldValues, Path, UseFormRegister } from "react-hook-form"

export default function DefaultStyledInput<T extends FieldValues>(
    {
        defaultValue,
        register,
        registerName,
    }: {
        defaultValue: string,
        onChange?: (e: ChangeEvent<HTMLInputElement>) => void
        registerName: string
        register: UseFormRegister<T>
    }) {
    return (
        <input
            className="
            dark:bg-gray-800 dark:bg-opacity-40
            dark:border-gray-700
            dark:focus:ring-indigo-900
            dark:text-gray-100
            w-full bg-gray-100 bg-opacity-50
            rounded border border-gray-300 focus:border-indigo-500
            focus:bg-transparent focus:ring-2 focus:ring-indigo-200
            text-base outline-none text-gray-700 py-1 px-3 
                leading-8 transition-colors duration-200 ease-in-out"
            type="text"
            defaultValue={defaultValue}
            {...register((`${registerName}`) as Path<T>)}
        />
    )
}
