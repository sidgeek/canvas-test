import { Point2d } from "../point2d"
import { DD } from "../DragAndDrop"
import { getTransformedPoint } from "../utils/transform"

// 图形的基类


export class Shape {
  constructor(props) {
    const {canvas, x, y, width, height} = props
    this._id = Shape.getId()
    this.ctx = canvas.ctx
    this.x = x
    this.y = y
    this.width = width
    this.height = height

    this.isHovering = false
    this.listenerMap = new Map()
  }

  static id = 0
  static BorderPadding = 2
  static BorderColor = 'blue'
  static LastHoverId = null
  static getId () {
    return Shape.id++
  }

  static checkIsHoverIdUpdate (currentId) {
    const isChange = (Shape.LastHoverId !== currentId)
    Shape.LastHoverId = currentId
    return isChange
  }

  render() {
    if (this.isHovering) {
      const ctx = this.ctx
      const { x, y, width, height } = this
      ctx.save()
      ctx.strokeStyle = Shape.BorderColor
      const b = Shape.BorderPadding
      const b_2 = b * 2
      ctx.strokeRect(x - b, y - b, width + b_2, height + b_2)
      ctx.restore()
    }
  }

  getStartPoint() {
    return {
      x: this.x,
      y: this.y
    }
  }

  updateIsHovering(status) {
    this.isHovering = status
    return this._id
  }

  on(eventName, listener) {
    if (this.listenerMap.has(eventName)) {
      this.listenerMap.get(eventName).push(listener)
    } else {
      this.listenerMap.set(eventName, [listener])
    }
  }

  off(eventName, listener) {
    if (this.listenerMap.has(eventName)) {
      const events = this.listenerMap.get(eventName)
      const id = events.indexOf(listener)
      if (id > -1) {
        events.splice(id, 1)
      }
    }
  }

    // drag & drop
  _createDragElement(canvasPos) {
    // const pos = evt.point
    // shape 的起始位置
    const ap = this.getStartPoint()

    DD._dragElements.set(this._id, {
      node: this,
      startPointerPos: canvasPos,
      offset: {
        x: canvasPos.x - ap.x,
        y: canvasPos.y - ap.y,
      },
      dragStatus: 'ready',
      pointerId: this._id,
    });
  }

  startDrag(evt) {
    if (!DD._dragElements.has(this._id)) {
      this._createDragElement(evt);
    }

    const elem = DD._dragElements.get(this._id);
    elem.dragStatus = 'dragging';
  }

  isDragging() {
    const elem = DD._dragElements.get(this._id);
    return elem ? elem.dragStatus === 'dragging' : false;
  }


  setAbsolutePosition(pos) {
    this.x = pos.x
    this.y = pos.y

    return this
  }

  _setDragPosition(evt, elem) {
    const pos = this.root.getPointerPosition()
    const ctx = this.root.canvasHandler.getCtx()

    if (!pos) {
      return;
    }

    const canvasPos = getTransformedPoint(ctx, pos.x, pos.y)

    const moveX = canvasPos.x - elem.offset.x
    const moveY = canvasPos.y - elem.offset.y
    var newNodePos = {x: moveX, y: moveY}

    if (
      !this._lastPos ||
      this._lastPos.x !== newNodePos.x ||
      this._lastPos.y !== newNodePos.y
    ) {
      this.setAbsolutePosition(newNodePos);
      this.root.renderAll()
    }

    this._lastPos = newNodePos;
  }


  getMouse(evt) {
    return new Point2d(evt.offsetX, evt.offsetY)
  }

  addRoot(root) {
    this.root = root
  }
}
