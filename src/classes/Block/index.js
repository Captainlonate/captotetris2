import { getRandomBlockColor } from './blockColors'
import { isValidBlockType, BlockTypes, getNextBlockType, BlockTypesInfo } from './blockTypes'
import { BlockImages } from './blockImages'
import { BlockImageSize, BlockAnimationMeta } from '../TetrisGame/images'

class Block {
  constructor ({ blockType = BlockTypes.NORMAL, color } = {}) {
    this._color = color || getRandomBlockColor()
    // this.numberOfFrames = 0
    this.imageMeta = { numberOfFrames: 1, framesPerColumn: 1 }
    this.imageFrameIdx = 0
    this.frameXCoord = 0
    this.frameYCoord = 0
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

  getImageSrcXandY () {
    return [this.frameXCoord, this.frameYCoord]
  }

  updateFrame () {
    const { numberOfFrames, framesPerColumn } = this.imageMeta
    if (numberOfFrames > 1) {
      this.imageFrameIdx = (this.imageFrameIdx === numberOfFrames - 1) ? 0 : this.imageFrameIdx + 1

      const colIdx = this.imageFrameIdx % framesPerColumn
      const rowIdx = Math.floor(this.imageFrameIdx / framesPerColumn)

      this.frameXCoord = colIdx * BlockImageSize
      this.frameYCoord = rowIdx * BlockImageSize
    }
  }

  updateBlockType (newBlockType) {
    if (isValidBlockType(newBlockType)) {
      const blockTypeInfo = BlockTypesInfo[newBlockType]

      this._blockType = newBlockType
      this._isBreakable = blockTypeInfo.isBreakable
      this._isBreaker = blockTypeInfo.isBreaker
      this._isStone = blockTypeInfo.isStone
      this._blockImageName = BlockImages[this._blockType][this._color]

      // this.numberOfFrames = BlockAnimationNumberOfFrames[this._blockImageName]
      this.imageMeta = Object.assign({}, BlockAnimationMeta[this._blockImageName])
    }
  }

  progressBlockType () {
    this.updateBlockType(getNextBlockType(this._blockType))
  }
}

export default Block
