class Break {
  constructor ({ color, cells }) {
    this._color = color || null
    this._cells = cells || []
  }

  addCell (tuple) {
    this._cells.push(tuple)
  }

  addCellMany (tuples) {
    if (Array.isArray(tuples)) {
      this._cells = this._cells.concat(tuples)
    }
  }

  * each () {
    for (const [row, col] of this._cells) {
      yield { color: this._color, row, col }
    }
  }

  get cells () {
    return this._cells
      .map(([row, col]) => ({ color: this._color, row, col }))
  }

  get count () {
    return this._cells.length
  }
}

export default Break
