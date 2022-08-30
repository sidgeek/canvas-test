import { click, move, mouseup } from "../const";
import { DD } from "../DragAndDrop";
import { Point2d } from "../point2d";
import BaseHandler from "./BaseHandler";

class EventsHandler extends BaseHandler {
  constructor(props) {
    super(props)
    this.initialize()
  }

  initialize() {
    const { canvas } = this.canvas
    canvas.addEventListener(move, this.handleEvent(move))
    canvas.addEventListener(click, this.handleEvent(click))
    canvas.addEventListener(mouseup, this.handleEvent(mouseup))
  }

  getNewEvent(event) {
    const point = new Point2d(event.offsetX, event.offsetY)
    event.point = point
    event.isStopBubble = false
    return event
  }

  handleEvent = (name) => (event) => {
    event = this.getNewEvent(event)
    this.preHandleEvent(name, event)
    this.root.getAllShapes().forEach((shape) => {
      // 获取当前事件的所有监听者
      const listerns = shape.listenerMap.get(name)
      if (
        listerns &&
        shape.isPointInClosedRegion(event)
        && !event.isStopBubble
      ) {
        shape._createDragElement(event)
        listerns.forEach((listener) => listener(event))
      }
    })
  }

  preHandleEvent = (name, event) => {
    switch (name) {
      case click: {
        this.handleMouseDown(event)
        break
      }

      case mouseup: {
        this.handleMouseUp(event)
        break
      }

      case move: {
        this.handleMouseMove(event)
        break
      }

      default: {

      }
    }
  }


  handleMouseDown(event) {
    this.root.canvasHandler.setPointerPosition(event.point)
  }

  handleMouseUp(event) {
    this.root.canvasHandler.setPointerPosition(null)
  }

  handleMouseMove(event) {
    if (DD.isDragging) {
      event.preventDefault();
    }

    this.root.canvasHandler.setPointerPosition(event.point)
  }
}

export default EventsHandler