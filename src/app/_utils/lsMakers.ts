import { v4 } from 'uuid'
import {
  MoveId,
  PositionId,
  TransitionId,
  Position,
  Transition,
  Transitions,
  MovementGroup,
  MovementId,
} from './localStorageTypes'

// ------------------------makers-----------------------------

export const makeMoveId = (): MoveId => {
  return v4() as MoveId
}
export const makePositionId = (): PositionId => {
  return v4() as PositionId
}
export const makeTransitionId = (): TransitionId => {
  return v4() as TransitionId
}
export const makeMovementId = (): MovementId => {
  return v4() as MovementId
}

/**
 * makes a default position value
 * @param displayName: string
 * @returns
 */

export const makeDefaultPosition = ({
  displayName,
}: {
  displayName: string
}): Position => {
  return {
    displayName,
    positionId: makePositionId(),
    imgUrl: null,
    slowRating: 0,
    normal: false,
    fast: false,
  }
}

/**
 * Makes default Transition
 * @param
 * @returns
 */
export const makeDefaultTransition = ({
  displayName,
  from,
  to,
}: {
  displayName: string
  from: PositionId
  to: PositionId
}): Transition => {
  return {
    displayName,
    transitionId: makeTransitionId(),
    from,
    to,
    slowRating: 0,
    normal: false,
    fast: false,
    possible: true,
  }
}
/**
 *
 * Make move transitions
 * @returns Transitions
 */

export const makeTransitions = ({
  displayNames,
  positions,
}: {
  displayNames: string[]
  positions: Position[]
}): Transitions => {
  /**
   * gets position id using position[] and current index
   * @param {Position[]} posArray
   * @param {number} currIndex
   * @return positionid (a special string)
   */
  const getPositionId = (posArray: Position[], currIndex: number) => {
    const isLastThing = currIndex + 1 === posArray.length
    if (isLastThing) {
      return posArray[0].positionId
    } else {
      return posArray[currIndex].positionId
    }
  }
  //final
  return positions.map((position, index, posArray) => {
    return makeDefaultTransition({
      displayName: displayNames[index],
      from: position.positionId,
      to: getPositionId(posArray, index),
    })
  })
}
/**
 * makes default Positions using array of strings
 * @param displayNames
 * @returns position[]
 */

export const makePositions = (displayNames: string[]): Position[] =>
  displayNames.map((displayName) => makeDefaultPosition({ displayName }))
/**
 *  makes default names for transitions
 * @param numberOfTransitions
 * @returns string array
 */

export const makeDefaultTransitionNames = (
  numberOfTransitions: number,
): string[] =>
  Array.from(Array(numberOfTransitions)).map(
    (_, i) => `From Pos${i + 1} to Pos${i + 2}`,
  )

/**
 * Reorders positions and transitions into the correct display order for learnmoves/move/learn page
 * @param positions Position[]
 * @param transitions Transition[]
 * @returns [] of Position, Transition
 */
export const makeDefaultMovementGroupArr = (
  positions: Position[] = [],
  transitions: Transition[] = [],
): MovementGroup[] => {
  //return early if empty arr is given
  if (positions.length === 0) return []
  if (transitions.length === 0) return []

  const lastTransition = transitions[transitions.length - 1]

  //manually type first and last movements as they have different elements to the rest
  const baseArr: MovementGroup[] = [
    {
      displayName: 'First-Movement',
      positionId: positions[0].positionId,
      movementId: makeMovementId(),
    },
    {
      movementId: makeMovementId(),
      displayName: 'Loop-Movement',
      transitionId: lastTransition.transitionId,
    },
  ]
  //get rid of the first and last of positions as these are manually made in base arr.
  const removedFirstAndLast = positions.filter(
    (a, i) => !(i === positions.length || i === 0),
  )

  //insert a formatted Movement[] inside baseArr
  return baseArr.toSpliced(
    1,
    0,
    ...removedFirstAndLast.map((a, i) => {
      //i is 0 based index
      return {
        movementId: makeMovementId(),
        displayName: `movement-group-${i + 2}`,
        positionId: a.positionId,
        transitionId: transitions[i].transitionId,
      }
    }),
  )
}
