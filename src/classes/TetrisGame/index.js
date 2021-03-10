import ImageLoader from '../ImageLoader'
import Block from '../Block'
import { ImageLabelsToPaths, BlockImageSize } from './images'
import BoardManager from './BoardManager'

const BoardInfo = {
  NUMROWS: 15, // the top 2 are where the blocks spawn
  NUMCOLS: 7,
  // STARTCOL: 3,
  // STARTROW_BLOCK1: 0,
  // STARTROW_BLOCK2: 1
}

class TetrisGame {
  constructor ({ ctx }) {
    this.ctx = ctx
    this.canvasWidth = 0
    this.canvasHeight = 0

    this.blockWidth = 0
    this.blockHeight = 0

    this.gameState = {
      gameIsRunning: false,
      imagesAreLoaded: false,
      acceptsUserInput: false,
      processingTheBoard: false
    }

    this.gameStateControllingPiece = {}
    this.gameStateProcessingBoard = {}
    this.gameState

    // this.activeBlock1 = null
    // this.activeBlock2 = null

    this.nextBlock1 = new Block()
    this.nextBlock2 = new Block()

    this.boardManager = new BoardManager({
      numRows: BoardInfo.NUMROWS,
      numCols: BoardInfo.NUMCOLS,
      onEndTurn: () => {
        console.log('Piece is done falling.')
        // play the tink sound
        // clear and Stop the interval
        clearInterval(this.pieceDropInterval)
        this.pieceDropInterval = null
        // Don't accept user input
        this.gameState.acceptsUserInput = false
        // Is the board full?
        //    If so, end the game
        // Set processing the board flag
        this.gameState.processingTheBoard = true
        // Process the board
        this.processTheBoard()
        // Spawn another piece
        // Start the interval again
      },
      onCannotSpawn: () => {
        console.log('Cannot spawn new piece. Board is full. Player loses.')
      }
    })

    // Used in setInterval
    this.pieceDropInterval = null
    this.onPieceDropInterval = this.onPieceDropInterval.bind(this)

    this.imageManager = new ImageLoader({
      imagesToLoad: ImageLabelsToPaths,
      onDone: () => {
        this.allImagesAreLoaded()
      }
    })
  }

  allImagesAreLoaded () {
    this.startTheGame()
  }

  startTheGame () {
    this.gameState.gameIsRunning = true
    this.gameState.imagesAreLoaded = true
    this.boardManager.spawnNewActivePiece(new Block(), new Block())
    this.pieceDropInterval = setInterval(this.onPieceDropInterval, 1000)
    this.gameState.acceptsUserInput = true
  }

  update () {
    if (this.gameState.gameIsRunning) {
      //
    }
  }

  draw () {
    if (this.gameState.gameIsRunning) {
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

  onPieceDropInterval () {
    this.boardManager.dropTheActivePiece()
  }

  processTheBoard () {
    let thereAreBlocksToDrop = false
    let thereAreBlocksToBreak = false
    // let didSomethingDrop = false
    // let didSomethingBreak = false
    // const combos = []
    /*

      do {
        console.log('Checking for drops or breaks...')
        didSomethingDrop = processDrops()
        { didSomethingBreak, breaks } = processBreaks()
      } while (didSomethingDrop || didSomethingBreak)

    */

    if (!thereAreBlocksToDrop && !thereAreBlocksToBreak) {
      this.boardManager.spawnNewActivePiece(this.nextBlock1, this.nextBlock2)
      this.nextBlock1 = new Block()
      this.nextBlock2 = new Block()
      this.pieceDropInterval = setInterval(this.onPieceDropInterval, 1000)
      this.gameState.acceptsUserInput = true
      this.gameState.processingTheBoard = false
    }
  }

  setFlagsControllingPiece () {
    // this.gameState = Object.assign(this.gameState, { acceptsUserInput: true, processingTheBoard: false })
    this.gameState.acceptsUserInput = true
    this.gameState.processingTheBoard = false
  }

  setFlagsProcessingBoard () {
    this.gameState.acceptsUserInput = false
    this.gameState.processingTheBoard = true
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
