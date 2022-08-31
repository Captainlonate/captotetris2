import { getRandomBlockColor } from './blockColors'
import { isValidBlockType, BlockTypes, getNextBlockType, BlockTypesInfo } from './blockTypes'
import { BlockImages, AnimationState } from './blockImages'
import { BlockImageSize, BlockAnimationMeta } from '../TetrisGame/images'

class Block {
  constructor ({ blockType = BlockTypes.NORMAL, color } = {}) {
    this._blockImageName = null

    this._color = color || getRandomBlockColor()
    // Image & Animation
    this.imageMeta = { numberOfFrames: 1, framesPerColumn: 1, numberOfRows: 1 }
    this.animationState = AnimationState.IDLE
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

  playRareAnimation () {
    // const { animationState } = this.imageMeta
    if (this.animationState !== AnimationState.RARE) {
      this.animationState = AnimationState.RARE
      this._blockImageName = BlockImages[this._blockType][this._color][this.animationState]
      this.imageFrameIdx = 0
      this.updateImageCoordinates(this.imageFrameIdx)
    }
  }

  playIdleAnimation () {
    // const { animationState } = this.imageMeta
    if (this.animationState !== AnimationState.IDLE) {
      this.animationState = AnimationState.IDLE
      this._blockImageName = BlockImages[this._blockType][this._color][this.animationState]
      this.imageFrameIdx = 0
      this.updateImageCoordinates(this.imageFrameIdx)
    }
  }

  updateImageCoordinates (frameIndex) {
    const { framesPerColumn } = this.imageMeta

    const colIdx = frameIndex % framesPerColumn
    const rowIdx = Math.floor(frameIndex / framesPerColumn)

    this.frameXCoord = colIdx * BlockImageSize
    this.frameYCoord = rowIdx * BlockImageSize
  }

  updateFrame () {
    const { numberOfFrames } = this.imageMeta
    if (numberOfFrames > 1) {
      const doneWithFinalFrame = this.imageFrameIdx === numberOfFrames - 1

      // If finishing a rare animation, switch back to the idle animation
      if (this.animationState === AnimationState.RARE && doneWithFinalFrame) {
        this.playIdleAnimation()
      } else {
        this.imageFrameIdx = (doneWithFinalFrame) ? 0 : this.imageFrameIdx + 1
      }

      this.updateImageCoordinates(this.imageFrameIdx)
    }
  }

  updateBlockType (newBlockType) {
    if (isValidBlockType(newBlockType)) {
      const blockTypeInfo = BlockTypesInfo[newBlockType]

      this.animationState = AnimationState.IDLE

      this._blockType = newBlockType
      this._isBreakable = blockTypeInfo.isBreakable
      this._isBreaker = blockTypeInfo.isBreaker
      this._isStone = blockTypeInfo.isStone
      this._blockImageName = BlockImages[this._blockType][this._color][this.animationState]

      this.imageMeta = Object.assign({}, BlockAnimationMeta[this._blockImageName])

      // Start at a random frame in the animation
      this.imageFrameIdx = Math.floor(Math.random() * this.imageMeta.numberOfFrames)
    }
  }

  progressBlockType () {
    this.updateBlockType(getNextBlockType(this._blockType))
  }
}

export default Block
