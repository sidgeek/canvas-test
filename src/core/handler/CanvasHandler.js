import BaseHandler from "./BaseHandler";

class CanvasHandler extends BaseHandler {
  constructor(props) {
    super(props)
    this.initialize()
  }

  initialize() {
    const canvasEle = this.getCanvasEle()
    canvasEle.width = this.canvas.width
    canvasEle.height = this.canvas.height
    canvasEle.style.border = '1px solid red'
  }


  clean() {
    const canvasEle = this.getCanvasEle()
    canvasEle.width = this.canvas.width
    canvasEle.height = this.canvas.height
  }

  getCanvasEle() {
    return this.canvas._canvas
  }

  getCtx() {
    return this.canvas.ctx
  }
}

export default CanvasHandler