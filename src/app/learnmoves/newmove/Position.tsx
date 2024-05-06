'use client';
import rocks from '@/db/rocks.json';

export const Position = ({ position }: {position: number}) => {
  return (
    <div className="flex">
      <div className="mr-2"></div>
      <div className="relative text-xs">
        {null && (
          <label className="dark:text-gray-400 leading-7 text-sm text-gray-600">
            Move Name
          </label>
        )}
        <input
          type="text"
          id="name"
          defaultValue={`Position-${position}-${rocks[Math.floor(Math.random() * rocks.length)]}`}
          name="name"
          className="dark:text-gray-500 w-full bg-gray-100 bg-opacity-50 rounded border border-gray-300 focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 resize-none leading-6 transition-colors duration-200 ease-in-out dark:bg-gray-800 dark:bg-opacity-40 dark:border-gray-700 dark:focus:bg-gray-900 dark:focus:ring-indigo-900 dark:text-gray-100" />
      </div>
    </div>
  );
};
