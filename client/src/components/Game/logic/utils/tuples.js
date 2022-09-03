import { sort } from 'ramda'

/*
  Given an array of tuples, remove any duplicate tuples and return
  a new array
*/
export const removeDuplicateTuples = (listWithDuplicates = []) => {
  const uniqueOnly = []
  for (const [left, right] of listWithDuplicates) {
    if (!uniqueOnly.some(([l, r]) => l === left && r === right)) {
      // breaks the reference to the array (tuple)
      uniqueOnly.push([left, right])
    }
  }
  return uniqueOnly
}

/*
  Sorts an array of tuples, by the 'keys' (tuple[0]), in descending order
  Does not modify the array in-place, like array.prototype.sort does
*/
export const sortTuplesDesc = sort(([aKey], [bKey]) => bKey - aKey)
