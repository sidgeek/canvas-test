export class Canvas {
  constructor() {
    this.canvas = document.getElementById('canvas')
    this.ctx = this.canvas.getContext('2d')
    this.width = 800
    this.height = 600
  }

  clean() {
    this.canvas.width = this.width
    this.canvas.height = this.height
  }
}

