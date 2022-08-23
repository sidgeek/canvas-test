import { Point2d } from "./point2d"

// 图形的基类
export class Shape {
  constructor() {
    this.listenerMap = new Map()
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

  getMouse(evet) {
    return new Point2d(evet.offsetX, evet.offsetY)
  }
}
