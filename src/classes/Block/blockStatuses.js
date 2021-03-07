export const BLOCKSTATUSES = {
  CEMENT: 'opaque_cement',
  TRANSPARENT: 'transparent_cement',
  NORMAL: 'normal',
  BREAKER: 'breaker'
}

export const BLOCKTYPES = {
  [BLOCKSTATUSES.CEMENT]: {
    isBreakable: false,
    isStone: true,
    isBreaker: false
  },
  [BLOCKSTATUSES.TRANSPARENT]: {
    isBreakable: false,
    isStone: true,
    isBreaker: false
  },
  [BLOCKSTATUSES.NORMAL]: {
    isBreakable: true,
    isStone: false,
    isBreaker: false
  },
  [BLOCKSTATUSES.BREAKER]: {
    isBreakable: true,
    isStone: false,
    isBreaker: true
  }
}

// export const stoneTypes = [BLOCKSTATUSES.CEMENT, BLOCKSTATUSES.TRANSPARENT]

export const breakableTypes = [BLOCKSTATUSES.NORMAL, BLOCKSTATUSES.BREAKER]

// export const isStoneType = (blockStatus) => stoneTypes.includes(blockStatus)

export const isBreakableType = (blockStatus) => breakableTypes.includes(blockStatus)

// export const possibleBlockStatuses = Object.values(BLOCKSTATUSES)

// export const isValidBlockStatus = (possible) => possibleBlockStatuses.includes(possible)
export const isValidBlockStatus = (possible) => Boolean(BLOCKSTATUSES[possible])

// Cement -> Transparent -> Normal
export const getNextBlockStatus = (currentBlockStatus) => {
  let nextStatus = currentBlockStatus

  switch (currentBlockStatus) {
    case BLOCKSTATUSES.CEMENT:
      nextStatus = BLOCKSTATUSES.TRANSPARENT
      break
    case BLOCKSTATUSES.TRANSPARENT:
      nextStatus = BLOCKSTATUSES.NORMAL
      break
  }

  return nextStatus
}
