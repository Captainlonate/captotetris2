import ImageLoader from '../ImageLoader'
import Block from '../Block'
import { ImageLabelsToPaths, BlockImageSize } from './images'
import BoardManager from '../BoardManager'
import { chanceToGetBreaker } from '../Block/blockTypes'
import { removeDuplicateTuples } from '../../utils/tuples'
import SoundManager from '../SoundManager'
import sounds from '../SoundManager/sounds'
import PauseButton from '../PauseButton'
import GameStateManager from '../GameStateManager'
import InputManager from '../InputManager'
import BorderManager from '../BorderManager'
import ShatterAnimation from '../ShatterAnimation'
import Timers from './Timers'

// number of ms in a second
const SECONDS = 1000

const getDefaultPositionsAndSizes = () => ({
  canvasWidth: 0,
  canvasHeight: 0,
  leftSidebarWidth: 0,
  boardWidth: 0,
  blockWidth: 0,
  blockHeight: 0,
  blockSrcDimensions: [0, 0],
  sidebarBlockOffsetX: 0,
  sidebarBlockOffsetY: 0,
  sidebarBlockGapY: 0,
  sidebarNextOffsetY: 0,
  blockTargetSize: [0, 0],
  sidebarBlockOneDims: [0, 0, 0, 0],
  sidebarBlockTwoDims: [0, 0, 0, 0],
  pauseButtonDims: [0, 0, 0, 0],
  numRows: 15, // 2 are hidden
  numCols: 7,
  shatterAnimationSize: 0,
  shatterAnimationOffset: 0
})

class TetrisGame {
  constructor ({ ctx }) {
    this.ctx = ctx
    // Holds all dimensions & positions
    this.dim = getDefaultPositionsAndSizes()
    // Holds game state
    this.state = new GameStateManager()
    // Will be shown in the left sidebar's preview blocks
    this.nextBlock1 = this.makeRegularBlock()
    this.nextBlock2 = this.makeRegularBlock()
    // Timers used with requestAnimationFrame
    this.time = new Timers()

    // this.timeSinceLastPieceDrop = 0
    // this.timeSinceLastBlockFell = 0
    // this.timerBlockFrame = 0
    // this.timeSinceLastRareAnimation = 0
    // this.timeSinceLastPauseBtnAnimation = 0
    // this.timeUntilEraseBreakLines = 0
    // this.timerShatterFrame = 0
    // this.timerUntilStopShattering = 0
    this.animateBlocks = true
    // Animations
    // this.timePerBlockAnimation = Math.floor((3 * SECONDS) / 30)
    // this.timePerPauseAnimation = Math.floor((2 * SECONDS) / 30)
    // this.timePerRareAnimation = 5 * SECONDS
    // this.timePerPieceDrop = 1 * SECONDS
    // this.timePerBlockFall = 50
    // this.durationToDrawBreakLines = 1.5 * SECONDS
    // this.totalTimeShatterAnimation = 0.5 * SECONDS
    // this.timePerShatterFrame = Math.floor(this.totalTimeShatterAnimation / 30)
    // Buttons
    this.pauseButton = new PauseButton()
    //
    this.cellsToBreakLater = null
    this.shatterAnimations = []
    // Contains the board, allows access and mechanical functions
    this.boardManager = new BoardManager({
      numRows: this.dim.numRows,
      numCols: this.dim.numCols,
      onEndTurn: this.onEndTurn,
      onCannotSpawn: this.onCannotSpawn,
      onDoneDroppingBlocks: this.onDoneDroppingBlocks
    })
    //
    this.borders = new BorderManager({ numRows: this.dim.numRows, numCols: this.dim.numCols })
    // Keyboard inputs
    this.inputManager = new InputManager()
    this.inputManager.on('up', () => this.boardManager.rotateTheActivePieceCCW())
    this.inputManager.on('right', () => this.boardManager.rightTheActivePiece())
    this.inputManager.on('down', () => this.boardManager.rotateTheActivePieceCW())
    this.inputManager.on('left', () => this.boardManager.leftTheActivePiece())
    this.inputManager.on('space', () => this.boardManager.dropTheActivePiece())
    // Facilitates sound and image loading
    this.soundManager = new SoundManager(sounds)
    this.imageManager = new ImageLoader({
      imagesToLoad: ImageLabelsToPaths,
      onDone: () => this.allImagesAreLoaded()
    })
  }

  onEndTurn = () => {
    this.soundManager.play('tink')
    this.state.setProcessingBoard()
  }

  onCannotSpawn = () => {
    this.state.setProcessingBoard()
  }

  onDoneDroppingBlocks = () => {
    this.state.setProcessingBoard()
  }

  allImagesAreLoaded () {
    // TODO: Game can start, establish network connection
    this.startTheGame()
  }

  startTheGame () {
    this.state.hasStarted = true
    // this.boardManager.spawnNewActivePiece(this.makeRegularBlock(), this.makeRegularBlock())
    // TODO: Delete
    this.boardManager.spawnNewActivePiece(new Block({ blockType: 'BREAKER', color: 'GREEN' }), this.makeRegularBlock())
    this.state.setControllingPiece()
    if (!document.hasFocus()) {
      console.log('The game begins paused, document does not have focus.')
      this.pauseTheGame()
    }
  }

  update (deltaTime) {
    if (this.state.hasStarted) {
      if (!this.state.gameIsPaused) {
        //
        if (this.state.needToProcessTheBoard) {
          // Need To Process the board
          this.processTheBoardGetNewState()
        } else if (this.state.pieceIsDropping) {
          // Need to drop the user's active piece
          this.timeSinceLastPieceDrop += deltaTime
          if (this.timeSinceLastPieceDrop > this.timePerPieceDrop) {
            this.timeSinceLastPieceDrop = 0
            this.boardManager.dropTheActivePiece()
          }
        } else if (this.state.droppingBlocks) {
          // Need to drop blocks with spaces beneath them
          this.timeSinceLastBlockFell += deltaTime
          if (this.timeSinceLastBlockFell > this.timePerBlockFall) {
            this.timeSinceLastBlockFell = 0
            this.boardManager.dropBlocksWithSpacesBeneath()
          }
        } else if (this.state.borderingBlocks) {
          this.timeUntilEraseBreakLines += deltaTime
          if (this.timeUntilEraseBreakLines > this.durationToDrawBreakLines) {
            this.timeUntilEraseBreakLines = 0
            this.stopBorderingsStartShattering()
          }
        } else if (this.state.shatteringBlocks) {
          this.timerShatterFrame += deltaTime
          this.timerUntilStopShattering += deltaTime
          if (this.timerUntilStopShattering > this.totalTimeShatterAnimation) {
            this.timerShatterFrame = 0
            this.timerUntilStopShattering = 0
            this.stopShattering()
          } else if (this.timerShatterFrame > this.timePerShatterFrame) {
            this.timerShatterFrame = 0
            for (const shatter of this.shatterAnimations) {
              shatter.updateFrame()
            }
          }
        }

        // Block Animations
        if (this.animateBlocks) {
          // Idle
          this.timerBlockFrame += deltaTime
          if (this.timerBlockFrame > this.timePerBlockAnimation) {
            this.timerBlockFrame = 0
            this.boardManager.updateBlockAnimations()
          }

          // Rare
          this.timeSinceLastRareAnimation += deltaTime
          if (this.timeSinceLastRareAnimation > this.timePerRareAnimation) {
            this.timeSinceLastRareAnimation = 0
            this.boardManager.tryToPlayRareAnimation()
          }
        }
      }

      // Pause/Play Button Animation
      this.timeSinceLastPauseBtnAnimation += deltaTime
      if (this.timeSinceLastPauseBtnAnimation > this.timePerPauseAnimation) {
        this.timeSinceLastPauseBtnAnimation = 0
        this.pauseButton.updateFrame()
      }
    }
  }

  drawLeftSidebar () {
    const {
      leftSidebarWidth,
      canvasHeight,
      sidebarNextOffsetY,
      blockSrcDimensions,
      sidebarBlockOneDims,
      sidebarBlockTwoDims,
      blockWidth,
      pauseButtonDims
    } = this.dim

    // The dark background
    this.ctx.globalAlpha = 0.3
    this.ctx.fillStyle = '#000000'
    this.ctx.fillRect(0, 0, leftSidebarWidth, canvasHeight)
    this.ctx.globalAlpha = 1.0
    // The "Next" text
    this.ctx.font = `${blockWidth * 0.45}px TradeWinds`
    this.ctx.fillStyle = 'white'
    this.ctx.textAlign = 'center'
    this.ctx.fillText('Next', leftSidebarWidth / 2, sidebarNextOffsetY)
    // The two preview blocks
    if (this.nextBlock1 && this.nextBlock2) {
      this.ctx.drawImage(
        this.imageManager.getImage(this.nextBlock1.imageName),
        ...this.nextBlock1.getImageSrcXandY(),
        ...blockSrcDimensions,
        ...sidebarBlockOneDims
      )
      this.ctx.drawImage(
        this.imageManager.getImage(this.nextBlock2.imageName),
        ...this.nextBlock2.getImageSrcXandY(),
        ...blockSrcDimensions,
        ...sidebarBlockTwoDims
      )
    }
    // Draw the pause button
    this.ctx.drawImage(
      this.imageManager.getImage(this.pauseButton.imageName),
      ...this.pauseButton.getImageSrcXandY(),
      ...blockSrcDimensions,
      ...pauseButtonDims
    )
  }

  drawBoard () {
    let x = 0
    let y = 0
    const {
      leftSidebarWidth,
      blockWidth,
      blockHeight,
      blockSrcDimensions,
      blockTargetSize,
      shatterAnimationOffset,
      shatterAnimationSize
    } = this.dim

    for (let rowIdx = 2; rowIdx < this.dim.numRows; rowIdx++) {
      for (let colIdx = 0; colIdx < this.dim.numCols; colIdx++) {
        const blockToDraw = this.boardManager.getCell(rowIdx, colIdx)
        if (blockToDraw) {
          x = leftSidebarWidth + (colIdx * blockWidth)
          y = (rowIdx - 2) * blockHeight
          this.ctx.drawImage(
            this.imageManager.getImage(blockToDraw.imageName),
            ...blockToDraw.getImageSrcXandY(),
            ...blockSrcDimensions,
            x, y, ...blockTargetSize
          )
        }
      }
    }

    // Draw Cell Borders
    this.ctx.lineWidth = 4
    this.ctx.strokeStyle = '#75cfff'

    if (this.borders.doesAnythingNeedBordered) {
      this.ctx.beginPath()
      for (const { row, col, sides } of this.borders.cellsToBeBordered) {
        this.drawBorder(row, col, sides)
      }
      this.ctx.stroke()
    }

    //
    for (const shatter of this.shatterAnimations) {
      this.ctx.drawImage(
        this.imageManager.getImage(shatter.imageName),
        ...shatter.getImageSrcXandY(),
        ...blockSrcDimensions,
        (leftSidebarWidth - shatterAnimationOffset) + (shatter.col * blockWidth),
        ((shatter.row - 2) * blockWidth) - shatterAnimationOffset,
        shatterAnimationSize,
        shatterAnimationSize
      )
    }
  }

  drawBorder (row, col, sides) {
    for (const side of sides) {
      // Because 2 rows are not drawn on the canvas, 2 must be subtracted
      // from the real row of the blocks, when calculating the y coordinates
      // const [x, y, endX, endY] = this.dim.cellBorders[row - 2][col][side]
      const [x, y, endX, endY] = this.borders.getCoords(row - 2, col, side)
      this.ctx.moveTo(x, y)
      this.ctx.lineTo(endX, endY)
    }
  }

  drawPaused () {
    const { blockWidth, leftSidebarWidth, canvasHeight, boardWidth } = this.dim

    this.ctx.font = `${blockWidth * 0.7}px TradeWinds`
    this.ctx.fillStyle = 'red'
    this.ctx.textAlign = 'center'
    this.ctx.fillText('Paused', leftSidebarWidth + (boardWidth / 2), canvasHeight / 2)
  }

  draw () {
    if (this.state.hasStarted) {
      this.drawLeftSidebar()
      this.drawBoard()
      if (this.state.gameIsPaused) {
        this.drawPaused()
      }
    }
  }

  updateCanvasBounds (newCanvasWidth, newCanvasHeight, leftSidebarWidth, boardWidth) {
    this.dim.canvasWidth = newCanvasWidth
    this.dim.canvasHeight = newCanvasHeight
    this.dim.leftSidebarWidth = leftSidebarWidth
    this.dim.boardWidth = boardWidth
    this.recalculateBlockSize()
    this.recalculateSidebar()
    this.borders.recalculateAllCellCoordinates({ blockSize: this.dim.blockWidth, xOffset: leftSidebarWidth })
  }

  recalculateBlockSize () {
    this.dim.blockWidth = Math.floor(this.dim.boardWidth / this.dim.numCols)
    this.dim.blockHeight = Math.floor(this.dim.canvasHeight / (this.dim.numRows - 2))
    this.dim.blockSrcDimensions = [BlockImageSize, BlockImageSize]
    this.dim.blockTargetSize = [this.dim.blockWidth, this.dim.blockHeight]
    this.dim.shatterAnimationSize = this.dim.blockWidth * 2
    this.dim.shatterAnimationOffset = this.dim.blockWidth / 2
  }

  recalculateSidebar () {
    // "Next" text
    this.dim.sidebarNextOffsetY = Math.floor(this.dim.blockHeight)
    // Preview Blocks Offsets
    this.dim.sidebarBlockOffsetX = Math.floor(this.dim.leftSidebarWidth * 0.25)
    this.dim.sidebarBlockOffsetY = Math.floor(this.dim.blockHeight * 1.5)
    this.dim.sidebarBlockGapY = Math.floor(this.dim.blockHeight / 4)
    // Sidebar preview blocks - location and sizes
    this.dim.sidebarBlockOneDims = [this.dim.sidebarBlockOffsetX, this.dim.sidebarBlockOffsetY, this.dim.blockWidth, this.dim.blockHeight]
    const sidebarBlockTwoY = this.dim.sidebarBlockOffsetY + this.dim.blockHeight + this.dim.sidebarBlockGapY
    this.dim.sidebarBlockTwoDims = [this.dim.sidebarBlockOffsetX, sidebarBlockTwoY, this.dim.blockWidth, this.dim.blockHeight]
    // Where the pause button should be drawn
    this.dim.pauseButtonDims = [this.dim.sidebarBlockOffsetX, this.dim.canvasHeight - 2 * this.dim.blockHeight, this.dim.blockWidth, this.dim.blockHeight]
  }

  handleGameIsOver (isWin) {
    this.state.setGameIsOver()
    const msg = isWin ? 'You won!' : 'You lost!'
    console.info(msg)
  }

  processTheBoardGetNewState () {
    const blocksThatCanDrop = this.checkBoardForBlocksThatCanDrop()
    const thereAreBlocksToDrop = blocksThatCanDrop.length > 0

    const blocksToBreak = thereAreBlocksToDrop ? [] : this.boardManager.getPossibleBreaks()
    const thereAreBlocksToBreak = blocksToBreak.length > 0

    if (thereAreBlocksToDrop) {
      this.boardManager.setBlocksThatNeedToFall(blocksThatCanDrop)
      this.state.setDroppingBlocks()
    } else if (thereAreBlocksToBreak) {
      this.cellsToBreakLater = blocksToBreak
      this.borders.setCellsToBeBordered(blocksToBreak)
      this.state.setBorderingBlocks()
    } else if (!this.boardManager.canSpawnNewPiece()) {
      this.handleGameIsOver()
    } else {
      this.boardManager.setBlocksThatNeedToFall([])
      this.boardManager.spawnNewActivePiece(this.nextBlock1, this.nextBlock2)
      this.nextBlock1 = this.makeRegularBlock()
      this.nextBlock2 = this.makeRegularBlock()
      this.state.setControllingPiece()
    }
  }

  /*
    Checks every cell of the board and records if it can be dropped. It can be
    dropped if there is an empty cell beneath it, or, if the cell beneath it
    can also be dropped.
    @return an array of tuples. Each one describes a cell that can be dropped
      ex: [[rowIdx, colIdx], [rowIdx, colIdx], ...]
  */
  checkBoardForBlocksThatCanDrop () {
    let thisCellIsEmpty = null
    let cellAboveThisCellIsNotEmpty = null
    const blocksThatCanDrop = []

    for (let rowIdx = this.dim.numRows - 1; rowIdx >= 2; rowIdx--) {
      for (let colIdx = 0; colIdx < this.dim.numCols; colIdx++) {
        thisCellIsEmpty = this.boardManager.isCellAvailable(rowIdx, colIdx)
        cellAboveThisCellIsNotEmpty = !this.boardManager.isCellAvailable(rowIdx - 1, colIdx)
        if (thisCellIsEmpty && cellAboveThisCellIsNotEmpty) {
          // The above cell can be dropped
          blocksThatCanDrop.push([rowIdx - 1, colIdx])
          // If there are also cells above this that are occupied, then
          // those can drop too (even though the cell below isn't empty)
          let chainedRowIdx = rowIdx - 2 // Already checked rowIdx - 1
          while (chainedRowIdx >= 2 && !this.boardManager.isCellAvailable(chainedRowIdx, colIdx)) {
            blocksThatCanDrop.push([chainedRowIdx, colIdx])
            chainedRowIdx--
          }
        }
      }
    }

    return removeDuplicateTuples(blocksThatCanDrop)
  }

  /*
    This will produce a block whose type has a small chance to
    be a "Breaker", but is otherwise just a "Normal" block
  */
  makeRegularBlock () {
    return new Block({ blockType: chanceToGetBreaker() })
  }

  stopBorderingsStartShattering () {
    this.boardManager.breakBlocks(this.cellsToBreakLater)
    this.soundManager.play('success')
    this.borders.clearCellsToBeBordered()
    this.setupCellsToShatter()
    this.state.setShatteringBlocks()
  }

  stopShattering () {
    this.cellsToBreakLater = null
    this.shatterAnimations = []
    this.state.setProcessingBoard()
  }

  onKeyPressed (keyCode) {
    if (this.state.acceptsUserInput && this.boardManager.hasActivePiece()) {
      this.inputManager.handleKeyUp(keyCode)
    }
  }

  onTabFocused () {
    // this.unpauseTheGame()
  }

  // When the user clicks away from this browser tab
  onTabBlurred () {
    this.pauseTheGame()
  }

  // All clicks on the canvas will be first routed here
  onClick ({ x, y }) {
    if (this.checkIfPauseButtonClicked(x, y)) {
      this.handlePauseButtonClicked()
    }
  }

  unpauseTheGame () {
    console.log('Unpausing')
    this.state.restoreStashedState()
    this.pauseButton.doPlayingAnimation()
  }

  pauseTheGame () {
    console.log('Pausing')
    if (!this.state.gameIsPaused) {
      this.state.stashCurrentState()
      this.state.setPauseGame()
      this.pauseButton.doPausedAnimation()
    }
  }

  handlePauseButtonClicked () {
    if (this.state.gameIsPaused) {
      this.unpauseTheGame()
    } else {
      this.pauseTheGame()
    }
  }

  checkIfPauseButtonClicked (clickX, clickY) {
    const [btnX, btnY, btnWidth, btnHeight] = this.dim.pauseButtonDims
    return (
      clickX >= btnX && clickY >= btnY &&
      clickX <= (btnX + btnWidth) && clickY <= (btnY + btnHeight)
    )
  }

  setupCellsToShatter () {
    this.shatterAnimations = this.cellsToBreakLater
      .flat()
      .map(([row, col]) => new ShatterAnimation({ row, col }))
    console.log(this.shatterAnimations)
  }
}

export default TetrisGame
