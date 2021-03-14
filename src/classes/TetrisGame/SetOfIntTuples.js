import { pipe, pair, toPairs, chain, sort } from 'ramda'

/*
  Think of it like a "Set()" of tuples<int, int>. Since
  it's like a Set(), only unique pairs can be stored.
  i.e.
    You cannot .add() the same row and number combination twice:
    const tupleSet = new SetOfIntTuples()
    tupleSet.add(1, 1)
    tupleSet.add(1, 2)
    tupleSet.add(1, 1) // Will be ignored
    tupleSet.get() // [[1,1], [1,2]]
*/
class SetOfIntTuples {
  constructor () {
    this.data = {}
  }

  add (key, value) {
    this.data[key] = this.data[key] || []
    if (!this.data[key].includes(value)) {
      this.data[key].push(value)
    }
  }

  debug () {
    console.log(this.data)
  }

  // Objects convert <Number> keys to strings, so they must
  // be parsed back into Numbers when placed in arrays
  // This wouldn't matter in object lookups (myObj[3]),
  // but when placed into tuples it's important to keep them
  // as the original numbers.
  get () {
    return pipe(
      toPairs,
      chain(([row, cols]) => cols.map(col => pair(parseInt(row), col)))
    )(this.data)
  }

  // sortByKey: If true, sort by the tuple's [0] value, otherwise [1]
  // isAscending: If true, 0 comes before 1, otherwise 1 comes first
  getSorted ({ sortByKey = true, isAscending = true } = {}) {
    const idx = sortByKey ? 0 : 1
    return sort((a, b) => {
      return (isAscending) ? a[idx] - [b[idx]] : b[idx] - [a[idx]]
    })(this.get())
  }
}

export default SetOfIntTuples
