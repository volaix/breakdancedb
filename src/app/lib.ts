
export type Flow = {
  entryMove: string
  keyMove: string
  exitMove: string
}

export const lsFlows= 'flows'
export const lsAllMoves = 'allMoves'
export const lsUserMoves = 'userMoves'
export const lsUserLearning = 'userLearning'

interface LocalStorageStructure {
  [lsFlows]: Flow[]
  [lsAllMoves]: string[]
  [lsUserMoves]: string[]
}

export type LocalStorageStructureKeys = keyof LocalStorageStructure

