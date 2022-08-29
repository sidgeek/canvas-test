import BaseHandler from "./BaseHandler";

class CanvasHandler extends BaseHandler {
  constructor(props) {
    super(props)

    this.allShapes = []
    this.pointerPos = null
    this.changedPointerPos = null
  }

  setPointerPosition(point) {
    this.pointerPos = point;
    this.changedPointerPos = point
  }

  getPointerPosition() {
    return this.changedPointerPos
  }

  clean(){}

  add(shape) {
    shape.addRoot(this.root)
    shape.draw(this.ctx)
    this.allShapes.push(shape)
  }

  drawAll() {
    this.clean()
    this.allShapes.forEach(s => {
      s.draw(this.ctx)
    })
  }
}

export default CanvasHandler