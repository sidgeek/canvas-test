import { EVENT } from "../types/const";
import { Point } from "../point2d";
import { getTransformedPoint } from "../utils/transform";
import BaseHandler from "./BaseHandler";

let currentTransformedCursor
const mousePos = document.getElementById('mouse-pos');
const transformedMousePos = document.getElementById('transformed-mouse-pos');

class EventsHandler extends BaseHandler {
  constructor(props) {
    super(props)
    this.initialize()
  }

  initialize() {
    const canvas  = this.root.canvasHandler.getCanvasEle()
    canvas.addEventListener(EVENT.MouseMove, this.handleEvent(EVENT.MouseMove).bind(this))
    canvas.addEventListener(EVENT.Mousedown, this.handleEvent(EVENT.Mousedown).bind(this))
    canvas.addEventListener(EVENT.Mouseup, this.handleEvent(EVENT.Mouseup).bind(this))

    canvas.addEventListener(EVENT.Mousewheel, this.handleWheel)
  }

  getNewEvent(event) {
    const point = new Point(event.offsetX, event.offsetY)
    event.point = point
    event.isStopBubble = false
    return event
  }


  getMatchedShape(event) {
    const mShapes = this.getMatchedShapes(event, false)
    return mShapes.length > 0 ? mShapes[0] : null
  }

  handleEvent = (name) => (event) => {
    event = this.getNewEvent(event)

    this.preHandleEvent(name, event)
    this.afterHandleEvent(name, event)
  }

  preHandleEvent = (name, event) => {
    switch (name) {
      case EVENT.Mousedown: {
        this.handleMouseDown(event)
        break
      }

      case EVENT.Mouseup: {
        this.handleMouseUp(event)
        break
      }

      case EVENT.MouseMove: {
        this.handleMouseMove(event)
        break
      }

      default: {

      }
    }
  }


  afterHandleEvent = (name, event) => {
  }


  handleMouseDown(event) {
    this.root.canvasHandler.__onMouseDown(event)
  }

  handleMouseUp(event) {
    this.root.canvasHandler.__onMouseUp(event)
  }

  handleMouseMove(event) {
    const ctx = this.canvas.getCtx()
    currentTransformedCursor = getTransformedPoint(ctx, event.offsetX, event.offsetY);
    mousePos.innerText = `Original X: ${event.offsetX}, Y: ${event.offsetY}`;
    transformedMousePos.innerText = `Transformed X: ${currentTransformedCursor.x}, Y: ${currentTransformedCursor.y}`;

    this.root.canvasHandler.__onMouseMove(event)
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
    // const delta = event.deltaY
    // const deltaX = event.deltaX
    // const isShiftKey = event.shiftKey
    // let pointX = 0
    // let pointY = delta > 0 ? -30 : 30

    // if (isShiftKey) {
    //   pointY = 0
    //   pointX = deltaX > 0 ? -30 : 30
    // }

    // const context = this.canvas.getCtx()
    // context.translate(pointX, pointY);
    // this.root.renderAll()
  }

  handleZoom = evt => {
    // const zoom = evt.deltaY < 0 ? 1.1 : 0.9;
    // const context = this.canvas.getCtx()

    // context.translate(currentTransformedCursor.x, currentTransformedCursor.y);
    // context.scale(zoom, zoom);
    // context.translate(-currentTransformedCursor.x, -currentTransformedCursor.y);
    
    // this.root.renderAll()
    // evt.preventDefault()
    // evt.stopPropagation()
  }
}

export default EventsHandler
