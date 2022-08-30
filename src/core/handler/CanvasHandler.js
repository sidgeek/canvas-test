import BaseHandler from "./BaseHandler";

class CanvasHandler extends BaseHandler {
  constructor(props) {
    super(props)
    this.initialize()
  }

  initialize() {}

  clean() {
    this.canvas.clean()
  }

  getCtx() {
    return this.canvas.ctx
  }
}

export default CanvasHandler