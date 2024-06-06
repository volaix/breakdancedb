import { z } from 'zod'
import {
  lsBattle,
  lsCombos,
  lsConcepts,
  lsDanceList,
  lsFlows,
  lsUserLearning,
  lsUserMoves,
} from './lsTypes'
import { validate } from 'uuid'

//------------------utility---------------
/**
 * Validates an identifier string against a specific prefix and logs if a legacy ID is used.
 *
 * @param {string} prefix - The prefix to validate the ID string against.
 * @param {string} id - The ID string to be validated.
 * @param {z.RefinementCtx} ctx - The context provided by the Zod validation library to add issues.
 */
const validateId = (prefix: string, id: string, ctx: z.RefinementCtx) => {
  const isValid =
    (id.startsWith(prefix) && validate(id.slice(prefix.length))) || validate(id)

  if (!isValid) {
    ctx.addIssue({
      code: 'custom',
      message: `Invalid ${prefix} format`,
    })
  } else if (validate(id) && !id.startsWith(prefix)) {
    console.log('Legacy ID used:', id)
    console.log(
      'Legacy ID is being deprecated, please update to use the new ID format.',
    )
  }
}

//===================IDS====================
export const MOVE_PREFIX = 'move-'
export const FLOW_PREFIX = 'flow-'
export const POSITION_PREFIX = 'position-'
export const COMBO_PREFIX = 'combo-'
export const ROUND_PREFIX = 'round-'
export const TRANSITION_PREFIX = 'transition-'
export const MOVEMENT_PREFIX = 'movement-'

// Schemas using the constants
export const moveIdSchema = z
  .string()
  .superRefine((id, ctx) => {
    validateId(MOVE_PREFIX, id, ctx)
  })
  .brand<'MoveId'>()

export const flowIdSchema = z
  .string()
  .superRefine((id, ctx) => {
    validateId(FLOW_PREFIX, id, ctx)
  })
  .brand<'FlowId'>()

export const positionIdSchema = z
  .string()
  .superRefine((id, ctx) => {
    validateId(POSITION_PREFIX, id, ctx)
  })
  .brand<'PositionId'>()

export const comboIdSchema = z
  .string()
  .superRefine((id, ctx) => {
    validateId(COMBO_PREFIX, id, ctx)
  })
  .brand<'ComboId'>()

export const roundIdSchema = z
  .string()
  .superRefine((id, ctx) => {
    validateId(ROUND_PREFIX, id, ctx)
  })
  .brand<'RoundId'>()

export const transitionIdSchema = z
  .string()
  .superRefine((id, ctx) => {
    validateId(TRANSITION_PREFIX, id, ctx)
  })
  .brand<'TransitionId'>()

export const movementIdSchema = z
  .string()
  .superRefine((id, ctx) => {
    validateId(MOVEMENT_PREFIX, id, ctx)
  })
  .brand<'MovementId'>()

//=============ROOT GLOBALS===============

//===========NESTED============
export const comboMoveSchema = z.object({
  moves: z.array(z.string()),
  id: z.union([
    moveIdSchema,
    flowIdSchema,
    transitionIdSchema,
    z.literal('custom'),
  ]),
  type: z.enum(['move', 'flow', 'transition', 'custom']),
})

export const comboValSchema = z.object({
  displayName: z.string(),
  notes: z.string(),
  execution: z.number(),
  sequence: z.array(comboMoveSchema),
})
export const comboDictionarySchema = z.record(comboIdSchema, comboValSchema)

export const listOrderSchema = z.union([
  z.object({
    type: z.literal('combo'),
    id: z.optional(z.string()),
    value: z.never().optional(),
  }),
  z.object({
    type: z.literal('customCombo'),
    id: z.never().optional(),
    value: z.string(),
  }),
])

export const RoundSchema = z.object({
  displayName: z.string(),
  rating: z.number(),
  id: roundIdSchema,
  comboList: listOrderSchema.array().optional(),
})

export const TransitionSchema = z.object({
  transitionId: transitionIdSchema,
  displayName: z.string(),
  oppositeSideSlowRating: z.number().optional(),
  from: positionIdSchema,
  to: positionIdSchema,
  slowRating: z.number(),
  normal: z.boolean(),
  fast: z.boolean(),
  possible: z.boolean(),
})

export const BasicFlowSchema = z.object({
  entryMove: z.string(),
  keyMove: z.string(),
  exitMove: z.string(),
})

export const TypeLoopOptions = z.object({
  hasOppositeSide: z.boolean().optional(),
  none: z.boolean().optional(),
  sameDirectionLoop: z.boolean().optional(),
})

export const MovementGroupSchema = z.object({
  movementId: movementIdSchema,
  displayName: z.string(),
  positionId: positionIdSchema.optional(), // Replace z.any() with the appropriate zod schema for PositionId
  transitionId: transitionIdSchema.optional(), // Replace z.any() with the appropriate zod schema for TransitionId
})

export const MoveExecutionSchema = z.object({
  memorised: z.boolean(),
  slow: z.boolean(),
  normal: z.boolean(),
  fast: z.boolean(),
})
export const PositionSchema = z.object({
  positionId: positionIdSchema,
  displayName: z.string(),
  imgUrl: z.string().nullable(),
  slowRating: z.number(),
  oppositeSideSlowRating: z.number().optional(),
  normal: z.boolean(),
  fast: z.boolean(),
})

export const MoveSchema = z.object({
  moveId: moveIdSchema,
  displayName: z.string(),
  displayImg: z.string().optional(),
  movements: z.array(MovementGroupSchema).optional(),
  positions: z.array(PositionSchema).optional(),
  transitions: z.array(TransitionSchema).optional(),
  moveExecution: MoveExecutionSchema.optional(),
  hasReverse: z.boolean().optional(),
  loopOption: TypeLoopOptions.optional(),
})

export const FlowDictionary = z.record(
  flowIdSchema,
  z.object({
    rating: z.number(),
    entryMove: z.object({
      displayName: z.string(),
      category: z.string(),
    }),
    keyMove: z.object({
      displayName: z.string(),
      category: z.string(),
    }),
    exitMove: z.object({
      displayName: z.string(),
      category: z.string(),
    }),
    notes: z.string().optional(),
  }),
)

export const GlobalStateProperties = z.object({
  [lsConcepts]: z.array(z.string()).optional(),
  [lsCombos]: comboDictionarySchema.optional(),
  [lsBattle]: z
    .object({
      categoryName: z.string(),
      rounds: z.array(RoundSchema),
      notes: z.string(),
    })
    .optional(),
  [lsFlows]: FlowDictionary.nullable(),
  [lsUserMoves]: z.record(z.array(z.string())),
  [lsUserLearning]: z.array(MoveSchema),
  [lsDanceList]: z.array(z.string()),
})

export const BasicMoveSchema = z.object({
  category: GlobalStateProperties.shape[lsUserMoves].keySchema,
  displayName: z.string(),
  id: z.never().optional(),
})
