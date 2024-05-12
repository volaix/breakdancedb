import { LocalStorageStructure, lsUserMoves, lsUserLearning, lsFlows } from './localStorageTypes'


//-------------------------TYPE HELPERS-----------------------
/**
 * Brands a type by intersecting it with a type with a brand property based on
 * the provided brand string.
 * First Type passed is "your special string"
  eg used like: type PositionId = Brand<string, 'PositionId'>
 */

export type Brand<T, Brand extends string> = T & {
  readonly [B in Brand as `__${B}_brand`]: never
}
/**
 * Helper type function: Make optional fields required
 */

export type RequiredFields<T, K extends keyof T> = T & Required<Pick<T, K>>
/**
 * Helper: Makes only some things required
 */
type PartialBy<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>
/**
 * Helper that gets value of key in globalstorage
e.g. type lsUserMovesValue = lsValueByKey<typeof lsUserMoves>
 */
type lsValueByKey<T extends keyof LocalStorageStructure> = LocalStorageStructure[T]
export type lsValueMove = lsValueByKey<typeof lsUserMoves>
export type lsValueLearn = lsValueByKey<typeof lsUserLearning>
export type lsValueFlow = lsValueByKey<typeof lsFlows>
