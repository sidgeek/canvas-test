export class Canvas {
  constructor() {
    this._canvas = document.getElementById('canvas')
    this.ctx = this._canvas.getContext('2d')
    this.width = 800
    this.height = 600
  }

  updateSize(w, h) {
    this.width = w
    this.height = h
  }
}

