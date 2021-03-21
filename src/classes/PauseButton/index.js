import { ImageKeys, PauseButtonAnimationMeta } from '../TetrisGame/images'

class PauseButton {
  constructor ({ isPlaying = true } = {}) {
    this.imageMeta = Object.assign({}, PauseButtonAnimationMeta)
    this.frameIndex = 0
    this.frameXCoord = 0
    this.frameYCoord = 0
    this._imageName = isPlaying ? ImageKeys.PauseButtonPlaying : ImageKeys.PauseButtonPaused

    this.updateImageCoordinates(0)
  }

  get imageName () {
    return this._imageName
  }

  getImageSrcXandY () {
    return [this.frameXCoord, this.frameYCoord]
  }

  playingAnimation () {
    this._imageName = ImageKeys.PauseButtonPlaying
  }

  pausedAnimation () {
    this._imageName = ImageKeys.PauseButtonPaused
  }

  updateImageCoordinates (frameIndex) {
    const { framesPerColumn, frameSize } = this.imageMeta

    const colIdx = frameIndex % framesPerColumn
    const rowIdx = Math.floor(frameIndex / framesPerColumn)

    this.frameXCoord = colIdx * frameSize
    this.frameYCoord = rowIdx * frameSize
  }

  updateFrame () {
    const { numberOfFrames } = this.imageMeta
    if (numberOfFrames > 1) {
      const doneWithFinalFrame = this.frameIndex === numberOfFrames - 1

      this.frameIndex = (doneWithFinalFrame) ? 0 : this.frameIndex + 1

      this.updateImageCoordinates(this.frameIndex)
    }
  }
}

export default PauseButton
