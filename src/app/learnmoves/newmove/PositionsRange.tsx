'use client';
import { useState } from 'react';
import { Position } from './Position';

export const PositionsRange = () => {
  const [positions, setPositions] = useState<string>('6');
  const updatePositions = e => {
    setPositions(e.target.value);
  };
  const max = '20';
  return (
    <div className="shadow-lg p-6 w-full max-w-md">
      <div className="flex">
        <h2 className="text-2xl font-bold mb-4">Optional</h2>
        <div>switch</div>
      </div>
      <div className="mb-4">
        <label htmlFor="price-range" class="block text-gray-700 font-bold mb-2">
          Move Positions
        </label>
        <input
          type="range"
          id="price-range"
          className="w-full accent-indigo-500"
          min="1"
          max={max}
          value={positions}
          onInput={updatePositions} />
        <div className="text-xs">You can always edit positions again later</div>
      </div>
      <div className="flex justify-between text-gray-500">
        <span id="minPrice">{positions}</span>
        <span id="maxPrice">{max}</span>
      </div>
      <div className="mt-5">
        {[...Array(Number(positions))].map((e, i) => (
          <span className="" key={i}>
            <Position position={i + 1} />
          </span>
        ))}
      </div>
    </div>
  );
};
