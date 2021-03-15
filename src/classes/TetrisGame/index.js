import ImageLoader from '../ImageLoader'
import Block from '../Block'
import { ImageLabelsToPaths, BlockImageSize } from './images'
import BoardManager from './BoardManager'
import { chanceToGetBreaker } from '../Block/blockTypes'
import { removeDuplicateTuples } from '../../utils/tuples'

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
    // TODO: play the tink sound
    this.stopActivePieceDropInterval()
    this.stopBlocksFallingInterval()
    this.setFlagsProcessingBoard()
    this.processTheBoard()
  }

  onCannotSpawn () {
    this.stopActivePieceDropInterval()
    this.stopBlocksFallingInterval()
    this.setFlagsProcessingBoard()
    this.processTheBoard()
  }

  onDoneDroppingBlocks () {
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
    // this.boardManager.spawnNewActivePiece(this.makeRegularBlock(), this.makeRegularBlock())
    this.boardManager.spawnNewActivePiece(new Block({ blockType: 'BREAKER', color: 'GREEN' }), this.makeRegularBlock())
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
    this.boardManager.dropTheActivePiece()
  }

  onBlocksFallingInterval () {
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
    const blocksThatCanDrop = this.checkBoardForBlocksThatCanDrop()
    const thereAreBlocksToDrop = blocksThatCanDrop.length > 0
    // Don't call this expensive function if there are blocks to drop
    const blocksToBreak = thereAreBlocksToDrop ? [] : this.boardManager.getPossibleBreaks()
    const thereAreBlocksToBreak = blocksToBreak.length > 0

    // Begin by stopping all intervals, just to be sure
    // Will start them back up, if logic requires it
    this.stopActivePieceDropInterval()
    this.stopBlocksFallingInterval()

    if (thereAreBlocksToDrop) {
      this.boardManager.setBlocksThatNeedToFall(blocksThatCanDrop)
      this.setFlagsDroppingBlocks()
      this.blocksFallingInterval = setInterval(this.onBlocksFallingInterval, 50)
    } else if (thereAreBlocksToBreak) {
      this.boardManager.breakBlocks(blocksToBreak)
      setImmediate(() => this.processTheBoard())
    } else if (!this.boardManager.canSpawnNewPiece()) {
      this.handleGameIsOver()
    } else {
      this.boardManager.setBlocksThatNeedToFall([])

      this.boardManager.spawnNewActivePiece(this.nextBlock1, this.nextBlock2)
      this.nextBlock1 = this.makeRegularBlock()
      this.nextBlock2 = this.makeRegularBlock()
      this.activePieceDropInterval = setInterval(this.onPieceDropInterval, 1000)
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

    for (let rowIdx = BoardInfo.NUMROWS - 1; rowIdx >= 2; rowIdx--) {
      for (let colIdx = 0; colIdx < BoardInfo.NUMCOLS; colIdx++) {
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
}

export default TetrisGame
