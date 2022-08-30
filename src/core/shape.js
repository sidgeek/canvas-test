import { Point2d } from "./point2d"
import { DD } from "./DragAndDrop"

// 图形的基类
export class Shape {
  constructor(props) {
    const {x, y} = props
    this._id = Shape.getId()
    this.x = x
    this.y = y
    // console.log('>>> id:', this._id);
    this.listenerMap = new Map()
  }

  static id = 0
  static getId () {
    return Shape.id++
  }

  getStartPoint() {
    return {
      x: this.x,
      y: this.y
    }
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
  _createDragElement(evt) {
    if (this._id > 3) return
    const pos = evt.point
    // shape 的起始位置
    const ap = this.getStartPoint()

    DD._dragElements.set(this._id, {
      node: this,
      startPointerPos: pos,
      offset: {
        x: pos.x - ap.x,
        y: pos.y - ap.y,
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
    // this.fire(
    //   'dragstart',
    //   {
    //     type: 'dragstart',
    //     target: this,
    //     evt: evt && evt.evt,
    //   },
    //   bubbleEvent
    // );
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
    // const pointers = this.getStage().getPointersPositions();
    // const pos = pointers.find(p => p.id === this._dragEventId);
    // const pos = this.getStage()._getPointerById(elem.pointerId);
    const pos = this.root.getPointerPosition()

    if (!pos) {
      return;
    }
    var newNodePos = {
      x: pos.x - elem.offset.x,
      y: pos.y - elem.offset.y,
    };


    // var dbf = this.dragBoundFunc();
    // if (dbf !== undefined) {
    //   const bounded = dbf.call(this, newNodePos, evt);
    //   if (!bounded) {
    //     Util.warn(
    //       'dragBoundFunc did not return any value. That is unexpected behavior. You must return new absolute position from dragBoundFunc.'
    //     );
    //   } else {
    //     newNodePos = bounded;
    //   }
    // }

    if (
      !this._lastPos ||
      this._lastPos.x !== newNodePos.x ||
      this._lastPos.y !== newNodePos.y
    ) {
      this.setAbsolutePosition(newNodePos);
      this.root.drawAll()
    }

    this._lastPos = newNodePos;
  }


  getMouse(evet) {
    return new Point2d(evet.offsetX, evet.offsetY)
  }

  addRoot(root) {
    this.root = root
  }
}
