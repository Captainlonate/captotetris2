import { fifteenPercentChance } from '../../utils/random'

export const BlockTypes = {
  CEMENT: 'CEMENT',
  TRANSPARENT: 'TRANSPARENT',
  NORMAL: 'NORMAL',
  BREAKER: 'BREAKER'
}

export const BlockTypesInfo = {
  [BlockTypes.CEMENT]: {
    isBreakable: false,
    isStone: true,
    isBreaker: false
  },
  [BlockTypes.TRANSPARENT]: {
    isBreakable: false,
    isStone: true,
    isBreaker: false
  },
  [BlockTypes.NORMAL]: {
    isBreakable: true,
    isStone: false,
    isBreaker: false
  },
  [BlockTypes.BREAKER]: {
    isBreakable: true,
    isStone: false,
    isBreaker: true
  }
}

export const isValidBlockType = (possible) => Boolean(BlockTypes[possible])

// Cement -> Transparent -> Normal
export const getNextBlockType = (currentBlockType) => {
  let nextBlockType = currentBlockType

  switch (currentBlockType) {
    case BlockTypes.CEMENT:
      nextBlockType = BlockTypes.TRANSPARENT
      break
    case BlockTypes.TRANSPARENT:
      nextBlockType = BlockTypes.NORMAL
      break
    default:
      break
  }

  return nextBlockType
}

export const chanceToGetBreaker = () => (
  fifteenPercentChance() ? BlockTypes.BREAKER : BlockTypes.NORMAL
)
