import CanvasHandler from "./CanvasHandler"
import DragHandler from "./DragHandler"
import EventsHandler from "./EventsHandler"
import ZoomHandler from "./ZoomHandler"

class Handlers {
  constructor(props) {
    const { canvas } = props
    const handlerOptions = {
      root: this,
      canvas,
    }

    this.allShapes = []
    this.pointerPos = null
    this.changedPointerPos = null

    this.canvasHandler = new CanvasHandler(handlerOptions)
    this.dragHandler = new DragHandler(handlerOptions)
    this.eventsHandler = new EventsHandler(handlerOptions)
    this.zoomHandler = new ZoomHandler(handlerOptions)
  }


  setPointerPosition(point) {
    this.pointerPos = point;
    this.changedPointerPos = point
  }

  getPointerPosition() {
    return this.changedPointerPos
  }

  add(shape) {
    shape.addRoot(this)
    shape.draw(this.canvasHandler.getCtx())
    this.allShapes.push(shape)
  }

  drawAll() {
    this.canvasHandler.clean()
    this.allShapes.forEach(s => {
      s.draw(this.canvasHandler.getCtx())
    })
  }

  updateCtxTransform(ctx){
    const v = this.canvasHandler.canvas.getViewportTransform()
    ctx.transform(v[0], v[1], v[2], v[3], v[4], v[5])
  }
  

  getAllShapes() {
    return this.allShapes
  }
}
export default Handlers