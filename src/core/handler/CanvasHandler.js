import BaseHandler from "./BaseHandler";

class CanvasHandler extends BaseHandler {
  constructor(props) {
    super(props)

    this.allShapes = []
    this.pointerPos = null
  }

  setPointerPosition(evt) {
    this.pointerPos = evt.point;
  }

  add(shape) {
    shape.draw(this.ctx)
    this.allShapes.push(shape)
  }
}

export default CanvasHandler