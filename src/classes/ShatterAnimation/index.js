import { ShatterAnimationMeta } from '../TetrisGame/images'
import { BlockColorToShatterImage } from '../Block/blockImages'

class ShatterAnimation {
  constructor ({ color, row, col }) {
    this._color = color
    this._row = row
    this._col = col
    this._imageMeta = Object.assign({}, ShatterAnimationMeta)
    this._frameIndex = 0
    this._frameXCoord = 0
    this._frameYCoord = 0
    this._imageName = BlockColorToShatterImage[color]

    this.updateImageCoordinates(this._frameIndex)
  }

  get row () {
    return this._row
  }

  get col () {
    return this._col
  }

  get imageName () {
    return this._imageName
  }

  getImageSrcXandY () {
    return [this._frameXCoord, this._frameYCoord]
  }

  updateImageCoordinates (frameIndex) {
    const { framesPerColumn, frameSize } = this._imageMeta

    const colIdx = frameIndex % framesPerColumn
    const rowIdx = Math.floor(frameIndex / framesPerColumn)

    this._frameXCoord = colIdx * frameSize
    this._frameYCoord = rowIdx * frameSize
  }

  updateFrame () {
    const { numberOfFrames } = this._imageMeta
    if (numberOfFrames > 1) {
      const doneWithFinalFrame = this._frameIndex === numberOfFrames - 1
      if (!doneWithFinalFrame) {
        this._frameIndex = this._frameIndex + 1
        this.updateImageCoordinates(this._frameIndex)
      }
    }
  }
}

export default ShatterAnimation
