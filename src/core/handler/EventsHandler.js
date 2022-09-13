import { EVENT } from "../types/const";
import { DD } from "./DragAndDrop";
// import { Point } from "../point";
import { Point2d } from "../point2d";
import { Shape } from "../shape/shape";
import { getTransformedPoint } from "../utils/transform";
import BaseHandler from "./BaseHandler";
import { getShapePosCursor } from "../utils/cursorHelper";

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
    canvas.addEventListener(EVENT.MouseMove, this.handleEvent(EVENT.MouseMove).bind(this))
    canvas.addEventListener(EVENT.Mousedown, this.handleEvent(EVENT.Mousedown).bind(this))
    canvas.addEventListener(EVENT.Mouseup, this.handleEvent(EVENT.Mouseup).bind(this))

    canvas.addEventListener(EVENT.Mousewheel, this.handleWheel)
  }

  getNewEvent(event) {
    const point = new Point2d(event.offsetX, event.offsetY)
    event.point = point
    event.isStopBubble = false
    return event
  }

  getMatchedShapes(event, isGetMulti) {
    const ctx = this.canvas.getCtx()
    const canvasPos = getTransformedPoint(ctx, event.point.x, event.point.y)
    const shapes = this.root.getAllShapes() 

    let matchedShapes = []
    for(let i = 0; i < shapes.length; i++) {
      let shape = shapes[i]
      const { isIn } = shape.isPointInClosedRegion(canvasPos)
      if (!isIn) { continue }

      if (!isGetMulti) {
        return [shape]
      }
      
      matchedShapes.push(shape)
    }

    return matchedShapes
  }

  getMatchedShape(event) {
    const mShapes = this.getMatchedShapes(event, false)
    return mShapes.length > 0 ? mShapes[0] : null
  }

  handleEvent = (name) => (event) => {
    event = this.getNewEvent(event)
    const ctx = this.canvas.getCtx()
    const canvasPos = getTransformedPoint(ctx, event.point.x, event.point.y)

    const shapes = this.root.getAllShapes() 
    if (shapes.length === 0) return

    this.preHandleEvent(name, event)

    shapes.forEach(s => s.updateIsHovering(false))

    let hoverId = null
    let curShapePos = 0
    const { type } = event
    
    for(let i = 0; i < shapes.length; i++) {
      let shape = shapes[i]
      const {isIn, shapePos} = shape.isPointInClosedRegion(canvasPos)
      if (!isIn) { continue }

      if (type === EVENT.MouseMove) { 
        hoverId = shape.updateIsHovering(true)
        curShapePos = shapePos
        break 
      } else if (type === EVENT.Mousedown) {
        if (!DD._dragElements.has(shape._id)) {
          DD._createDragElement(canvasPos, shape);
        }
        break 
      }
    }

    const isHoverChange = Shape.checkIsHoverIdUpdate(hoverId)
    const isShapePosChange = Shape.checkIsShapePosUpdate(curShapePos)

    if (isHoverChange || isShapePosChange) {
      const cursor = getShapePosCursor(curShapePos)
      this.root.canvasHandler.updateCursor(cursor)
      this.root.renderAll()
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

    const matchedShape = this.getMatchedShape(event)
    console.log(".. M", matchedShape);
    // const lastShapes = Shape.getLastSelectedShapes()
    if (matchedShape) {
      Shape.addLastSelectedShapes(matchedShape)
      matchedShape.updateIsSelected(true)
    } else {
      Shape.cleanLastSelectedShapes()
    }
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
