'use client';
import { useMoveStore } from './store';

export const NameInput = () => {
  //TODO update input value to zustand
  // const useMoveStore = create<moveStore>()(set => ({
  //   moveName: 'helloworld',
  //   updateMove: newText => set(state => ({bears: newText})),
  // }))
  const { moveName, updateMove } = useMoveStore();
  const onChangeName = (e) => {
    //synthetic base event
    console.log('e', e);
    updateMove(e.target.value);
  };

  return (
    <div className="relative text-xs">
      <label className="dark:text-gray-400 leading-7 text-sm text-gray-600">
        Move Name
      </label>
      <input
        value={moveName}
        onChange={onChangeName}
        type="text"
        id="name"
        name="name"
        className="w-full bg-gray-100 bg-opacity-50 rounded border border-gray-300 focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 resize-none leading-6 transition-colors duration-200 ease-in-out dark:bg-gray-800 dark:bg-opacity-40 dark:border-gray-700 dark:focus:bg-gray-900 dark:focus:ring-indigo-900 dark:text-gray-100" />
      recommended 1-3 words
    </div>
  );
};
