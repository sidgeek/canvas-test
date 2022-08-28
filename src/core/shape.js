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

  getMouse(evet) {
    return new Point2d(evet.offsetX, evet.offsetY)
  }
}
