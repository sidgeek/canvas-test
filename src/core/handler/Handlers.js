import CanvasHandler from "./CanvasHandler"
import DragHandler from "./DragHandler"
import EventsHandler from "./EventsHandler"

class Handlers {
  constructor(props) {
    const { canvas } = props
    const handlerOptions = {
      root: this,
      canvas,
    }

    this.canvasHandler = new CanvasHandler(handlerOptions)
    this.dragHandler = new DragHandler(handlerOptions)
    this.eventsHandler = new EventsHandler(handlerOptions)
  }


  getAllShapes() {
    return this.canvasHandler.allShapes
  }
}
export default Handlers