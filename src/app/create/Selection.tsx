import { useState } from 'react'
import ExistingMoves from './ViewExistingMoves'

export default function Selection({ modifier }: { modifier?: true }) {
  const [selectedModifierType, setSelectedModifierType] = useState<
    'existingMove' | 'learningMove' | 'custom'
  >('existingMove')
  const [moveOrConcept, setMoveOrConcept] = useState<'move' | 'concept'>('move')

  return (
    <article>
      {/* --------radios---------- */}
      <section className="pb-2">
        {/* -------move or concept radio-------- */}
        <section>
          <label>
            Use Move
            <input
              className="ml-1"
              type="radio"
              checked={moveOrConcept === 'move'}
              name={modifier ? 'modifier' : 'base'}
              value="move"
              onChange={(e) => setMoveOrConcept(e.target.value as 'move')}
            />
          </label>
          <label className="ml-4">
            Use Concept
            <input
              className="ml-1"
              type="radio"
              checked={moveOrConcept === 'concept'}
              name={modifier ? 'modifier' : 'base'}
              value="concept"
              onChange={(e) => setMoveOrConcept(e.target.value as 'concept')}
            />
          </label>
        </section>
        {/* ---------move options------------- */}
        {moveOrConcept === 'move' && (
          <section className="flex justify-around text-xs">
            <label>
              Existing Move
              <input
                className="ml-1"
                type="radio"
                checked={selectedModifierType === 'existingMove'}
                name={modifier ? 'modifierType' : 'baseType'}
                value="existingMove"
                onChange={(e) =>
                  setSelectedModifierType(e.target.value as 'existingMove')
                }
              />
            </label>
            <label>
              Custom
              <input
                className="ml-1"
                type="radio"
                name={modifier ? 'modifierType' : 'baseType'}
                value="custom"
                onChange={(e) =>
                  setSelectedModifierType(e.target.value as 'custom')
                }
                checked={selectedModifierType === 'custom'}
              />
            </label>
          </section>
        )}
      </section>
      {/* ================INPUTS================ */}
      <section>
        {/* -----------move display---------- */}
        {moveOrConcept === 'move' && (
          <section>
            {/* ----------existing move-------- */}
            <article className="">
              {selectedModifierType === 'existingMove' && <ExistingMoves />}
            </article>
            {/* ----------concept display-------- */}
            <article>
              {selectedModifierType === 'custom' && (
                <input
                  className="w-full rounded border border-gray-300 bg-gray-100 bg-opacity-50 px-3 py-1 text-xs leading-8 text-gray-700 outline-none transition-colors duration-200 ease-in-out focus:border-indigo-500 focus:bg-transparent focus:ring-2 focus:ring-indigo-200 dark:border-gray-700 dark:bg-gray-800 dark:bg-opacity-40 dark:text-gray-100 dark:focus:ring-indigo-900"
                  type="text"
                  placeholder="Custom Move"
                />
              )}
            </article>
          </section>
        )}
        {moveOrConcept === 'concept' && (
          <input
            className="w-full rounded border border-gray-300 bg-gray-100 bg-opacity-50 px-3 py-1 text-xs leading-8 text-gray-700 outline-none transition-colors duration-200 ease-in-out focus:border-indigo-500 focus:bg-transparent focus:ring-2 focus:ring-indigo-200 dark:border-gray-700 dark:bg-gray-800 dark:bg-opacity-40 dark:text-gray-100 dark:focus:ring-indigo-900"
            type="text"
            placeholder="custom concept"
          />
        )}
      </section>
    </article>
  )
}
