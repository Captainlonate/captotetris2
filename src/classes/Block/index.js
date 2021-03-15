import { getRandomBlockColor } from './blockColors'
import { isValidBlockType, BlockTypes, getNextBlockType, BlockTypesInfo } from './blockTypes'
import { BlockImages } from './blockImages'

class Block {
  constructor ({ blockType = BlockTypes.NORMAL, color } = {}) {
    this._color = color || getRandomBlockColor()
    this.updateBlockType(blockType)
  }

  get blockType () {
    return this._blockType
  }

  get color () {
    return this._color
  }

  get isBreaker () {
    return this._isBreaker
  }

  get isBreakable () {
    return this._isBreakable
  }

  get isStone () {
    return this._isStone
  }

  get imageName () {
    return this._blockImageName
  }

  updateBlockType (newBlockType) {
    if (isValidBlockType(newBlockType)) {
      const blockTypeInfo = BlockTypesInfo[newBlockType]

      this._blockType = newBlockType
      this._isBreakable = blockTypeInfo.isBreakable
      this._isBreaker = blockTypeInfo.isBreaker
      this._isStone = blockTypeInfo.isStone
      this._blockImageName = BlockImages[this._blockType][this._color]
    }
  }

  progressBlockType () {
    this.updateBlockType(getNextBlockType(this._blockType))
  }
}

export default Block
