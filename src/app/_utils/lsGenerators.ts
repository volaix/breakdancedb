import { v4, validate } from 'uuid'
import {
  COMBO_PREFIX,
  FLOW_PREFIX,
  MOVEMENT_PREFIX,
  POSITION_PREFIX,
  ROUND_PREFIX,
  TRANSITION_PREFIX,
} from './lsSchemas'

import {
  ComboId,
  FlowId,
  MoveId,
  MovementGroup,
  MovementId,
  Position,
  PositionId,
  RoundId,
  Transition,
  PositionTransitionId as PositionTransitionId,
  Transitions,
  MoveTransitionId,
} from './lsTypes'
import { MOVE_PREFIX } from './lsSchemas'

// ------------------------validators-----------------------------

const uuidPattern =
  '[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}'

//==================LEGACY IDS EXIST IN STATE==============
export const isLegacyId = (id: string = ''): boolean => {
  return validate(id) === true
}
export const isFlowId = (id: string): id is FlowId => {
  return new RegExp(`^flow-${uuidPattern}$`).test(id)
}

// ------------------------ID GENERATORS-----------------------------

export const makeMoveId = (): MoveId => {
  return `${MOVE_PREFIX}${v4()}` as MoveId
}

export const makeFlowId = (): FlowId => {
  return `${FLOW_PREFIX}${v4()}` as FlowId
}

export const makePositionId = (): PositionId => {
  return `${POSITION_PREFIX}${v4()}` as PositionId
}

export const makeComboId = (): ComboId => {
  return `${COMBO_PREFIX}${v4()}` as ComboId
}

export const makeRoundId = (): RoundId => {
  return `${ROUND_PREFIX}${v4()}` as RoundId
}

export const makePositionTransitionId = (): PositionTransitionId => {
  return `${TRANSITION_PREFIX}${v4()}` as PositionTransitionId
}
export const makeMoveTransitionId = (): MoveTransitionId => {
  return `${TRANSITION_PREFIX}${v4()}` as MoveTransitionId
}

export const makeMovementId = (): MovementId => {
  return `${MOVEMENT_PREFIX}${v4()}` as MovementId
}

/**
 * makes a default position value
 * @param displayName: string
 * @returns
 */

export const makeDefaultPosition = ({
  displayName,
  positionId = makePositionId(),
  slowRating = 0,
  oppositeSideSlowRating = 0,
}: {
  displayName: string
  positionId?: PositionId
  oppositeSideSlowRating?: number
  slowRating?: number
}): Position => {
  return {
    displayName,
    positionId,
    slowRating,
    oppositeSideSlowRating,
    imgUrl: null,
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
  slowRating = 0,
  transitionId,
  oppositeSideSlowRating = 0,
}: {
  displayName: string
  oppositeSideSlowRating?: number
  from: PositionId
  to: PositionId
  slowRating?: number
  transitionId: PositionTransitionId
}): Transition => {
  return {
    displayName,
    transitionId,
    oppositeSideSlowRating,
    from,
    to,
    slowRating,
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
      transitionId: makePositionTransitionId(),
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
 * Reorders positions and transitions into the correct display order for learnmoves/data/study page
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
