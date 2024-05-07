"use client";
import { useState, useEffect } from "react";
import {
  getUserLearning,
  useLocalStorage,
  Move,
  makeMove,
  lsUserLearning,
  updateLocalStorageGlobal,
} from "@/app/lib";
import { useMoveStore } from "./store";
import { makeTransitions } from "@/app/lib";
import { makePositions } from "@/app/lib";
import { makeDefaultTransitionNames } from "@/app/lib";

/**
 * Renders Save Button on New Move Page
 * @returns jsx
 */
export const RenderSaveButton = () => {
  const { moveName, positions } = useMoveStore();
  const [saveText, setSaveText] = useState<string>("Save");
  const [accessToLocalStorage, setAccessToLocalStorage] = useState(false);
  const [existingMoves, setExistingMoves] = useState<Move[]>([]);

  useLocalStorage(setAccessToLocalStorage);

  useEffect(() => {
    if (accessToLocalStorage) {
      setExistingMoves(getUserLearning());
    }
  }, [accessToLocalStorage]);

  const onSave = () => {
    if (accessToLocalStorage) {
      const lsPositions = makePositions(positions);
      updateLocalStorageGlobal[lsUserLearning](
        [
          ...existingMoves,
          makeMove({
            moveName,
            positions: lsPositions,
            transitions: makeTransitions({
              displayNames: makeDefaultTransitionNames(positions.length),
              positions: lsPositions,
            }),
          }),
        ],
        accessToLocalStorage,
      );
    }
    setSaveText("Saved");
    return;
  };
  return (
    <div className="w-full p-2">
      <button
        onClick={onSave}
        className="mx-auto flex rounded border-0 bg-indigo-500 px-8 py-2 text-lg text-white hover:bg-indigo-600 focus:outline-none"
      >
        {saveText}
      </button>
    </div>
  );
};
