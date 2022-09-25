import { Point2d } from "./point2d"

export class Canvas {
  constructor() {
    this._canvas = document.getElementById('canvas')
    this.ctx = this._canvas.getContext('2d')
    this.width = 800
    this.height = 600
  }


  getCtx() {
    return this.ctx
  }

  getWidth() {
    return this.width / 2
  }

  getHeight() {
    return this.height / 2
  }

  getCenter() {
    return {
      x: this.height / 2,
      y: this.width / 2
    };
  }

  getCenterPoint() {
    return new Point2d(this.height / 2, this.width / 2)
  }


  updateSize(w, h) {
    this.width = w
    this.height = h
  }
}

