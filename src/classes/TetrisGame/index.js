import ImageLoader from '../ImageLoader'
import Block from '../Block'
import { ImageLabelsToPaths, BlockImageSize } from './images'
import BoardManager from './BoardManager'
import { chanceToGetBreaker } from '../Block/blockTypes'
import { removeDuplicateTuples } from '../../utils/tuples'
import SoundManager from '../SoundManager'
import sounds from '../SoundManager/sounds'

const getDefaultPositionsAndSizes = () => ({
  canvasWidth: 0,
  canvasHeight: 0,
  leftSidebarWidth: 0,
  boardWidth: 0,
  blockWidth: 0,
  blockHeight: 0,
  // blockSrcDimensions: [0, 0, 0, 0],
  blockSrcDimensions: [0, 0],
  sidebarOffsetX: 0,
  sidebarOffsetY: 0,
  sidebarGapY: 0,
  blockTargetSize: [0, 0],
  sidebarBlockOneDims: [0, 0, 0, 0],
  sidebarBlockTwoDims: [0, 0, 0, 0],
  numRows: 15,
  numCols: 7
})

const getEmptyState = () => ({
  acceptsUserInput: false,
  needToProcessTheBoard: false,
  droppingBlocks: false,
  pieceIsDropping: false,
  gameIsOver: false,
  gameIsPaused: false,
  breakingBlocks: false
})

class TetrisGame {
  constructor ({ ctx }) {
    this.ctx = ctx

    // Holds all dimensions & positions
    this.dim = getDefaultPositionsAndSizes()

    // Holds game state
    this.emptyState = getEmptyState()
    this.gameState = Object.assign({}, this.emptyState)
    this.gameStateToRestore = null
    this.gameHasStarted = false

    // Will be shown in the left sidebar's preview blocks
    this.nextBlock1 = this.makeRegularBlock()
    this.nextBlock2 = this.makeRegularBlock()

    // Used with requestAnimationFrame
    this.timeSinceLastPieceDrop = 0
    this.timeSinceLastBlockFell = 0
    this.timeSinceLastBlockAnimation = 0
    this.animateBlocks = true

    // Animations
    this.blockAnimationDuration = 3000
    this.numberOfBlockFrames = 30
    this.blockAnimationSpeed = Math.floor(this.blockAnimationDuration / this.numberOfBlockFrames)

    this.onEndTurn = this.onEndTurn.bind(this)
    this.onCannotSpawn = this.onCannotSpawn.bind(this)
    this.onDoneDroppingBlocks = this.onDoneDroppingBlocks.bind(this)

    // Contains the board, allows access and mechanical functions
    this.boardManager = new BoardManager({
      numRows: this.dim.numRows,
      numCols: this.dim.numCols,
      onEndTurn: this.onEndTurn,
      onCannotSpawn: this.onCannotSpawn,
      onDoneDroppingBlocks: this.onDoneDroppingBlocks
    })

    // Facilitates sound and image loading
    this.soundManager = new SoundManager(sounds)
    this.imageManager = new ImageLoader({
      imagesToLoad: ImageLabelsToPaths,
      onDone: () => {
        this.allImagesAreLoaded()
      }
    })
  }

  onEndTurn () {
    this.soundManager.play('tink')
    this.setFlagsProcessingBoard()
  }

  onCannotSpawn () {
    this.setFlagsProcessingBoard()
  }

  onDoneDroppingBlocks () {
    this.setFlagsProcessingBoard()
  }

  allImagesAreLoaded () {
    // TODO: Game can start, establish network connection
    this.startTheGame()
  }

  startTheGame () {
    this.gameHasStarted = true
    // this.boardManager.spawnNewActivePiece(this.makeRegularBlock(), this.makeRegularBlock())
    // TODO: Delete
    this.boardManager.spawnNewActivePiece(new Block({ blockType: 'BREAKER', color: 'GREEN' }), this.makeRegularBlock())
    this.setFlagsControllingPiece()
  }

  update (deltaTime) {
    if (this.gameHasStarted) {
      if (!this.gameState.gameIsPaused) {
        if (this.gameState.needToProcessTheBoard) {
          // Need To Process the board
          console.log('Telling it to process the board')
          this.processTheBoardGetNewState()
        } else if (this.gameState.pieceIsDropping) {
          // Need to drop the user's active piece
          this.timeSinceLastPieceDrop += deltaTime
          if (this.timeSinceLastPieceDrop > 1000) {
            this.timeSinceLastPieceDrop = 0
            this.boardManager.dropTheActivePiece()
          }
        } else if (this.gameState.droppingBlocks) {
          // Need to drop blocks with spaces beneath them
          this.timeSinceLastBlockFell += deltaTime
          if (this.timeSinceLastBlockFell > 100) {
            this.timeSinceLastPieceDrop = 0
            this.boardManager.dropBlocksWithSpacesBeneath()
          }
        }

        // Animations
        if (this.animateBlocks) {
          this.timeSinceLastBlockAnimation += deltaTime
          if (this.timeSinceLastBlockAnimation > this.blockAnimationSpeed) {
            this.timeSinceLastBlockAnimation = 0
            this.boardManager.updateBlockAnimations()
          }
        }
      }
    }
  }

  drawLeftSidebar () {
    // The dark background
    this.ctx.globalAlpha = 0.3
    this.ctx.fillStyle = '#000000'
    this.ctx.fillRect(0, 0, this.dim.leftSidebarWidth, this.dim.canvasHeight)
    this.ctx.globalAlpha = 1.0
    // The two preview blocks
    if (this.nextBlock1 && this.nextBlock2) {
      this.ctx.drawImage(
        this.imageManager.getImage(this.nextBlock1.imageName),
        ...this.nextBlock1.getImageSrcXandY(),
        ...this.dim.blockSrcDimensions,
        ...this.dim.sidebarBlockOneDims
      )
      this.ctx.drawImage(
        this.imageManager.getImage(this.nextBlock2.imageName),
        ...this.nextBlock2.getImageSrcXandY(),
        ...this.dim.blockSrcDimensions,
        ...this.dim.sidebarBlockTwoDims
      )
    }
  }

  drawBoard () {
    let x = 0
    let y = 0
    const { leftSidebarWidth, blockWidth, blockHeight, blockSrcDimensions, blockTargetSize } = this.dim

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
  }

  drawPaused () {
    const { canvasWidth, canvasHeight } = this.dim
    this.ctx.globalAlpha = 0.5
    this.ctx.fillStyle = '#000000'
    this.ctx.fillRect(0, 0, canvasWidth, canvasHeight)
    this.ctx.globalAlpha = 1.0

    this.ctx.font = '30px Comic Sans MS'
    this.ctx.fillStyle = 'red'
    this.ctx.textAlign = 'center'
    this.ctx.fillText('Paused', canvasWidth / 2, canvasHeight / 2)
  }

  draw () {
    // if (this.gameHasStarted) {
    //   if (this.gameState.gameIsPaused) {
    //     this.drawPaused()
    //   } else {
    //     this.drawLeftSidebar()
    //     this.drawBoard()
    //   }
    // }
    // TODO: Remove
    if (this.gameHasStarted) {
      this.drawLeftSidebar()
      this.drawBoard()
    }
  }

  updateCanvasBounds (newCanvasWidth, newCanvasHeight, leftSidebarWidth, boardWidth) {
    this.dim.canvasWidth = newCanvasWidth
    this.dim.canvasHeight = newCanvasHeight
    this.dim.leftSidebarWidth = leftSidebarWidth
    this.dim.boardWidth = boardWidth
    this.recalculateBlockSize()
    this.recalculateSidebar()
  }

  recalculateBlockSize () {
    this.dim.blockWidth = Math.floor(this.dim.boardWidth / this.dim.numCols)
    // this.dim.blockWidth *= 2 // Makes it bigger for testing/debugging
    this.dim.blockHeight = Math.floor(this.dim.canvasHeight / (this.dim.numRows - 2))
    // this.dim.blockHeight *= 2 // Makes it bigger for testing/debugging
    // this.dim.blockSrcDimensions = [0, 0, BlockImageSize, BlockImageSize]
    this.dim.blockSrcDimensions = [BlockImageSize, BlockImageSize]
    this.dim.blockTargetSize = [this.dim.blockWidth, this.dim.blockHeight]
  }

  recalculateSidebar () {
    this.dim.sidebarOffsetX = Math.floor(this.dim.leftSidebarWidth * 0.25)
    this.dim.sidebarOffsetY = Math.floor(this.dim.blockHeight / 2)
    this.dim.sidebarGapY = Math.floor(this.dim.blockHeight / 4)
    // Sidebar preview blocks - location and sizes
    this.dim.sidebarBlockOneDims = [this.dim.sidebarOffsetX, this.dim.sidebarOffsetY, this.dim.blockWidth, this.dim.blockHeight]
    const sidebarBlockTwoY = this.dim.sidebarOffsetY + this.dim.blockHeight + this.dim.sidebarGapY
    this.dim.sidebarBlockTwoDims = [this.dim.sidebarOffsetX, sidebarBlockTwoY, this.dim.blockWidth, this.dim.blockHeight]
  }

  handleGameIsOver (isWin) {
    this.setFlagsGameIsOver()
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
      this.setFlagsDroppingBlocks()
    } else if (thereAreBlocksToBreak) {
      this.boardManager.breakBlocks(blocksToBreak)
      this.soundManager.play('success')
      this.setFlagsProcessingBoard()
    } else if (!this.boardManager.canSpawnNewPiece()) {
      this.setFlagsGameIsOver()
    } else {
      this.boardManager.setBlocksThatNeedToFall([])
      this.boardManager.spawnNewActivePiece(this.nextBlock1, this.nextBlock2)
      this.nextBlock1 = this.makeRegularBlock()
      this.nextBlock2 = this.makeRegularBlock()
      this.setFlagsControllingPiece()
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

  updateGameState (newState) {
    this.gameState = Object.assign({}, this.emptyState, newState)
  }

  setFlagsControllingPiece () {
    this.updateGameState({
      acceptsUserInput: true,
      pieceIsDropping: true
    })
  }

  setFlagsProcessingBoard () {
    this.updateGameState({ needToProcessTheBoard: true })
  }

  setFlagsDroppingBlocks () {
    this.updateGameState({ droppingBlocks: true })
  }

  setFlagsGameIsOver () {
    this.updateGameState({ gameIsOver: true })
  }

  setFlagsPauseGame () {
    this.updateGameState({ gameIsPaused: true })
  }

  setFlagsBreakingBlocks () {
    this.updateGameState({ breakingBlocks: true })
  }

  /*
    This will produce a block whose type has a small chance to
    be a "Breaker", but is otherwise just a "Normal" block
  */
  makeRegularBlock () {
    return new Block({ blockType: chanceToGetBreaker() })
  }

  onKeyPressed (keyCode) {
    if (this.gameState.acceptsUserInput && this.boardManager.hasActivePiece()) {
      switch (keyCode) {
        case 87: // W
        case 38: // Up Arrow
          this.boardManager.rotateTheActivePieceCCW()
          break
        case 83: // S
        case 40: // D Arrow
          this.boardManager.rotateTheActivePieceCW()
          break
        case 65: // A
        case 37: // L Arrow
          this.boardManager.leftTheActivePiece()
          break
        case 32: // SpaceBar
          this.boardManager.dropTheActivePiece()
          break
        case 68: // D
        case 39: // R Arrow
          this.boardManager.rightTheActivePiece()
          break
        default:
          break
      }
    }
  }

  onTabFocused () {
    console.log('Unpausing')
    if (this.gameStateToRestore !== null) {
      this.gameState = Object.assign({}, this.gameStateToRestore)
      this.gameStateToRestore = null
    }
  }

  onTabBlurred () {
    console.log('Pausing')
    this.gameStateToRestore = Object.assign({}, this.gameState)
    this.setFlagsPauseGame()
  }
}

export default TetrisGame
