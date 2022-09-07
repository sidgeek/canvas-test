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
    this.allShapes.push(shape)
    this.renderAll()
  }

  renderAll() {
    this.canvasHandler.clean()
    this.allShapes.forEach(s => {
      s.render()
    })
  }


  getAllShapes() {
    return this.allShapes
  }
}
export default Handlers