import ImageLoader from '../ImageLoader'
import Block from '../Block'
import { ImageLabelsToPaths, BlockImageSize } from './images'
import BoardManager from './BoardManager'
import { chanceToGetBreaker } from '../Block/blockTypes'
import { removeDuplicateTuples } from '../../utils/tuples'
import SoundManager from '../SoundManager'
import sounds from '../SoundManager/sounds'

const BoardInfo = {
  NUMROWS: 15, // the top 2 are where the blocks spawn
  NUMCOLS: 7
}

class TetrisGame {
  constructor ({ ctx }) {
    this.ctx = ctx
    this.canvasWidth = 0
    this.canvasHeight = 0
    this.leftSidebarWidth = 0
    this.boardWidth = 0

    this.blockWidth = 0
    this.blockHeight = 0
    this.blockSrcDimensions = [0, 0, 0, 0]
    this.sidebarOffsetX = 0
    this.sidebarOffsetY = 0
    this.sidebarGapY = 0

    this.tabHasFocus = true

    this.initialState = {
      acceptsUserInput: false,
      processingTheBoard: false,
      droppingBlocks: false,
      pieceIsDropping: false,
      gameIsOver: false,
      gameIsPaused: false,
      breakingBlocks: false
    }

    this.gameState = Object.assign({}, this.initialState)
    this.gameStateToRestore = null

    this.gameHasStarted = false

    this.timeSinceLastPieceDrop = 0
    this.timeSinceLastBlockFell = 0

    this.nextBlock1 = this.makeRegularBlock()
    this.nextBlock2 = this.makeRegularBlock()

    this.onEndTurn = this.onEndTurn.bind(this)
    this.onCannotSpawn = this.onCannotSpawn.bind(this)
    this.onDoneDroppingBlocks = this.onDoneDroppingBlocks.bind(this)
    this.onBlocksFallingInterval = this.onBlocksFallingInterval.bind(this)

    this.boardManager = new BoardManager({
      numRows: BoardInfo.NUMROWS,
      numCols: BoardInfo.NUMCOLS,
      onEndTurn: this.onEndTurn,
      onCannotSpawn: this.onCannotSpawn,
      onDoneDroppingBlocks: this.onDoneDroppingBlocks
    })

    // Used in setInterval
    this.blocksFallingInterval = null

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
    this.stopBlocksFallingInterval()
    this.processTheBoard()
  }

  onCannotSpawn () {
    this.stopBlocksFallingInterval()
    this.setFlagsProcessingBoard()
    this.processTheBoard()
  }

  onDoneDroppingBlocks () {
    this.stopBlocksFallingInterval()
    this.setFlagsProcessingBoard()
    this.processTheBoard()
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
        if (this.gameState.processingTheBoard) {
          console.log('Telling it to process the board')
          // this.processTheBoardGetNewState()
        } else if (this.gameState.pieceIsDropping) {
          this.timeSinceLastPieceDrop += deltaTime
          if (this.timeSinceLastPieceDrop > 1000) {
            this.timeSinceLastPieceDrop = 0
            this.boardManager.dropTheActivePiece()
          }
        }
      }
    }
  }

  drawLeftSidebar () {
    // The dark background
    this.ctx.globalAlpha = 0.3
    this.ctx.fillStyle = '#000000'
    this.ctx.fillRect(0, 0, this.leftSidebarWidth, this.canvasHeight)
    this.ctx.globalAlpha = 1.0
    // The two preview blocks
    if (this.nextBlock1 && this.nextBlock2) {
      this.ctx.drawImage(
        this.imageManager.getImage(this.nextBlock1.imageName),
        ...this.blockSrcDimensions,
        this.sidebarOffsetX, this.sidebarOffsetY, this.blockWidth, this.blockHeight
      )
      this.ctx.drawImage(
        this.imageManager.getImage(this.nextBlock2.imageName),
        ...this.blockSrcDimensions,
        this.sidebarOffsetX, this.sidebarOffsetY + this.blockHeight + this.sidebarGapY, this.blockWidth, this.blockHeight
      )
    }
  }

  drawBoard () {
    let x = 0
    let y = 0

    for (let rowIdx = 2; rowIdx < BoardInfo.NUMROWS; rowIdx++) {
      for (let colIdx = 0; colIdx < BoardInfo.NUMCOLS; colIdx++) {
        const blockToDraw = this.boardManager.getCell(rowIdx, colIdx)
        if (blockToDraw) {
          x = this.leftSidebarWidth + (colIdx * this.blockWidth)
          y = (rowIdx - 2) * this.blockHeight
          this.ctx.drawImage(
            this.imageManager.getImage(blockToDraw.imageName),
            ...this.blockSrcDimensions,
            x, y, this.blockWidth, this.blockHeight
          )
        }
      }
    }
  }

  drawPaused () {
    this.ctx.globalAlpha = 0.5
    this.ctx.fillStyle = '#000000'
    this.ctx.fillRect(0, 0, this.canvasWidth, this.canvasHeight)
    this.ctx.globalAlpha = 1.0

    this.ctx.font = '30px Comic Sans MS'
    this.ctx.fillStyle = 'red'
    this.ctx.textAlign = 'center'
    this.ctx.fillText('Paused', this.canvasWidth / 2, this.canvasHeight / 2)
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
    this.drawLeftSidebar()
    this.drawBoard()
  }

  updateCanvasBounds (newCanvasWidth, newCanvasHeight, leftSidebarWidth, boardWidth) {
    this.canvasWidth = newCanvasWidth
    this.canvasHeight = newCanvasHeight
    this.leftSidebarWidth = leftSidebarWidth
    this.boardWidth = boardWidth
    this.recalculateBlockSize()
    this.recalculateSidebar()
  }

  recalculateBlockSize () {
    this.blockWidth = Math.floor(this.boardWidth / BoardInfo.NUMCOLS)
    this.blockHeight = Math.floor(this.canvasHeight / (BoardInfo.NUMROWS - 2))
    this.blockSrcDimensions = [0, 0, BlockImageSize, BlockImageSize]
  }

  recalculateSidebar () {
    this.sidebarOffsetX = Math.floor(this.leftSidebarWidth * 0.25)
    this.sidebarOffsetY = Math.floor(this.blockHeight / 2)
    this.sidebarGapY = Math.floor(this.blockHeight / 4)
  }

  handleGameIsOver (isWin) {
    this.stopBlocksFallingInterval()
    this.setFlagsGameIsOver()
    const msg = isWin ? 'You won!' : 'You lost!'
    console.info(msg)
  }

  onBlocksFallingInterval () {
    this.boardManager.dropBlocksWithSpacesBeneath()
  }

  stopBlocksFallingInterval () {
    clearInterval(this.blocksFallingInterval)
    this.blocksFallingInterval = null
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
      // Really need something to say "need to check board again one time"
      this.setFlagsProcessingBoard() // TODO: Need something better
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

  processTheBoard () {
    const blocksThatCanDrop = this.checkBoardForBlocksThatCanDrop()
    const thereAreBlocksToDrop = blocksThatCanDrop.length > 0
    // Don't call this expensive function if there are blocks to drop
    const blocksToBreak = thereAreBlocksToDrop ? [] : this.boardManager.getPossibleBreaks()
    const thereAreBlocksToBreak = blocksToBreak.length > 0
    // Begin by stopping all intervals, just to be sure.
    // Will start them back up, if logic requires it
    this.setFlagsProcessingBoard()
    this.stopBlocksFallingInterval()

    if (thereAreBlocksToDrop) {
      this.boardManager.setBlocksThatNeedToFall(blocksThatCanDrop)
      this.setFlagsDroppingBlocks()
      this.blocksFallingInterval = setInterval(this.onBlocksFallingInterval, 50)
    } else if (thereAreBlocksToBreak) {
      this.boardManager.breakBlocks(blocksToBreak)
      this.soundManager.play('success')
      setImmediate(() => this.processTheBoard())
    } else if (!this.boardManager.canSpawnNewPiece()) {
      this.handleGameIsOver()
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

  updateGameState (newState) {
    this.gameState = Object.assign({}, this.initialState, newState)
  }

  setFlagsControllingPiece () {
    this.updateGameState({
      acceptsUserInput: true,
      pieceIsDropping: true
    })
  }

  setFlagsProcessingBoard () {
    this.updateGameState({ processingTheBoard: true })
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
      this.gameState = Object.assign({}, this.gameStateToRestore.state)
      if (this.gameStateToRestore.blocksFallingInterval) {
        this.blocksFallingInterval = setInterval(this.onBlocksFallingInterval, 50)
      }
    }
    this.tabHasFocus = true
  }

  onTabBlurred () {
    console.log('Pausing')
    this.tabHasFocus = false
    this.gameStateToRestore = {
      state: this.gameState,
      blocksFallingInterval: this.blocksFallingInterval !== null
    }
    this.setFlagsPauseGame()
    this.stopBlocksFallingInterval()
  }
}

export default TetrisGame
