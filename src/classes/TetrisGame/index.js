import ImageLoader from '../ImageLoader'
import Block from '../Block'
import { ImageLabelsToPaths, BlockImageSize } from './images'
import BoardManager from './BoardManager'
import { chanceToGetBreaker } from '../Block/blockTypes'
import { removeDuplicateTuples } from '../../utils/tuples'
import SoundManager from '../SoundManager'
import sounds from '../SoundManager/sounds'

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
  numRows: 15, // 2 are hidden
  numCols: 7,
  cellBorders: [] // 2d array filled with objects
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
    this.timeSinceLastRareAnimation = 0

    // Animations
    this.blockAnimationDuration = 3 * SECONDS
    this.numberOfBlockFrames = 30
    this.blockAnimationSpeed = Math.floor(this.blockAnimationDuration / this.numberOfBlockFrames)
    this.minTimeRareAnimation = 5 * SECONDS

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
          // Normal animation progression
          this.timeSinceLastBlockAnimation += deltaTime
          if (this.timeSinceLastBlockAnimation > this.blockAnimationSpeed) {
            this.timeSinceLastBlockAnimation = 0
            this.boardManager.updateBlockAnimations()
          }

          // Rare Animations
          this.timeSinceLastRareAnimation += deltaTime
          if (this.timeSinceLastRareAnimation > this.minTimeRareAnimation) {
            this.timeSinceLastRareAnimation = 0
            this.boardManager.tryToPlayRareAnimation()
          }
        }
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
      blockWidth
    } = this.dim

    // The dark background
    this.ctx.globalAlpha = 0.3
    // window.sidebarColor = window.sidebarColor || '#3dc049'
    // this.ctx.fillStyle = window.sidebarColor // green
    // this.ctx.fillStyle = '#744a2f' // brown
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

    // Draw Cell Borders
    this.ctx.lineWidth = 4
    this.ctx.strokeStyle = '#75cfff'
    const cellsWithBorders = [
      { row: 4, col: 5, sides: ['top', 'left', 'right'] },
      { row: 5, col: 5, sides: ['left', 'right'] },
      { row: 5, col: 5, sides: ['bottom', 'left', 'right'] }
    ]

    if (cellsWithBorders.length > 0) {
      this.ctx.beginPath()
      for (const { row, col, sides } of cellsWithBorders) {
        this.drawBorder(row, col, sides)
      }
      this.ctx.stroke()
    }
  }

  drawBorder (row, col, sides) {
    for (const side of sides) {
      const [x, y, endX, endY] = this.dim.cellBorders[row][col][side]
      this.ctx.moveTo(x, y)
      this.ctx.lineTo(endX, endY)
    }
  }

  cellLeftBorderDimensions (row, col) {
    const { blockWidth, blockHeight } = this.dim
    const x = col * blockWidth
    const y = row * blockHeight
    return [x, y - 1, x, y + blockHeight + 1]
  }

  cellTopBorderDimensions (row, col) {
    const { blockWidth, blockHeight } = this.dim
    const x = col * blockWidth
    const y = row * blockHeight
    return [x - 1, y, x + blockWidth + 1, y]
  }

  cellBottomBorderDimensions (row, col) {
    const { blockWidth, blockHeight } = this.dim
    const x = (col * blockWidth) + blockWidth
    const y = (row * blockHeight) + blockHeight
    return [x + 1, y, x - blockWidth - 1, y]
  }

  cellRightBorderDimensions (row, col) {
    const { blockWidth, blockHeight } = this.dim
    const x = (col * blockWidth) + blockWidth
    const y = (row * blockHeight) + blockHeight
    return [x, y + 1, x, y - blockHeight - 1]
  }

  drawPaused () {
    const { blockWidth, leftSidebarWidth, canvasHeight, boardWidth } = this.dim

    this.ctx.font = `${blockWidth * 0.7}px TradeWinds`
    this.ctx.fillStyle = 'red'
    this.ctx.textAlign = 'center'
    this.ctx.fillText('Paused', leftSidebarWidth + (boardWidth / 2), canvasHeight / 2)
  }

  draw () {
    if (this.gameHasStarted) {
      this.drawLeftSidebar()
      this.drawBoard()
      if (this.gameState.gameIsPaused) {
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
    this.recalculateBorderDimensions()
  }

  recalculateBlockSize () {
    this.dim.blockWidth = Math.floor(this.dim.boardWidth / this.dim.numCols)
    this.dim.blockHeight = Math.floor(this.dim.canvasHeight / (this.dim.numRows - 2))
    this.dim.blockSrcDimensions = [BlockImageSize, BlockImageSize]
    this.dim.blockTargetSize = [this.dim.blockWidth, this.dim.blockHeight]
  }

  recalculateSidebar () {
    // Next text
    this.dim.sidebarNextOffsetY = Math.floor(this.dim.blockHeight)
    // Preview Blocks Offsets
    this.dim.sidebarBlockOffsetX = Math.floor(this.dim.leftSidebarWidth * 0.25)
    this.dim.sidebarBlockOffsetY = Math.floor(this.dim.blockHeight * 1.5)
    this.dim.sidebarBlockGapY = Math.floor(this.dim.blockHeight / 4)
    // Sidebar preview blocks - location and sizes
    this.dim.sidebarBlockOneDims = [this.dim.sidebarBlockOffsetX, this.dim.sidebarBlockOffsetY, this.dim.blockWidth, this.dim.blockHeight]
    const sidebarBlockTwoY = this.dim.sidebarBlockOffsetY + this.dim.blockHeight + this.dim.sidebarBlockGapY
    this.dim.sidebarBlockTwoDims = [this.dim.sidebarBlockOffsetX, sidebarBlockTwoY, this.dim.blockWidth, this.dim.blockHeight]
  }

  recalculateBorderDimensions () {
    const { numRows, numCols } = this.dim
    this.dim.cellBorders = [...new Array(numRows)].map(() => [...new Array(numCols)].fill(null))

    for (let row = 0; row < numRows; row++) {
      for (let col = 0; col < numCols; col++) {
        this.dim.cellBorders[row][col] = this.dim.cellBorders[row][col] || {}
        this.dim.cellBorders[row][col].top = this.cellTopBorderDimensions(row, col)
        this.dim.cellBorders[row][col].right = this.cellRightBorderDimensions(row, col)
        this.dim.cellBorders[row][col].bottom = this.cellBottomBorderDimensions(row, col)
        this.dim.cellBorders[row][col].left = this.cellLeftBorderDimensions(row, col)
      }
    }
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
