// Use when you have a 50% chance of something happening
export const getHeadsOrTails = () => Math.random() > 0.5

// empty array returns 0
export const getRandomArrayIndex = (arr) => Math.floor(Math.random() * arr.length)

// empty array throws exception - deliberately choosing to return undefined
// or null could be misleading since array actually could contain it
export const getRandomArrayEl = (arr) => arr[getRandomArrayIndex(arr)]

// 'percent' must be 1 - 99
export const percentChance = (percent) => () => Math.random() <= (percent / 100.0)
export const tenPercentChance = percentChance(10) // There is a 10% chance it will return true
export const fifteenPercentChance = percentChance(15) // There is a 15% chance it will return true
export const twentyPercentChance = percentChance(20) // There is a 20% chance it will return true
export const thirtyPercentChance = percentChance(30) // There is a 30% chance it will return true
export const fourtyPercentChance = percentChance(40) // There is a 40% chance it will return true
export const fiftyPercentChance = percentChance(50) // There is a 50% chance it will return true
export const sixtyPercentChance = percentChance(60) // There is a 60% chance it will return true
export const seventyPercentChance = percentChance(70) // There is a 70% chance it will return true
export const eightyPercentChance = percentChance(80) // There is a 80% chance it will return true
export const ninetyPercentChance = percentChance(90) // There is a 90% chance it will return true
