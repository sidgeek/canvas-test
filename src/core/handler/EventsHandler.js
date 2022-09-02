import { click, move, mouseup, mousewheel } from "../const";
import { DD } from "../DragAndDrop";
import { Point } from "../point";
import { Point2d } from "../point2d";
import BaseHandler from "./BaseHandler";

class EventsHandler extends BaseHandler {
  constructor(props) {
    super(props)
    this.initialize()
  }

  initialize() {
    const canvas  = this.root.canvasHandler.getCanvasEle()
    canvas.addEventListener(move, this.handleEvent(move))
    canvas.addEventListener(click, this.handleEvent(click))
    canvas.addEventListener(mouseup, this.handleEvent(mouseup))

    canvas.addEventListener(mousewheel, this.handleWheel)
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
      const isIn = shape.isPointInClosedRegion(event)
      && !event.isStopBubble

      if (isIn) {
        if (event.type === "mousedown") {
          shape._createDragElement(event)
        }
        if (listerns) {
          listerns.forEach((listener) => listener(event))
        }
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
    this.root.setPointerPosition(event.point)
  }

  handleMouseUp(event) {
    this.root.setPointerPosition(null)
  }

  handleMouseMove(event) {
    if (DD.isDragging) {
      event.preventDefault();
    }

    this.root.setPointerPosition(event.point)
  }

  handleWheel = (evt) => {
    const isCtrlKey = evt.ctrlKey
    if (isCtrlKey) {
      this.handleZoom(evt)
    } else {
      this.handlePan(evt)
    }
  }


  handlePan = event => {
    const delta = event.deltaY
    const deltaX = event.deltaX
    const isShiftKey = event.shiftKey
    let pointX = 0
    let pointY = delta > 0 ? -30 : 30

    if (isShiftKey) {
      pointY = 0
      pointX = deltaX > 0 ? -30 : 30
    }
    const point = new Point(pointX, pointY)
    this.canvas.relativePan(point)
    this.root.drawAll()
  }

  handleZoom = evt => {
    const delta = evt.deltaY
    let zoomRatio = this.canvas.getZoom()
    if (delta > 0) {
      zoomRatio -= 0.02
    } else {
      zoomRatio += 0.02
    }
    // const cp = this.canvas.getCenterPoint()
    const mouse = { x: evt.offsetX, y: evt.offsetY}
    this.root.zoomHandler.zoomToPoint(mouse, zoomRatio)
    this.root.drawAll()
    evt.preventDefault()
    evt.stopPropagation()
  }
}

export default EventsHandler
