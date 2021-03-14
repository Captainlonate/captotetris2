import ImageLoader from '../ImageLoader'
import Block from '../Block'
import { ImageLabelsToPaths, BlockImageSize } from './images'
import BoardManager from './BoardManager'
import SetOfIntTuples from './SetOfIntTuples'
import { chanceToGetBreaker } from '../Block/blockTypes'

const BoardInfo = {
  NUMROWS: 15, // the top 2 are where the blocks spawn
  NUMCOLS: 7
}

class TetrisGame {
  constructor ({ ctx }) {
    this.ctx = ctx
    this.canvasWidth = 0
    this.canvasHeight = 0

    this.blockWidth = 0
    this.blockHeight = 0

    this.gameState = {
      gameHasStarted: false, // allows update() and draw()
      imagesAreLoaded: false,
      acceptsUserInput: false,
      processingTheBoard: false,
      droppingBlocks: false
    }

    this.nextBlock1 = this.makeRegularBlock()
    this.nextBlock2 = this.makeRegularBlock()

    this.onEndTurn = this.onEndTurn.bind(this)
    this.onCannotSpawn = this.onCannotSpawn.bind(this)
    this.onDoneDroppingBlocks = this.onDoneDroppingBlocks.bind(this)
    this.onPieceDropInterval = this.onPieceDropInterval.bind(this)
    this.onBlocksFallingInterval = this.onBlocksFallingInterval.bind(this)

    this.boardManager = new BoardManager({
      numRows: BoardInfo.NUMROWS,
      numCols: BoardInfo.NUMCOLS,
      onEndTurn: this.onEndTurn,
      onCannotSpawn: this.onCannotSpawn,
      onDoneDroppingBlocks: this.onDoneDroppingBlocks
    })

    // Used in setInterval
    this.activePieceDropInterval = null
    this.blocksFallingInterval = null

    this.imageManager = new ImageLoader({
      imagesToLoad: ImageLabelsToPaths,
      onDone: () => {
        this.allImagesAreLoaded()
      }
    })
  }

  onEndTurn () {
    console.log('onEndTurn')
    // TODO: play the tink sound
    this.stopActivePieceDropInterval()
    this.stopBlocksFallingInterval()
    this.setFlagsProcessingBoard()
    this.processTheBoard()
  }

  onCannotSpawn () {
    console.log('onCannotSpawn')
    this.stopActivePieceDropInterval()
    this.stopBlocksFallingInterval()
    this.setFlagsProcessingBoard()
    this.processTheBoard()
  }

  onDoneDroppingBlocks () {
    console.log('onDoneDroppingBlocks')
    this.stopActivePieceDropInterval()
    this.stopBlocksFallingInterval()
    this.setFlagsProcessingBoard()
    this.processTheBoard()
  }

  allImagesAreLoaded () {
    // TODO: Game can start, establish network connection
    this.startTheGame()
  }

  startTheGame () {
    this.gameState.gameHasStarted = true
    this.gameState.imagesAreLoaded = true
    this.boardManager.spawnNewActivePiece(this.makeRegularBlock(), this.makeRegularBlock())
    this.activePieceDropInterval = setInterval(this.onPieceDropInterval, 1000)
    this.gameState.acceptsUserInput = true
  }

  update () {
    if (this.gameState.gameHasStarted) {
      //
    }
  }

  draw () {
    if (this.gameState.gameHasStarted) {
      for (let rowIdx = 2; rowIdx < BoardInfo.NUMROWS; rowIdx++) {
        for (let colIdx = 0; colIdx < BoardInfo.NUMCOLS; colIdx++) {
          const blockToDraw = this.boardManager.getCell(rowIdx, colIdx)
          if (blockToDraw) {
            this.ctx.drawImage(
              this.imageManager.getImage(blockToDraw.imageName),
              0, 0, BlockImageSize, BlockImageSize,
              colIdx * this.blockWidth, (rowIdx - 2) * this.blockHeight, this.blockWidth, this.blockHeight
            )
          }
        }
      }
    }
  }

  updateCanvasBounds (newCanvasWidth, newCanvasHeight) {
    this.canvasWidth = newCanvasWidth
    this.canvasHeight = newCanvasHeight
    this.recalculateBlockSize()
  }

  recalculateBlockSize () {
    this.blockWidth = Math.floor(this.canvasWidth / BoardInfo.NUMCOLS)
    this.blockHeight = Math.floor(this.canvasHeight / (BoardInfo.NUMROWS - 2))
  }

  handleGameIsOver (isWin) {
    this.stopActivePieceDropInterval()
    this.stopBlocksFallingInterval()
    this.setFlagsGameIsOver()
    const msg = isWin ? 'You won!' : 'You lost!'
    console.info(msg)
  }

  onPieceDropInterval () {
    console.log('onPieceDropInterval')
    this.boardManager.dropTheActivePiece()
  }

  onBlocksFallingInterval () {
    console.log('onBlocksFallingInterval')
    this.boardManager.dropBlocksWithSpacesBeneath()
  }

  stopActivePieceDropInterval () {
    clearInterval(this.activePieceDropInterval)
    this.activePieceDropInterval = null
  }

  stopBlocksFallingInterval () {
    clearInterval(this.blocksFallingInterval)
    this.blocksFallingInterval = null
  }

  processTheBoard () {
    console.log('processTheBoard')
    const blocksThatCanDrop = this.checkBoardForBlocksThatCanDrop()
    const thereAreBlocksToDrop = blocksThatCanDrop.length > 0
    const thereAreBlocksToBreak = false // TODO: Placeholder

    // Begin by stopping all intervals, just to be sure
    // Will start them back up, if logic requires it
    this.stopActivePieceDropInterval()
    this.stopBlocksFallingInterval()

    if (thereAreBlocksToDrop) {
      console.log('There are blocks to drop:', blocksThatCanDrop)
      this.boardManager.setBlocksThatNeedToFall(blocksThatCanDrop)
      this.setFlagsDroppingBlocks()
      this.blocksFallingInterval = setInterval(this.onBlocksFallingInterval, 500)
    } else if (thereAreBlocksToBreak) {
      // TODO: Check if there is stuff to break

    } else if (!this.boardManager.canSpawnNewPiece()) {
      console.log('No blocks to drop & cannot spawn piece.')
      this.handleGameIsOver()
    } else {
      console.log('There are no blocks to drop and game is not over.')
      this.boardManager.setBlocksThatNeedToFall([])

      this.boardManager.spawnNewActivePiece(this.nextBlock1, this.nextBlock2)
      this.nextBlock1 = this.makeRegularBlock()
      this.nextBlock2 = this.makeRegularBlock()
      this.activePieceDropInterval = setInterval(this.onPieceDropInterval, 1000)
      this.setFlagsControllingPiece()
    }
  }

  checkBoardForBlocksThatCanDrop () {
    let thisCellIsEmpty = null
    let cellAboveThisCellIsNotEmpty = null
    const blocksThatCanDrop = new SetOfIntTuples()

    for (let rowIdx = BoardInfo.NUMROWS - 1; rowIdx >= 2; rowIdx--) {
      for (let colIdx = 0; colIdx < BoardInfo.NUMCOLS; colIdx++) {
        thisCellIsEmpty = this.boardManager.isCellAvailable(rowIdx, colIdx)
        cellAboveThisCellIsNotEmpty = !this.boardManager.isCellAvailable(rowIdx - 1, colIdx)
        if (thisCellIsEmpty && cellAboveThisCellIsNotEmpty) {
          // The above cell can be dropped
          blocksThatCanDrop.add(rowIdx - 1, colIdx)
          // If there are also cells above this that are occupied, then
          // those can drop too (even though the cell below isn't empty)
          let chainedRowIdx = rowIdx - 2 // Already checked rowIdx - 1
          while (chainedRowIdx >= 2 && !this.boardManager.isCellAvailable(chainedRowIdx, colIdx)) {
            blocksThatCanDrop.add(chainedRowIdx, colIdx)
            chainedRowIdx--
          }
        }
      }
    }

    return blocksThatCanDrop.getSorted({ sortByKey: true, isAscending: false })
  }

  setFlagsControllingPiece () {
    this.gameState.acceptsUserInput = true
    this.gameState.processingTheBoard = false
    this.gameState.droppingBlocks = false
  }

  setFlagsProcessingBoard () {
    this.gameState.acceptsUserInput = false
    this.gameState.processingTheBoard = true
    this.gameState.droppingBlocks = false
  }

  setFlagsDroppingBlocks () {
    this.gameState.acceptsUserInput = false
    this.gameState.processingTheBoard = true
    this.gameState.droppingBlocks = true
  }

  setFlagsGameIsOver () {
    this.gameState.acceptsUserInput = false
    this.gameState.processingTheBoard = false
    this.gameState.droppingBlocks = false
  }

  /*
    This will product a block whose type has a small chance to
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
          this.boardManager.rotateTheActivePieceCW()
          break
        case 83: // S
        case 40: // D Arrow
          this.boardManager.rotateTheActivePieceCCW()
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
}

export default TetrisGame
