import ImageLoader from '../ImageLoader'
import Block from '../Block'
import { ImageLabelsToPaths, BlockImageSize } from './images'
import BoardManager from './BoardManager'
import SetOfIntTuples from './SetOfIntTuples'
import { chanceToGetBreaker } from '../Block/blockTypes'

const debugLog = (msg) => {
  if (false) {
    console.log(msg)
  }
}

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
    debugLog('onEndTurn')
    // TODO: play the tink sound
    this.stopActivePieceDropInterval()
    this.stopBlocksFallingInterval()
    this.setFlagsProcessingBoard()
    this.processTheBoard()
  }

  onCannotSpawn () {
    debugLog('onCannotSpawn')
    this.stopActivePieceDropInterval()
    this.stopBlocksFallingInterval()
    this.setFlagsProcessingBoard()
    this.processTheBoard()
  }

  onDoneDroppingBlocks () {
    debugLog('onDoneDroppingBlocks')
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
    debugLog('onPieceDropInterval')
    this.boardManager.dropTheActivePiece()
  }

  onBlocksFallingInterval () {
    debugLog('onBlocksFallingInterval')
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
    debugLog('processTheBoard')
    const blocksThatCanDrop = this.checkBoardForBlocksThatCanDrop()
    const thereAreBlocksToDrop = blocksThatCanDrop.length > 0
    const thereAreBlocksToBreak = false // TODO: Placeholder
    // Don't call this expensive function if there are blocks to drop
    const blocksToBreak = thereAreBlocksToDrop ? [] : this.checkBoardForBlocksToBreak()

    // Begin by stopping all intervals, just to be sure
    // Will start them back up, if logic requires it
    this.stopActivePieceDropInterval()
    this.stopBlocksFallingInterval()

    if (thereAreBlocksToDrop) {
      debugLog('There are blocks to drop:', blocksThatCanDrop)
      this.boardManager.setBlocksThatNeedToFall(blocksThatCanDrop)
      this.setFlagsDroppingBlocks()
      this.blocksFallingInterval = setInterval(this.onBlocksFallingInterval, 100)
    } else if (thereAreBlocksToBreak) {
      // TODO: Check if there is stuff to break

    } else if (!this.boardManager.canSpawnNewPiece()) {
      debugLog('No blocks to drop & cannot spawn piece.')
      this.handleGameIsOver()
    } else {
      debugLog('There are no blocks to drop and game is not over.')
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

  checkBoardForBlocksToBreak () {
    console.log('Checking for BREAKS')
    return this.boardManager.getPossibleBreaks()
  }

  /*
    function breakBlocks(color, curPosRow, curPosCol, flag) {
			// Check above
			if( (curPosRow-1 >= 2) && (gridArray[curPosRow-1][curPosCol] != 0) ) { 
				if(gridArray[curPosRow-1][curPosCol].getColor() == color) {
					if (gridArray[curPosRow-1][curPosCol].isUsable() == true) {
						var rowAbove = curPosRow-1;
						if ( isThingInArray({row:rowAbove, col:curPosCol}, flag) == false ) {
							// Push the above block to the array
							flag.push({row: rowAbove, col: curPosCol});
							breakBlocks(color, rowAbove, curPosCol, flag);
						}
						if ( isThingInArray({row:curPosRow, col:curPosCol}, flag) == false ) {
							// Push the current block to the array
							flag.push({row: curPosRow, col: curPosCol});
						}
					}
				}
			}
			// Check left
			if( (curPosCol-1 >= 0) && (gridArray[curPosRow][curPosCol-1]) ) {
				if(gridArray[curPosRow][curPosCol-1].getColor() == color) {
					if (gridArray[curPosRow][curPosCol-1].isUsable() == true) {
						// The col of the cell to the left
						var colLeft = curPosCol-1;
						if ( isThingInArray({row:curPosRow, col:colLeft}, flag) == false ) {
							// Push the left block to the array
							flag.push({row: curPosRow, col: colLeft});
							breakBlocks(color, curPosRow, colLeft, flag);
						}
						if ( isThingInArray({row:curPosRow, col:curPosCol}, flag) == false ) {
							// Push the current block to the array
							flag.push({row: curPosRow, col: curPosCol});
						}
					}
				}
			}
			// Check right
			if( (curPosCol+1 < LEVELONE.NUMCOLS) && (gridArray[curPosRow][curPosCol+1]) ) {
				if(gridArray[curPosRow][curPosCol+1].getColor() == color) {
					if (gridArray[curPosRow][curPosCol+1].isUsable() == true) {
						var colRight = curPosCol+1;
						if ( isThingInArray({row:curPosRow, col:colRight}, flag) == false ) {
							// Push the right block to the array
							flag.push({row: curPosRow, col: colRight});
							breakBlocks(color, curPosRow, colRight, flag);
						}
						// If the current block isn't already in the array, add it
						if ( isThingInArray({row:curPosRow, col:curPosCol}, flag) == false ) {
							// Push the current block to the array
							flag.push({row: curPosRow, col: curPosCol});
						}
					}
				}
			}
			// Check below
			if( (curPosRow+1 < LEVELONE.NUMROWS) && (gridArray[curPosRow+1][curPosCol]) ) {
				if(gridArray[curPosRow+1][curPosCol].getColor() == color) {
					if (gridArray[curPosRow+1][curPosCol].isUsable() == true) {
						var rowBelow = curPosRow+1;
						if ( isThingInArray({row:rowBelow, col:curPosCol}, flag) == false ) {
							// Push the block below, to the array
							flag.push({row: rowBelow, col: curPosCol});
							breakBlocks(color, rowBelow, curPosCol, flag);
						}
						// If the current block isn't already in the array, add it
						if ( isThingInArray({row:curPosRow, col:curPosCol}, flag) == false ) {
							// Push the current block to the array
							flag.push({row: curPosRow, col: curPosCol});
						}	
					}			
				}
			}
			
			// return array
			return flag;
		}
  */

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
