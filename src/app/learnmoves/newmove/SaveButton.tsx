'use client';
import { useState, useEffect } from 'react';
import { lsUserLearning } from '@/app/lib';
import { useMoveStore } from './store';

export const SaveButton = () => {
  const { moveName } = useMoveStore();
  console.log('zustand movename is', moveName);

  const [saveText, setSaveText] = useState<string>('Save');
  const [accessToLocalStorage, setAccessToLocalStorage] = useState(false);
  const [existingMoves, setExistingMoves] = useState([]);

  useEffect(() => {
    setAccessToLocalStorage(typeof window !== 'undefined');
  }, []);

  useEffect(() => {
    if (accessToLocalStorage) {
      setExistingMoves(JSON.parse(localStorage.getItem(lsUserLearning) || '') || [])
    }
  }, [accessToLocalStorage])

  const onSave = () => {
    if (accessToLocalStorage)
      localStorage.setItem(
        lsUserLearning,
        JSON.stringify([...existingMoves, moveName])
      );
    setSaveText('Saved');
    return;
  };
  return (
    <div className="p-2 w-full">
      <button
        onClick={onSave}
        className="flex mx-auto text-white bg-indigo-500 border-0 py-2 px-8 focus:outline-none hover:bg-indigo-600 rounded text-lg">
        {saveText}
      </button>
    </div>
  );
};
