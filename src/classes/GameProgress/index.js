import { pipe, pluck, map, length, flatten } from 'ramda'

const getNumberOfBreaks = pipe(
  pluck('cells'),
  map(length),
  flatten
)

class GameProgress {
  constructor () {
    this._allBreaks = [[]]
    this._turnNumber = 0
  }

  newTurn () {
    if (this._allBreaks[this._turnNumber].length > 0) {
      this._allBreaks.push([])
      this._turnNumber++
    }
    // Calculate The effect of this turn
  }

  addBreak (numberOfBlocks) {
    // this._allBreaks[this._turnNumber].push(numberOfBlocks)
    this._allBreaks[this._turnNumber].push(getNumberOfBreaks(numberOfBlocks))
    console.log('allBreaks', this._allBreaks)
  }
}

export default GameProgress
