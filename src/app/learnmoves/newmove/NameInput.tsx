"use client";
import { useMoveStore } from "./store";

export const RenderNameInput = () => {
  const { moveName, updateMove } = useMoveStore();
  const onChangeName = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log("e", e);
    updateMove(e.target.value);
  };

  return (
    <div className="relative text-xs">
      <label className="text-sm leading-7 text-gray-600 dark:text-gray-400">
        Move Name
      </label>
      <input
        value={moveName}
        onChange={onChangeName}
        type="text"
        className="w-full resize-none rounded border border-gray-300 bg-gray-100 bg-opacity-50 px-3 py-1 text-base leading-6 text-gray-700 outline-none transition-colors duration-200 ease-in-out focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-200 dark:border-gray-700 dark:bg-gray-800 dark:bg-opacity-40 dark:text-gray-100 dark:focus:bg-gray-900 dark:focus:ring-indigo-900"
      />
      recommended 1-3 words
    </div>
  );
};
