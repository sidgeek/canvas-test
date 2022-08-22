export class Canvas {
  constructor() {
    this.canvas = document.getElementById('canvas')
    this.ctx = this.canvas.getContext('2d')
    this.allShapes = []
  }

  add(shape) {
    shape.draw(this.ctx)
    this.allShapes.push(shape)
  }
}

