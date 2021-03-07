// Use when you have a 50% chance of something happening
export const getHeadsOrTails = () => Math.random() > 0.5

// empty array returns 0
export const getRandomArrayIndex = (arr) => Math.floor(Math.random() * arr.length)

// empty array throws exception - deliberately choosing to return undefined
// or null could be misleading since array actually could contain it
export const getRandomArrayEl = (arr) => arr[getRandomArrayIndex(arr)]
