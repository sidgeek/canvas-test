import { EVENT } from "../const";
import { DD } from "../DragAndDrop";
// import { Point } from "../point";
import { Point2d } from "../point2d";
import { getTransformedPoint } from "../utils/transform";
import BaseHandler from "./BaseHandler";

let currentTransformedCursor
let dragStartPosition = { x: 0, y: 0 };
let isDragging = false
const mousePos = document.getElementById('mouse-pos');
const transformedMousePos = document.getElementById('transformed-mouse-pos');

class EventsHandler extends BaseHandler {
  constructor(props) {
    super(props)
    this.initialize()
  }

  initialize() {
    const canvas  = this.root.canvasHandler.getCanvasEle()
    canvas.addEventListener(EVENT.MouseMove, this.handleEvent(EVENT.MouseMove))
    canvas.addEventListener(EVENT.Mousedown, this.handleEvent(EVENT.Mousedown))
    canvas.addEventListener(EVENT.Mouseup, this.handleEvent(EVENT.Mouseup))

    canvas.addEventListener(EVENT.Mousewheel, this.handleWheel)
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
    const ctx = this.canvas.getCtx()
    const canvasPos = getTransformedPoint(ctx, event.point.x, event.point.y)

    const shapes = this.root.getAllShapes() 

    shapes.forEach(s => s.updateIsHovering(false))

    for(let i = 0; i < shapes.length; i++) {
      let shape = shapes[i]

      const isIn = shape.isPointInClosedRegion(canvasPos)
      && !event.isStopBubble

      if (isIn) {
        if (event.type === EVENT.MouseMove) {
          shape.updateIsHovering(true)
          break 
        }

        if (event.type === EVENT.Mousedown) {
          shape._createDragElement(canvasPos)
          break 
        }
      }
    }
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


  handleMouseDown(event) {
    isDragging = true;
    const ctx = this.canvas.getCtx()
    dragStartPosition = getTransformedPoint(ctx, event.offsetX, event.offsetY);
    this.root.setPointerPosition(event.point)
    // this.root.setPointerPosition(dragStartPosition)
  }

  handleMouseUp(event) {
    isDragging = false
    this.root.setPointerPosition(null)
  }

  handleMouseMove(event) {
    this.root.setPointerPosition(event.point)
    const ctx = this.canvas.getCtx()
    currentTransformedCursor = getTransformedPoint(ctx, event.offsetX, event.offsetY);
    mousePos.innerText = `Original X: ${event.offsetX}, Y: ${event.offsetY}`;
    transformedMousePos.innerText = `Transformed X: ${currentTransformedCursor.x}, Y: ${currentTransformedCursor.y}`;

    if (DD.isDragging) {
      event.preventDefault();
    } else if (isDragging){
      // const mvX= currentTransformedCursor.x - dragStartPosition.x
      // const mvY= currentTransformedCursor.y - dragStartPosition.y
      // ctx.translate(mvX, mvY);
    }
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

    const context = this.canvas.getCtx()
    context.translate(pointX, pointY);
    this.root.renderAll()
  }

  handleZoom = evt => {
    const zoom = evt.deltaY < 0 ? 1.1 : 0.9;
    const context = this.canvas.getCtx()

    context.translate(currentTransformedCursor.x, currentTransformedCursor.y);
    context.scale(zoom, zoom);
    context.translate(-currentTransformedCursor.x, -currentTransformedCursor.y);
    
    this.root.renderAll()
    evt.preventDefault()
    evt.stopPropagation()
  }
}

export default EventsHandler
