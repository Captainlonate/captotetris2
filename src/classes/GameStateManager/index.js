class GameStateManager {
  constructor () {
    this._state = this.getEmptyState()
    this._stateToRestoreLater = null
    this._gameHasStarted = false
  }

  getEmptyState () {
    return {
      acceptsUserInput: false,
      needToProcessTheBoard: false,
      droppingBlocks: false,
      pieceIsDropping: false,
      gameIsOver: false,
      gameIsPaused: false,
      // breakingBlocks: false, // TODO: Remove
      borderingBlocks: false,
      shatteringBlocks: false
    }
  }

  get hasStarted () {
    return this._gameHasStarted
  }

  get acceptsUserInput () {
    return this._state.acceptsUserInput
  }

  get needToProcessTheBoard () {
    return this._state.needToProcessTheBoard
  }

  get droppingBlocks () {
    return this._state.droppingBlocks
  }

  get pieceIsDropping () {
    return this._state.pieceIsDropping
  }

  get gameIsOver () {
    return this._state.gameIsOver
  }

  get gameIsPaused () {
    return this._state.gameIsPaused
  }

  // get breakingBlocks () {
  //   return this._state.breakingBlocks
  // }

  get borderingBlocks () {
    return this._state.borderingBlocks
  }

  get shatteringBlocks () {
    return this._state.shatteringBlocks
  }

  updateGameState (newState) {
    this._state = Object.assign(this.getEmptyState(), newState)
  }

  setControllingPiece () {
    this.updateGameState({ acceptsUserInput: true, pieceIsDropping: true })
  }

  setProcessingBoard () {
    this.updateGameState({ needToProcessTheBoard: true })
  }

  setDroppingBlocks () {
    this.updateGameState({ droppingBlocks: true })
  }

  setGameIsOver () {
    this.updateGameState({ gameIsOver: true })
  }

  setPauseGame () {
    this.updateGameState({ gameIsPaused: true })
  }

  // setBreakingBlocks () {
  //   this.updateGameState({ breakingBlocks: true })
  // }

  setBorderingBlocks () {
    this.updateGameState({ borderingBlocks: true })
  }

  setShatteringBlocks () {
    this.updateGameState({ shatteringBlocks: true })
  }

  set hasStarted (isStarted) {
    this._gameHasStarted = Boolean(isStarted)
  }

  stashCurrentState () {
    this._stateToRestoreLater = Object.assign({}, this._state)
  }

  restoreStashedState () {
    if (this._stateToRestoreLater !== null) {
      this._state = Object.assign({}, this._stateToRestoreLater)
      this._stateToRestoreLater = null
    }
  }
}

export default GameStateManager
