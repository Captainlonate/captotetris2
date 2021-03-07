import { getRandomBlockColor } from './blockColors'
import { isValidBlockStatus, BLOCKSTATUSES, getNextBlockStatus } from './blockStatuses'
import { getHeadsOrTails } from '../../utils/random'

class Block {
  constructor ({ color, blockStatus, isBreaker }) {
    this._color = color || getRandomBlockColor()
    this._blockStatus = blockStatus || BLOCKSTATUSES.NORMAL
    this._isBreaker = isBreaker || getHeadsOrTails()
    this._isBreakable = isStone(this._blockStatus)
  }

  get color () {
    return this._color
  }

  get blockStatus () {
    return this._blockStatus
  }

  get isBreaker () {
    return this._isBreaker
  }

  get isBreakable () {
    return this._isBreakable
  }

  set isBreaker (isABreaker) {
    this._isBreaker = Boolean(isABreaker)
  }

  set blockStatus (newBlockStatus) {
    if (isValidBlockStatus(newBlockStatus)) {
      this._blockStatus = newBlockStatus
    }
  }

  randomizeColor () {
    this._color = getRandomBlockColor()
  }

  randomizeIsBreaker () {
    this._isBreaker = getHeadsOrTails()
  }

  randomizeBlock () {
    this.randomizeColor()
    this.randomizeIsBreaker()
  }

  progressBlockStatus () {
    this._blockStatus = getNextBlockStatus(this._blockStatus)
  }
}

export default Block
