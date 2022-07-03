import crypto from 'crypto'

// ========================================================

export const makeRandomID = (): string => (
  crypto.randomBytes(8).toString("hex")
)