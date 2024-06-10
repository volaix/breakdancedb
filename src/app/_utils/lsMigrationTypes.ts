import { BasicFlow } from './lsTypes'
import {
  lsFlows,
  FlowDictionary,
  lsUserMoves,
  lsToprock,
  lsFootwork,
  lsPower,
  lsFreezes,
  lsDrops,
  lsUserLearning,
  Move,
  lsDanceList,
} from './lsTypes'

//==============MIGRATION STATES==================
/**
 * validator if state is version 0 of globalstateproperties
 * @param state localstorage
 * @param version state version
 * @returns boolean
 */

export const isGlobalStateV0 = (
  state: unknown,
  version: number,
): state is GlobalStatePropertiesV0 => {
  //wow this is a lazy validation. it'd be nice if zod was used in future to parse
  if (version === 0) {
    return true
  } else return false
}
/**
 * validator if state is version 0 of globalstateproperties
 * @param state localstorage
 * @param version state version
 * @returns boolean
 */

export const isGlobalStateV2 = (
  state: unknown,
  version: number,
): state is {
  [lsFlows]: FlowDictionary | null
  [lsUserMoves]: {
    [lsToprock]: string[]
    [lsFootwork]: string[]
    [lsPower]: string[]
    [lsFreezes]: string[]
    [lsDrops]: string[]
  }
  [lsUserLearning]: Move[]
  [lsDanceList]: string[]
} => {
  //wow this is a lazy validation. it'd be nice if zod was used in future to parse
  if (version === 2) {
    return true
  } else return false
}

type GlobalStatePropertiesV0 = {
  [lsFlows]: BasicFlow[]
  [lsUserMoves]: string[]
  [lsUserLearning]: Move[]
  [lsDanceList]: string[]
}
